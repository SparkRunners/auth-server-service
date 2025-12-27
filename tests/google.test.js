/* eslint-env jest */

// Tests google callback rout routes

jest.mock("passport", () => ({
  authenticate: jest.fn(() => {
    return (req, res, next) => {
      req.user = {
        _id: "123",
        username: "testuser",
        email: "test@test.com",
        role: ["user"]
      };
      next();
    };
  })
}));

const request = require("supertest");
const express = require("express");
const router = require("../routes/googleRoutes");

process.env.JWT_SECRET = "testsecret";

const app = express();
app.use("/auth/google", router);

describe("Google OAuth routes", () => {

  test("GET /auth/google/callback → redirects with JWT", async () => {
    const res = await request(app).get("/auth/google/callback");

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toContain("/oauth-callback?token=");
  });

});
  