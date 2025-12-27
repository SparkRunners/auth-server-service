/* eslint-env jest */
const { corsOptions } = require("../middleware/corsConfig");

describe("CORS middleware", () => {
  it("allows requests from allowed origins", done => {
    const origin = "http://localhost:3000";

    corsOptions.origin(origin, (err, allowed) => {
      expect(err).toBeNull();
      expect(allowed).toBe(true);
      done();
    });
  });

  it("blocks requests from disallowed origins", done => {
    const origin = "http://malicious-site.com";

    corsOptions.origin(origin, (err, allowed) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe(
        "CORS policy: This origin is not allowed by the Backend Server Policies"
      );
      expect(allowed).toBeUndefined();
      done();
    });
  });

  it("allows requests with no origin (Postman/curl)", done => {
    const origin = undefined;

    corsOptions.origin(origin, (err, allowed) => {
      expect(err).toBeNull();
      expect(allowed).toBe(true);
      done();
    });
  });
});
