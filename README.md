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

## Token v2 (Devnet, metadata-first)

This version demonstrates the correct sequencing for Token Metadata.

- **Mint v2:** 9CatQXAxvq5cm75MAvGpEoUsVtmthsc5pHdMstaStZsg
- **Metadata account:** AXzn9ZEK6yaWiDPcLFet27JfvNQkPFiaiTUod6iXdcqY
- **URI:** https://raw.githubusercontent.com/sitwiz/solana-spl-token-devnet/main/metadata.json

### Why v2 exists
My first mint was locked (mint authority removed) before adding metadata.
Since creating metadata requires the appropriate authority during setup,
I created a second devnet mint using a metadata-first flow.

### Final trust posture (v2)
- Mint authority: not set
- Freeze authority: not set


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

## Project summary

This repo documents a transparent SPL token learning project on Solana **devnet**.
My goal was to understand the full token lifecycle and ship something that demonstrates
safe, non-scammy defaults and good documentation.

### What this demonstrates
- Creating an SPL mint and associated token account (ATA)
- Minting an intended supply
- Removing owner powers (fixed supply + no freeze)
- Adding Metaplex metadata correctly
- Writing a clear runbook and case study

### v1 vs v2 (key lesson)
- **v1 mint:** CgELqM37jwP5K1dQFpNnKyEQwLti1REnsgmSmLhqzfdD  
  Trust-first, fixed supply, no freeze — but I disabled mint authority before adding metadata.
- **v2 mint:** 9CatQXAxvq5cm75MAvGpEoUsVtmthsc5pHdMstaStZsg  
  Metadata-first, then supply minted, then authorities removed.

This demonstrates the correct sequencing:
1. Create mint + metadata
2. Mint intended supply
3. Disable mint/freeze authorities

## TypeScript scripts (devnet)

These scripts demonstrate programmatic SPL token reads and transfers for my devnet mints.

```bash
# Print mint info for v1 + v2
npm run mint-info

# Check my wallet balance for v2 by default
npm run balance

# Send 1 token (v2) to a recipient on devnet
RECIPIENT=<DEVNET_ADDRESS> npm run send


## Mini dApp (devnet)

A minimal React + TypeScript dashboard lives in `/dapp` that reads mint info and wallet balances from devnet.
Run it with:

```bash
cd dapp
npm install
npm run dev


## Mini dApp (devnet)

A minimal React + TypeScript dashboard lives in `/dapp` that reads mint info and wallet balances from Solana devnet.

```bash
cd dapp
npm install
npm run dev

