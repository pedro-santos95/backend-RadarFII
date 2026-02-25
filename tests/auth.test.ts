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

describe("Auth routes", () => {
  it("POST /auth/login should authenticate with valid credentials", async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: {
        session: {
          access_token: "access-token",
          refresh_token: "refresh-token"
        },
        user: {
          id: "user-1",
          email: "user@example.com"
        }
      },
      error: null
    });

    const response = await request(app).post("/auth/login").send({
      email: "user@example.com",
      password: "123456"
    });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBe("access-token");
    expect(response.body.user.email).toBe("user@example.com");
  });

  it("POST /auth/login should return 400 for invalid payload", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "invalid-email",
      password: "123"
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid payload.");
  });
});
