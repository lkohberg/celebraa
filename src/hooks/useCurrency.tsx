import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number; // rate relative to EUR (1 EUR = X currency)
}

// 15 most-used currencies with approximate fixed rates from EUR
export const CURRENCIES: CurrencyInfo[] = [
  { code: "EUR", symbol: "€", rate: 1 },
  { code: "USD", symbol: "$", rate: 1.09 },
  { code: "GBP", symbol: "£", rate: 0.86 },
  { code: "CHF", symbol: "CHF", rate: 0.96 },
  { code: "JPY", symbol: "¥", rate: 163.5 },
  { code: "CAD", symbol: "C$", rate: 1.48 },
  { code: "AUD", symbol: "A$", rate: 1.67 },
  { code: "CNY", symbol: "¥", rate: 7.92 },
  { code: "INR", symbol: "₹", rate: 91.2 },
  { code: "BRL", symbol: "R$", rate: 5.45 },
  { code: "MXN", symbol: "MX$", rate: 18.7 },
  { code: "SEK", symbol: "kr", rate: 11.2 },
  { code: "NOK", symbol: "kr", rate: 11.6 },
  { code: "DKK", symbol: "kr", rate: 7.46 },
  { code: "PLN", symbol: "zł", rate: 4.32 },
];

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrencyCode: (code: string) => void;
  convertFromEur: (eurAmount: number) => number;
  formatPrice: (eurAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyInfo>(CURRENCIES[0]);

  const setCurrencyCode = useCallback((code: string) => {
    const found = CURRENCIES.find(c => c.code === code);
    if (found) setCurrency(found);
  }, []);

  const convertFromEur = useCallback((eurAmount: number) => {
    if (currency.code === "EUR") return eurAmount;
    const converted = eurAmount * currency.rate;
    // For JPY, CNY, INR etc. round to whole numbers
    if (currency.rate > 10) return Math.round(converted);
    return Math.round(converted * 100) / 100;
  }, [currency]);

  // Round up to next whole number for non-EUR (used for block/package prices)
  const convertFromEurCeil = useCallback((eurAmount: number) => {
    if (currency.code === "EUR") return eurAmount;
    const converted = eurAmount * currency.rate;
    return Math.ceil(converted);
  }, [currency]);

  const formatPrice = useCallback((eurAmount: number) => {
    const converted = convertFromEur(eurAmount);
    if (currency.code === "EUR") return `€${converted}`;
    if (currency.rate > 10) return `${currency.symbol}${converted}`;
    return `${currency.symbol}${converted.toFixed(2)}`;
  }, [currency, convertFromEur]);

  // Format with ceil rounding (for item prices, not final totals with promo)
  const formatPriceCeil = useCallback((eurAmount: number) => {
    const converted = convertFromEurCeil(eurAmount);
    if (currency.code === "EUR") return `€${converted}`;
    return `${currency.symbol}${converted}`;
  }, [currency, convertFromEurCeil]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode, convertFromEur, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};
