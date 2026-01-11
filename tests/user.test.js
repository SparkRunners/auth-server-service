/* eslint-env jest */

// Tests users CREATE, READ and DELETE routes
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");

describe("User routes", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("GET /users", () => {
    it("should return all users", async () => {
      await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
        role: ["user"]
      });

      const res = await request(app).get("/users");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].email).toBe("test@example.com");
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete an existing user", async () => {
      const user = await User.create({
        username: "deleteuser",
        email: "delete@example.com",
        password: "hashedpassword",
        role: ["user"]
      });

      const res = await request(app).delete(`/users/${user._id}`);

      expect(res.body.message).toBe("User deleted successfully");

      const deleted = await User.findById(user._id);
      expect(deleted).toBeNull();
    });

    it("should return 404 if user does not exist", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const res = await request(app).delete(`/users/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });
  describe("PUT /users/me", () => {
    let token;
    let user;

    beforeEach(async () => {
      await User.deleteMany({});
      user = await User.create({
        username: "updateuser",
        email: "update@example.com",
        password: "oldpassword",
        role: ["user"],
      });

      const jwt = require("jsonwebtoken");
      const JWT_SECRET = process.env.JWT_SECRET || "secret_auth_key";
      token = jwt.sign(
        { id: user._id, username: user.username, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
    });

    it("should update the user's profile successfully", async () => {
      const res = await request(app)
        .put("/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "newusername",
          email: "newemail@example.com",
          password: "newpassword123"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("User updated successfully");
      expect(res.body.user.username).toBe("newusername");
      expect(res.body.user.email).toBe("newemail@example.com");

      const updatedUser = await User.findById(user._id);
      const bcrypt = require("bcryptjs");
      const match = await bcrypt.compare("newpassword123", updatedUser.password);
      expect(match).toBe(true);
    });

    it("should return 404 if user does not exist", async () => {
      const fakeToken = require("jsonwebtoken").sign(
        { id: "507f1f77bcf86cd799439011" },
        process.env.JWT_SECRET || "secret_auth_key"
      );

      const res = await request(app)
        .put("/users/me")
        .set("Authorization", `Bearer ${fakeToken}`)
        .send({ username: "whatever" });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });



});
