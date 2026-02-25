import request from "supertest";

jest.mock("../src/adapters/marketDataAdapter", () => ({
  fetchAssetData: jest.fn()
}));

import { app } from "../src/app";
import { fetchAssetData } from "../src/adapters/marketDataAdapter";

describe("Assets analysis route", () => {
  it("GET /assets/:ticker/analyze should return simplified analysis report", async () => {
    (fetchAssetData as jest.Mock).mockResolvedValue({
      ticker: "HGLG11",
      companyName: "CSHG Logistica",
      price: 165.2,
      dy: 8.5,
      pvp: 0.97,
      vacancyRate: 7,
      debtLevel: 35
    });

    const response = await request(app).get("/assets/HGLG11/analyze");

    expect(response.status).toBe(200);
    expect(response.body.report.ticker).toBe("HGLG11");
    expect(Array.isArray(response.body.report.positives)).toBe(true);
    expect(Array.isArray(response.body.report.negatives)).toBe(true);
  });

  it("GET /assets/:ticker/analyze should return 400 for invalid ticker", async () => {
    const response = await request(app).get("/assets/ab/analyze");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid ticker parameter.");
  });
});
