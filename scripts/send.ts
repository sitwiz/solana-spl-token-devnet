import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getMint
} from "@solana/spl-token";

const DEVNET = "https://api.devnet.solana.com";
const DEFAULT_KEYPAIR_PATH = "~/meme-coin-devnet.json";
const DEFAULT_MINT = "9CatQXAxvq5cm75MAvGpEoUsVtmthsc5pHdMstaStZsg";

function expandTilde(p: string) {
  return p.startsWith("~/") ? path.join(os.homedir(), p.slice(2)) : p;
}

function loadKeypair(p: string) {
  const full = expandTilde(p);
  const raw = JSON.parse(fs.readFileSync(full, "utf8"));
  return Keypair.fromSecretKey(Uint8Array.from(raw));
}

async function main() {
  const recipientStr = process.env.RECIPIENT;
  if (!recipientStr) {
    console.error("Set RECIPIENT to a devnet wallet address.");
    process.exit(1);
  }

  const keypairPath = process.env.SOLANA_KEYPAIR ?? DEFAULT_KEYPAIR_PATH;
  const mintStr = process.env.MINT ?? DEFAULT_MINT;

  const sender = loadKeypair(keypairPath);
  const recipient = new PublicKey(recipientStr);
  const mintPk = new PublicKey(mintStr);

  const connection = new Connection(DEVNET, "confirmed");
  const mint = await getMint(connection, mintPk);

  const senderAta = await getAssociatedTokenAddress(mintPk, sender.publicKey);
  const recipientAta = await getAssociatedTokenAddress(mintPk, recipient);

  // Amount to send: 1 token in base units
  const amount = BigInt(1) * BigInt(10 ** mint.decimals);

  const instructions = [];

  // Create recipient ATA if needed
  try {
    await getAccount(connection, recipientAta);
  } catch {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        sender.publicKey,
        recipientAta,
        recipient,
        mintPk
      )
    );
  }

  // Transfer
  instructions.push(
    createTransferInstruction(
      senderAta,
      recipientAta,
      sender.publicKey,
      amount
    )
  );

  const tx = new Transaction().add(...instructions);

  const sig = await sendAndConfirmTransaction(connection, tx, [sender]);
  console.log("Signature:", sig);
  console.log("Sent 1 token to:", recipient.toBase58());
  console.log("Recipient ATA:", recipientAta.toBase58());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
