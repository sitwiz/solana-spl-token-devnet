import { useEffect, useMemo, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, getMint, getAccount } from "@solana/spl-token";

const DEVNET = "https://api.devnet.solana.com";

// Your known addresses (devnet)
const WALLET = new PublicKey("3jzvDAyMoP8pc7KbAdjf4oXJAngpeKjZzZKGrqrxqhTk");

// V2 mint (metadata-first)
const V2_MINT = new PublicKey("9CatQXAxvq5cm75MAvGpEoUsVtmthsc5pHdMstaStZsg");

// V1 mint (trust-first)
const V1_MINT = new PublicKey("CgELqM37jwP5K1dQFpNnKyEQwLti1REnsgmSmLhqzfdD");

function formatAmount(raw: bigint, decimals: number) {
  const s = raw.toString();
  if (decimals === 0) return s;

  const pad = decimals - s.length + 1;
  const whole = pad > 0 ? "0" : s.slice(0, s.length - decimals);
  const frac = pad > 0 ? "0".repeat(pad) + s : s.slice(s.length - decimals);
  const fracTrimmed = frac.replace(/0+$/, "");
  return fracTrimmed.length ? `${whole}.${fracTrimmed}` : whole;
}

type MintView = {
  address: string;
  decimals: number;
  supplyRaw: string;
  supplyHuman: string;
  mintAuthority: string;
  freezeAuthority: string;
};

export default function App() {
  const connection = useMemo(() => new Connection(DEVNET, "confirmed"), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [v2Mint, setV2Mint] = useState<MintView | null>(null);
  const [v1Mint, setV1Mint] = useState<MintView | null>(null);
  const [v2BalanceRaw, setV2BalanceRaw] = useState<string | null>(null);
  const [v2BalanceHuman, setV2BalanceHuman] = useState<string | null>(null);
  const [v2Ata, setV2Ata] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        // V2 mint info
        const m2 = await getMint(connection, V2_MINT);
        const v2: MintView = {
          address: V2_MINT.toBase58(),
          decimals: m2.decimals,
          supplyRaw: m2.supply.toString(),
          supplyHuman: formatAmount(m2.supply, m2.decimals),
          mintAuthority: m2.mintAuthority ? m2.mintAuthority.toBase58() : "(not set)",
          freezeAuthority: m2.freezeAuthority ? m2.freezeAuthority.toBase58() : "(not set)",
        };

        // V1 mint info
        const m1 = await getMint(connection, V1_MINT);
        const v1: MintView = {
          address: V1_MINT.toBase58(),
          decimals: m1.decimals,
          supplyRaw: m1.supply.toString(),
          supplyHuman: formatAmount(m1.supply, m1.decimals),
          mintAuthority: m1.mintAuthority ? m1.mintAuthority.toBase58() : "(not set)",
          freezeAuthority: m1.freezeAuthority ? m1.freezeAuthority.toBase58() : "(not set)",
        };

        // V2 ATA + balance for your wallet
        const ata = getAssociatedTokenAddressSync(V2_MINT, WALLET);
        let balRaw = "0";

        try {
          const acct = await getAccount(connection, ata);
          balRaw = acct.amount.toString();
        } catch {
          balRaw = "0";
        }

        if (!alive) return;

        setV2Mint(v2);
        setV1Mint(v1);
        setV2Ata(ata.toBase58());
        setV2BalanceRaw(balRaw);
        setV2BalanceHuman(formatAmount(BigInt(balRaw), v2.decimals));
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? String(e));
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [connection]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem" }}>
        Solana Devnet Token Dashboard
      </h1>
      <p style={{ marginTop: 0, opacity: 0.75 }}>
        Read-only learning UI for my SPL token portfolio (devnet).
      </p>

      <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: 12, marginBottom: "1rem" }}>
        <strong>Wallet</strong>
        <div style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{WALLET.toBase58()}</div>
      </div>

      {loading && (
        <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: 12 }}>
          Loading devnet data…
        </div>
      )}

      {error && (
        <div style={{ padding: "1rem", border: "1px solid #f5c2c2", background: "#fff5f5", borderRadius: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
            <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: 12 }}>
              <h2 style={{ marginTop: 0 }}>V2 mint (metadata-first)</h2>
              <div><strong>Mint:</strong> <span style={{ fontFamily: "monospace" }}>{v2Mint?.address}</span></div>
              <div><strong>Decimals:</strong> {v2Mint?.decimals}</div>
              <div><strong>Supply:</strong> {v2Mint?.supplyHuman}</div>
              <div style={{ opacity: 0.7, fontSize: "0.9rem" }}>
                Raw: {v2Mint?.supplyRaw}
              </div>
              <div><strong>Mint authority:</strong> {v2Mint?.mintAuthority}</div>
              <div><strong>Freeze authority:</strong> {v2Mint?.freezeAuthority}</div>

              <hr style={{ margin: "1rem 0" }} />

              <h3 style={{ marginTop: 0 }}>My V2 balance</h3>
              <div><strong>ATA:</strong> <span style={{ fontFamily: "monospace" }}>{v2Ata}</span></div>
              <div><strong>Balance:</strong> {v2BalanceHuman}</div>
              <div style={{ opacity: 0.7, fontSize: "0.9rem" }}>
                Raw: {v2BalanceRaw}
              </div>
            </div>

            <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: 12 }}>
              <h2 style={{ marginTop: 0 }}>V1 mint (trust-first)</h2>
              <div><strong>Mint:</strong> <span style={{ fontFamily: "monospace" }}>{v1Mint?.address}</span></div>
              <div><strong>Decimals:</strong> {v1Mint?.decimals}</div>
              <div><strong>Supply:</strong> {v1Mint?.supplyHuman}</div>
              <div style={{ opacity: 0.7, fontSize: "0.9rem" }}>
                Raw: {v1Mint?.supplyRaw}
              </div>
              <div><strong>Mint authority:</strong> {v1Mint?.mintAuthority}</div>
              <div><strong>Freeze authority:</strong> {v1Mint?.freezeAuthority}</div>
            </div>
          </div>

          <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", opacity: 0.7 }}>
            Devnet only. Educational project. No promises, no expectation of profit.
          </p>
        </>
      )}
    </div>
  );
}
