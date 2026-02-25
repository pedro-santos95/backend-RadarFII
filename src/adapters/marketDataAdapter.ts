import axios from "axios";

import { env } from "../config/env";

type AssetExternalData = {
  ticker: string;
  companyName?: string;
  price?: number;
  dy?: number;
  pvp?: number;
  vacancyRate?: number;
  debtLevel?: number;
};

async function fetchAssetData(ticker: string): Promise<AssetExternalData> {
  if (!env.MARKET_DATA_API_BASE_URL) {
    throw new Error("MARKET_DATA_API_BASE_URL is not configured.");
  }

  const { data } = await axios.get<AssetExternalData>(`${env.MARKET_DATA_API_BASE_URL}/assets/${ticker}`, {
    headers: env.MARKET_DATA_API_KEY ? { Authorization: `Bearer ${env.MARKET_DATA_API_KEY}` } : undefined,
    timeout: 7000
  });

  return data;
}

export { fetchAssetData };
export type { AssetExternalData };
