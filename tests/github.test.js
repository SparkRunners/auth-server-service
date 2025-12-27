/* eslint-env jest */

// Tests github callback rout routes

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
const router = require("../routes/gitRoutes");

process.env.JWT_SECRET = "testsecret";

const app = express();
app.use("/auth/github", router);

describe("github OAuth routes", () => {

  test("GET /auth/github/callback → redirects with JWT", async () => {
    const res = await request(app).get("/auth/github/callback");

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toContain("/oauth-callback?token=");
  });

});
  