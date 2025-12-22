/* eslint-env jest */

// Tests REST Auth routes
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");

describe("Auth REST API", () => {
  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({
          username: "testuser",
          email: "test@example.com",
          password: "Password123!",
          role: ["user"]
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("email", "test@example.com");
    });
  });

  describe("POST /auth/login", () => {
    it("should login user and return JWT", async () => {
      await User.create({
        username: "loginuser",
        email: "login@example.com",
        password: "Password123!",
        role: ["user"]
      });

      const res = await request(app)
        .post("/auth/login")
        .send({
          email: "login@example.com",
          password: "Password123!"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });
  });
});
