import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Currency = "USD" | "BDT";

/** Static FX rate. 1 USD = 122 BDT. Update here if needed. */
export const USD_TO_BDT = 122;

interface CurrencyCtx {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggle: () => void;
  /** Convert a USD amount to the active currency. */
  convert: (usd: number) => number;
  /** Format a USD amount with the active currency symbol. */
  format: (usd: number, opts?: { decimals?: number }) => string;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyCtx | null>(null);

const STORAGE_KEY = "currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window === "undefined") return "BDT";
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "USD" || v === "BDT" ? (v as Currency) : "BDT";
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, currency);
    } catch {}
  }, [currency]);

  const convert = (usd: number) =>
    currency === "USD" ? usd : Math.round(usd * USD_TO_BDT);

  const format = (usd: number, opts?: { decimals?: number }) => {
    const value = convert(usd);
    if (currency === "USD") {
      const d = opts?.decimals ?? (Number.isInteger(value) ? 0 : 2);
      return `$${value.toLocaleString("en-US", {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
      })}`;
    }
    return `৳${Math.round(value).toLocaleString("en-IN")}`;
  };

  const value: CurrencyCtx = {
    currency,
    setCurrency: setCurrencyState,
    toggle: () => setCurrencyState((c) => (c === "USD" ? "BDT" : "USD")),
    convert,
    format,
    symbol: currency === "USD" ? "$" : "৳",
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

interface PriceProps {
  /** Amount in USD (the canonical unit used across the app's data). */
  amount: number | null | undefined;
  className?: string;
  /** Render with a strikethrough (used for original prices). */
  strike?: boolean;
  decimals?: number;
}

/** Renders a price formatted in the user's active currency. */
export function Price({ amount, className, strike, decimals }: PriceProps) {
  const { format } = useCurrency();
  if (amount == null) return null;
  return (
    <span className={(strike ? "line-through " : "") + (className ?? "")}>
      {format(amount, { decimals })}
    </span>
  );
}
