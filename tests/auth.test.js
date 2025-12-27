/* eslint-env jest */

// Tests REST Auth routes
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken"); // to avoid real signing in tests


describe("Auth REST API", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });


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

    it("should fail when username/email/password missing", async () => {
      const res = await request(app).post("/auth/register").send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Username, email and password are required");
    });

    it("should fail when user already exists", async () => {
      await User.create({
        username: "existing",
        email: "existing@example.com",
        password: "Password123!",
        role: ["user"]
      });

      const res = await request(app)
        .post("/auth/register")
        .send({
          username: "existing",
          email: "existing@example.com",
          password: "Password123!"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Username or email already exists");
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      const user = new User({
        username: "loginuser",
        email: "login@example.com",
        password: "Password123!",
        role: ["user"]
      });
      // mock comparePassword method
      user.comparePassword = jest.fn().mockResolvedValue(true);
      await user.save();
    });

    it("should login user and return JWT", async () => {
      jwt.sign.mockReturnValue("mocked_token");

      const res = await request(app)
        .post("/auth/login")
        .send({
          email: "login@example.com",
          password: "Password123!"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token", "mocked_token");
    });

    it("should fail when email or password missing", async () => {
      const res = await request(app).post("/auth/login").send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Email and password required");
    });

    it("should fail when user not found", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: "notfound@example.com", password: "Password123!" });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "User not found");
    });

    it("should fail when password is incorrect", async () => {
      const user = await User.findOne({ email: "login@example.com" });
      user.comparePassword = jest.fn().mockResolvedValue(false);
      await user.save();

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "login@example.com", password: "wrongpassword" });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Invalid credentials");
    });
  });
});
