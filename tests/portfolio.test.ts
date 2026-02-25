import request from "supertest";

jest.mock("../src/lib/supabase", () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      getUser: jest.fn()
    },
    from: jest.fn()
  }
}));

import { app } from "../src/app";
import { supabase } from "../src/lib/supabase";

describe("Portfolio routes", () => {
  it("POST /portfolio/assets should create asset for authenticated user", async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null
    });

    const single = jest.fn().mockResolvedValue({
      data: { id: "asset-1", ticker: "MXRF11" },
      error: null
    });
    const select = jest.fn().mockReturnValue({ single });
    const insert = jest.fn().mockReturnValue({ select });
    (supabase.from as jest.Mock).mockReturnValue({ insert });

    const response = await request(app)
      .post("/portfolio/assets")
      .set("Authorization", "Bearer valid-token")
      .send({
        ticker: "mxrf11",
        type: "fii",
        date: "2026-01-10",
        quantity: 10,
        price: 9.95
      });

    expect(response.status).toBe(201);
    expect(response.body.asset.ticker).toBe("MXRF11");
    expect(supabase.from).toHaveBeenCalledWith("portfolio_assets");
  });
});
