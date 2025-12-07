import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  getMint
} from "@solana/spl-token";

const DEVNET = "https://api.devnet.solana.com";

// Default to your project devnet wallet file
const DEFAULT_KEYPAIR_PATH = "~/meme-coin-devnet.json";

// Prefer your v2 mint by default
const DEFAULT_MINT = "9CatQXAxvq5cm75MAvGpEoUsVtmthsc5pHdMstaStZsg";

function expandTilde(p: string) {
  return p.startsWith("~/") ? path.join(os.homedir(), p.slice(2)) : p;
}

function loadKeypair(p: string) {
  const full = expandTilde(p);
  const raw = JSON.parse(fs.readFileSync(full, "utf8"));
  return Keypair.fromSecretKey(Uint8Array.from(raw));
}

function formatAmount(raw: bigint, decimals: number): string {
  const s = raw.toString();
  if (decimals === 0) return s;

  const pad = decimals - s.length + 1;
  const whole = pad > 0 ? "0" : s.slice(0, s.length - decimals);
  const frac = pad > 0 ? "0".repeat(pad) + s : s.slice(s.length - decimals);
  const fracTrimmed = frac.replace(/0+$/, "");
  return fracTrimmed.length ? `${whole}.${fracTrimmed}` : whole;
}

async function main() {
  const keypairPath = process.env.SOLANA_KEYPAIR ?? DEFAULT_KEYPAIR_PATH;
  const mintStr = process.env.MINT ?? DEFAULT_MINT;

  const wallet = loadKeypair(keypairPath);
  const mintPk = new PublicKey(mintStr);

  const connection = new Connection(DEVNET, "confirmed");

  const mint = await getMint(connection, mintPk);
  const ata = await getAssociatedTokenAddress(mintPk, wallet.publicKey);

  console.log("Wallet:", wallet.publicKey.toBase58());
  console.log("Mint:", mintPk.toBase58());
  console.log("ATA:", ata.toBase58());

  try {
    const acct = await getAccount(connection, ata);
    console.log("Balance (raw):", acct.amount.toString());
    console.log("Balance (human):", formatAmount(acct.amount, mint.decimals));
  } catch {
    console.log("ATA not found on-chain yet for this mint.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
