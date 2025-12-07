import { Connection, PublicKey } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";

const DEVNET = "https://api.devnet.solana.com";

// Your mints
const V1_MINT = new PublicKey("CgELqM37jwP5K1dQFpNnKyEQwLti1REnsgmSmLhqzfdD");
const V2_MINT = new PublicKey("9CatQXAxvq5cm75MAvGpEoUsVtmthsc5pHdMstaStZsg");

function formatAmount(raw: bigint, decimals: number): string {
  const s = raw.toString();
  if (decimals === 0) return s;

  const pad = decimals - s.length + 1;
  const whole =
    pad > 0 ? "0" : s.slice(0, s.length - decimals);
  const frac =
    pad > 0 ? "0".repeat(pad) + s : s.slice(s.length - decimals);

  // Trim trailing zeros for nicer display
  const fracTrimmed = frac.replace(/0+$/, "");
  return fracTrimmed.length ? `${whole}.${fracTrimmed}` : whole;
}

async function printMint(connection: Connection, label: string, mintPk: PublicKey) {
  const mint = await getMint(connection, mintPk);

  console.log(`\n${label}`);
  console.log(`Mint: ${mintPk.toBase58()}`);
  console.log(`Decimals: ${mint.decimals}`);
  console.log(`Supply (raw): ${mint.supply.toString()}`);
  console.log(`Supply (human): ${formatAmount(mint.supply, mint.decimals)}`);
  console.log(
    `Mint authority: ${mint.mintAuthority ? mint.mintAuthority.toBase58() : "(not set)"}`
  );
  console.log(
    `Freeze authority: ${mint.freezeAuthority ? mint.freezeAuthority.toBase58() : "(not set)"}`
  );
}

async function main() {
  const connection = new Connection(DEVNET, "confirmed");

  await printMint(connection, "V1 (trust-first)", V1_MINT);
  await printMint(connection, "V2 (metadata-first)", V2_MINT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
