jest.setTimeout(20000);
process.env.NODE_ENV = "test";
require("dotenv").config();

const { connectDB } = require("../db/database");

let dbConnection;

test("connects to database", async () => {
  dbConnection = await connectDB();
  expect(dbConnection).toBeDefined();
  expect(dbConnection.readyState).toBe(1); // connected
  expect(dbConnection.name).toBeDefined();  // memory server DB name
});

afterAll(async () => {
  if (dbConnection) {
    await dbConnection.close();
  }
});
