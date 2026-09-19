use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Only the configured admin can resolve disputes")]
    UnauthorizedAdmin,
    #[msg("The listing is not in a valid state for this operation")]
    InvalidStatus,
    #[msg("A buyer is required for this operation")]
    BuyerRequired,
    #[msg("The caller is not the listing buyer")]
    UnauthorizedBuyer,
    #[msg("The caller is not the listing seller")]
    UnauthorizedSeller,
    #[msg("The listing price must be greater than zero")]
    InvalidPrice,
    #[msg("Escrow 24-hour inspection lock period is active. Seller cannot cancel or withdraw.")]
    LockPeriodActive,
    #[msg("Escrow inspection period has not expired yet.")]
    LockPeriodNotExpired,
    #[msg("Invalid dispute winner account specified.")]
    InvalidWinner,
}