import axios from "axios";

import { env } from "../config/env";

type ExternalNewsItem = {
  title: string;
  source?: string;
  publishedAt?: string;
  url: string;
};

type ExternalNewsResponse = {
  items?: ExternalNewsItem[];
};

async function fetchNewsByTicker(ticker: string): Promise<ExternalNewsItem[]> {
  if (!env.NEWS_API_BASE_URL) {
    throw new Error("NEWS_API_BASE_URL is not configured.");
  }

  const { data } = await axios.get<ExternalNewsResponse>(`${env.NEWS_API_BASE_URL}/news`, {
    params: { ticker },
    headers: env.NEWS_API_KEY ? { Authorization: `Bearer ${env.NEWS_API_KEY}` } : undefined,
    timeout: 7000
  });

  return data.items ?? [];
}

export { fetchNewsByTicker };
export type { ExternalNewsItem };
