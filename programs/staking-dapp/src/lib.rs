use anchor_lang::prelude::*;

declare_id!("J8qffRvdFDCTC2EFbskn4PjrT8sfqYuEPRuSZcTPx5Ne");

#[program]
pub mod staking_dapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
