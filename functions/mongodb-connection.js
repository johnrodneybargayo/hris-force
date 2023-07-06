require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://empireone:hXCieVuIw5DvCX7z@serverlessinstance0.i4tpgor.mongodb.net/?retryWrites=true&w=majority'; // Use the environment variable MONGODB_URI
const dbName = 'hrsystem_serverless';

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
