import { AssetExternalData } from "../adapters/marketDataAdapter";

type AssetAnalysis = {
  ticker: string;
  companyName?: string;
  currentPrice: number | null;
  positives: string[];
  negatives: string[];
};

function analyzeAsset(data: AssetExternalData): AssetAnalysis {
  const positives: string[] = [];
  const negatives: string[] = [];

  if (typeof data.dy === "number") {
    if (data.dy >= 8) positives.push(`Dividend yield atrativo (${data.dy}%).`);
    if (data.dy < 5) negatives.push(`Dividend yield abaixo do esperado (${data.dy}%).`);
  }

  if (typeof data.pvp === "number") {
    if (data.pvp <= 1) positives.push(`P/VP em nivel interessante (${data.pvp}).`);
    if (data.pvp > 1.2) negatives.push(`P/VP esticado (${data.pvp}).`);
  }

  if (typeof data.vacancyRate === "number") {
    if (data.vacancyRate <= 10) positives.push(`Vacancia controlada (${data.vacancyRate}%).`);
    if (data.vacancyRate > 15) negatives.push(`Vacancia elevada (${data.vacancyRate}%).`);
  }

  if (typeof data.debtLevel === "number") {
    if (data.debtLevel <= 40) positives.push(`Endividamento sob controle (${data.debtLevel}%).`);
    if (data.debtLevel > 60) negatives.push(`Endividamento elevado (${data.debtLevel}%).`);
  }

  if (positives.length === 0) positives.push("Sem sinais positivos relevantes no recorte atual.");
  if (negatives.length === 0) negatives.push("Sem sinais negativos relevantes no recorte atual.");

  return {
    ticker: data.ticker,
    companyName: data.companyName,
    currentPrice: typeof data.price === "number" ? data.price : null,
    positives,
    negatives
  };
}

export { analyzeAsset };
export type { AssetAnalysis };
