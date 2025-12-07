# Devnet Solana Meme Coin (Learning Project)

This is a small, transparent SPL token I created on **Solana devnet** as a learning/portfolio project.
It uses the **standard SPL Token Program** with **no custom token logic**.

## Disclaimer
This is for educational purposes only.
No promises, no roadmap, no expectation of profit.
Do not treat this as an investment.

## How to review this project (quick)

If you’re scanning this repo as a recruiter/client:

1. **README.md** – overview of the token + trust posture.
2. **NOTES.md** – short case study of my design choices and what I learned.
3. **COMMANDS.md** – runbook showing the full CLI flow.

### Trust proof highlights (devnet)
- Standard SPL Token Program
- Fixed supply (mint authority removed)
- No freeze authority

### Devnet addresses
- Mint: CgELqM37jwP5K1dQFpNnKyEQwLti1REnsgmSmLhqzfdD
- My ATA: 2dj96iijr74fcDBNsWj14y9CP33qRo1AZMbf79kMnkWc


## Token Details (Devnet)
- **Mint address:** CgELqM37jwP5K1dQFpNnKyEQwLti1REnsgmSmLhqzfdD
- **Program:** TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
- **Decimals:** 9
- **Intended total supply:** 1,000,000,000
- **My token account (ATA):** 2dj96iijr74fcDBNsWj14y9CP33qRo1AZMbf79kMnkWc

## Trust / Safety Configuration
- **Mint authority:** not set (fixed supply)
- **Freeze authority:** not set

This means:
- No additional tokens can be minted.
- Token accounts cannot be frozen by an owner.

## Commands Used (High-Level)

```bash
# Devnet + wallet
solana config set --url https://api.devnet.solana.com
solana-keygen new --outfile ~/meme-coin-devnet.json
solana config set --keypair ~/meme-coin-devnet.json
solana airdrop 2

# Token
spl-token create-token --decimals 9
spl-token create-account <MINT_ADDRESS>
spl-token mint <MINT_ADDRESS> 1000000000 <TOKEN_ACCOUNT_ADDRESS>

# Lock mint authority (fixed supply)
spl-token authorize <MINT_ADDRESS> mint --disable

# Confirm state
spl-token display <MINT_ADDRESS>
