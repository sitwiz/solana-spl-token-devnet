# Solana SPL Token Case Study (Devnet)

## Goal
Create a small meme coin on Solana devnet as a learning + portfolio project,
focused on transparent, non-scammy defaults.

## What I built
A standard SPL token using the official token program with:
- 9 decimals
- Intended supply of 1,000,000,000
- No custom transfer logic

## On-chain trust configuration
I locked the token down so it cannot be abused by an owner:

- **Standard program:** TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
- **Mint authority:** not set (fixed supply)
- **Freeze authority:** not set

This means:
- I cannot mint more tokens later.
- I cannot freeze holders’ accounts.

## Key addresses (Devnet)
- **Mint:** CgELqM37jwP5K1dQFpNnKyEQwLti1REnsgmSmLhqzfdD
- **My ATA:** 2dj96iijr74fcDBNsWj14y9CP33qRo1AZMbf79kMnkWc

## Commands used (high-level)
- Solana CLI setup in WSL
- `spl-token create-token`
- `spl-token create-account`
- `spl-token mint`
- `spl-token authorize ... mint --disable`
- `spl-token display`

## What I learned
- Working with Solana CLI and devnet
- SPL token lifecycle and authority model
- Associated Token Accounts (ATA)
- How to design and document a transparent token project

## What I would do next
- Add token metadata (name/symbol/image)
- Create a tiny devnet liquidity pool for demonstration
- Build a simple one-page site that links explorer + GitHub

