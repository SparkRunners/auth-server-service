/* eslint-env jest */

// Tests google passport stategy and with user test data
const passport = require("passport");
const User = require("../models/user");

process.env.GOOGLE_CLIENT_ID = "test-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";
process.env.GOOGLE_REDIRECT_URI = "http://localhost/callback";

const setupGoogle = require("../oauth/google");

jest.mock("../models/user");

describe("Google Strategy", () => {

  test("verify callback should create user if not exists", async () => {
    const profile = {
      id: "123",
      displayName: "Test User",
      emails: [{ value: "test@example.com" }]
    };

    const done = jest.fn();

    // Mock User.findOne and User.create
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: "123", email: "test@example.com" });

    setupGoogle(passport);

    const strategy = passport._strategies.google;
    await strategy._verify(null, null, profile, done);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(User.create).toHaveBeenCalledWith({
      username: "Test User",
      email: "test@example.com",
      password: "oauth_google_123",
      role: ["user"]
    });
    expect(done).toHaveBeenCalledWith(null, { id: "123", email: "test@example.com" });
  });


});
