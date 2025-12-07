# Solana SPL Token Runbook (Devnet)

This document captures the exact high-level command flow used to create and lock
a transparent SPL token on Solana devnet.

## Network + wallet

```bash
solana --version
solana config set --url https://api.devnet.solana.com

# Project wallet
solana-keygen new --outfile ~/meme-coin-devnet.json
solana config set --keypair ~/meme-coin-devnet.json
solana address

# Fund devnet wallet
solana airdrop 2
solana balance

spl-token create-token --decimals 9
spl-token create-account CgELqM37jwP5K1dQFpNnKyEQwLti1REnsgmSmLhqzfdD
spl-token mint CgELqM37jwP5K1dQFpNnKyEQwLti1REnsgmSmLhqzfdD 1000000000 2dj96iijr74fcDBNsWj14y9CP33qRo1AZMbf79kMnkWc
spl-token supply CgELqM37jwP5K1dQFpNnKyEQwLti1REnsgmSmLhqzfdD
spl-token balance CgELqM37jwP5K1dQFpNnKyEQwLti1REnsgmSmLhqzfdD

spl-token authorize CgELqM37jwP5K1dQFpNnKyEQwLti1REnsgmSmLhqzfdD mint --disable
spl-token display CgELqM37jwP5K1dQFpNnKyEQwLti1REnsgmSmLhqzfdD

Known addresses (devnet)

Mint: CgELqM37jwP5K1dQFpNnKyEQwLti1REnsgmSmLhqzfdD

My ATA: 2dj96iijr74fcDBNsWj14y9CP33qRo1AZMbf79kMnkWc

Owner wallet: 3jzvDAyMoP8pc7KbAdjf4oXJAngpeKjZzZKGrqrxqhTk
