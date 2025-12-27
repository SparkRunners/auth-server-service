/* eslint-env jest */

// Tests github passport strategy

const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

process.env.GITHUB_CLIENT_ID = "test-client-id";
process.env.GITHUB_CLIENT_SECRET = "test-client-secret";
process.env.GITHUB_REDIRECT_URI = "http://localhost/callback";

const setupGitHub = require("../oauth/github");

describe("GitHub Strategy", () => {
  test("should register a GitHubStrategy with passport", () => {
    const spy = jest.spyOn(passport, "use");

    setupGitHub(passport);

    expect(spy).toHaveBeenCalled();

    const strategy = spy.mock.calls[0][0];

    expect(strategy).toBeInstanceOf(GitHubStrategy);

    spy.mockRestore();
  });
});
