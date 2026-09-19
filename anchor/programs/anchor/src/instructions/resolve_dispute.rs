use anchor_lang::prelude::*;

use crate::constants::{ADMIN_PUBKEY, VAULT_SEED};
use crate::errors::ErrorCode;
use crate::state::{ListingAccount, ListingStatus};

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    #[account(mut)]
    pub listing_account: Account<'info, ListingAccount>,
    #[account(mut)]
    /// CHECK: The destination is selected from the listing's recorded buyer/seller.
    pub winner: UncheckedAccount<'info>,
    #[account(mut, seeds = [VAULT_SEED, listing_account.key().as_ref()], bump = listing_account.vault_bump)]
    /// CHECK: The vault PDA is validated by its seeds and owned by this program.
    pub escrow_vault: UncheckedAccount<'info>,
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handle_resolve_dispute(ctx: Context<ResolveDispute>, winner_is_buyer: bool) -> Result<()> {
    require_keys_eq!(ctx.accounts.admin.key(), ADMIN_PUBKEY, ErrorCode::UnauthorizedAdmin);
    let listing = &mut ctx.accounts.listing_account;
    require!(listing.status == ListingStatus::InDispute, ErrorCode::InvalidStatus);

    let expected_winner = if winner_is_buyer {
        listing.buyer.ok_or(ErrorCode::BuyerRequired)?
    } else {
        listing.seller
    };
    require_keys_eq!(expected_winner, ctx.accounts.winner.key(), ErrorCode::InvalidWinner);

    // 1. CHECKS & EFFECTS (CEI Pattern): State transition executed BEFORE transfer to prevent Reentrancy
    listing.status = if winner_is_buyer {
        ListingStatus::Completed
    } else {
        ListingStatus::Cancelled
    };

    let amount = ctx.accounts.escrow_vault.to_account_info().lamports();

    // Manual lamport transfer instead of CPI since vault is owned by the program
    **ctx.accounts.escrow_vault.to_account_info().try_borrow_mut_lamports()? -= amount;
    **ctx.accounts.winner.to_account_info().try_borrow_mut_lamports()? += amount;

    Ok(())
}
