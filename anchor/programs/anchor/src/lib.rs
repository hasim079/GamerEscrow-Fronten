pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("EjhkjCLXe6aPg1zpSi9ihJemo4JvYVacQzSi8Nbczytp");

#[program]
pub mod gamer_escrow {
    use super::*;

    pub fn create_listing(
        ctx: Context<CreateListing>,
        price: u64,
        data_hash: [u8; 32],
    ) -> Result<()> {
        instructions::create_listing::handle_create_listing(ctx, price, data_hash)
    }

    pub fn buy_item(ctx: Context<BuyItem>) -> Result<()> {
        instructions::buy_item::handle_buy_item(ctx)
    }

    pub fn release_funds(ctx: Context<ReleaseFunds>) -> Result<()> {
        instructions::release_funds::handle_release_funds(ctx)
    }

    pub fn resolve_dispute(
        ctx: Context<ResolveDispute>,
        winner_is_buyer: bool,
    ) -> Result<()> {
        instructions::resolve_dispute::handle_resolve_dispute(ctx, winner_is_buyer)
    }

    pub fn cancel_listing(ctx: Context<CancelListing>) -> Result<()> {
        instructions::cancel_listing::handle_cancel_listing(ctx)
    }

    pub fn open_dispute(ctx: Context<OpenDispute>) -> Result<()> {
        instructions::open_dispute::handle_open_dispute(ctx)
    }
}
