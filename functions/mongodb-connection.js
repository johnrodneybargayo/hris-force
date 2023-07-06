require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI; // Use the environment variable MONGODB_URI
const dbName = process.env.MONGODB_DATABASE; // Use the environment variable DB_NAME

let client = null;

async function connect() {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
  }
}

async function disconnect() {
  if (client) {
    await client.close();
    client = null;
  }
}

async function findUsers() {
  if (!client) {
    throw new Error('MongoDB client is not connected');
  }

  const db = client.db(dbName);
  const collection = db.collection('users');
  const users = await collection.find().toArray();

  return users;
}

module.exports = {
  connect,
  disconnect,
  findUsers,
};
