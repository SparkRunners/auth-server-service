/* eslint-env jest */

// Tests google passport strategy
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

process.env.GOOGLE_CLIENT_ID = "test-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";
process.env.GOOGLE_REDIRECT_URI = "http://localhost/callback";

const setupGoogle = require("../oauth/google");

describe("Google Strategy", () => {
  test("should register a GoogleStrategy with passport", () => {
    const spy = jest.spyOn(passport, "use");

    // register the strategy
    setupGoogle(passport);

    expect(spy).toHaveBeenCalled();

    const strategy = spy.mock.calls[0][0];

    expect(strategy).toBeInstanceOf(GoogleStrategy);

    spy.mockRestore();
  });
});
