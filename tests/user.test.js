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

      expect(res.statusCode).toBe(200);
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
});
