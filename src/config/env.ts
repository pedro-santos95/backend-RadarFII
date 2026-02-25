import dotenv from "dotenv";

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3000),
  MARKET_DATA_API_BASE_URL: process.env.MARKET_DATA_API_BASE_URL ?? "",
  MARKET_DATA_API_KEY: process.env.MARKET_DATA_API_KEY ?? ""
};

export { env };
