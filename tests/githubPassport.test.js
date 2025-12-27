/* eslint-env jest */

// Tests github passport strategy with user test data

const passport = require("passport");
const User = require("../models/user");

process.env.GITHUB_CLIENT_ID = "test-client-id";
process.env.GITHUB_CLIENT_SECRET = "test-client-secret";
process.env.GITHUB_REDIRECT_URI = "http://localhost/callback";

const setupGitHub = require("../oauth/github");


jest.mock("../models/user");


describe("GitHub Strategy", () => {
  test("verify callback should handle profile without email", async () => {
    const profile = {
      id: "456",
      username: "NoEmailUser",
      emails: undefined
    };
    const done = jest.fn();

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: "456",
      username: "NoEmailUser",
      email: "NoEmailUser@github-oauth.local"
    });

    setupGitHub(passport);

    const strategy = passport._strategies.github;
    await strategy._verify(null, null, profile, done);

    expect(User.findOne).toHaveBeenCalledWith({ email: "NoEmailUser@github-oauth.local" });
    expect(User.create).toHaveBeenCalledWith({
      username: "NoEmailUser",
      email: "NoEmailUser@github-oauth.local",
      role: ["user"],
      password: "oauth_github_456"
    });
    expect(done).toHaveBeenCalledWith(null, {
      id: "456",
      username: "NoEmailUser",
      email: "NoEmailUser@github-oauth.local"
    });
  });
});
