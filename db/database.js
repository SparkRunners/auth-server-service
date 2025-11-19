if (process.env.NODE_ENV !== "test") {
  require("dotenv").config();
}
const mongoose = require("mongoose");

const uri = process.env.ATLAS_URI;

const DB_NAME =
  process.env.NODE_ENV === "test"
    ? process.env.ATLAS_DB_TEST
    : process.env.ATLAS_DB_NAME;

let connected = false;

async function connectDB() {
  if (connected || mongoose.connection.readyState === 1) return mongoose.connection;
  await mongoose.connect(uri, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  connected = true;
  console.log(`Mongoose connected to Database: ${DB_NAME}`);
  return mongoose.connection;
}

/**
 * Keep old connection for testing till i update tests.
 * Returns { db, collection } where `collection` is the native driver collection.
 */
async function getDb(collectionName) {
  await connectDB();
  const db = mongoose.connection.db;
  const collection = db.collection(collectionName);
  return { db, collection };
}

async function closeDb() {
  await mongoose.disconnect();
  connected = false;
}

module.exports = { connectDB, getDb, closeDb, mongoose };

