/* eslint-env jest */

// Tests github callback rout routes

jest.mock("passport", () => ({
  authenticate: jest.fn((strategy, options, callback) => {
    return (req, res, next) => {
      const user = {
        _id: "123",
        username: "testuser",
        email: "test@test.com",
        role: ["user"]
      };
      if (callback) return callback(null, user);
      req.user = user;
      next();
    };
  })
}));

const request = require("supertest");
const express = require("express");
const router = require("../routes/gitRoutes");

process.env.JWT_SECRET = "testsecret";

const app = express();
app.use("/auth/github", router);

describe("GitHub OAuth routes", () => {
  test("Web flow redirects with JWT", async () => {
    const res = await request(app).get("/auth/github/callback");
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toContain("/oauth-callback?token=");
  });

  test("Mobile flow redirects with JWT to deep link", async () => {
    const res = await request(app).get("/auth/github/callback?client=mobile");
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toContain("sparkapp://app/oauth-callback?token=");
  });
});
  