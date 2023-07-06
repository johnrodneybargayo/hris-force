require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE;

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

async function getConnectionStatus() {
  if (!client) {
    throw new Error('MongoDB client is not connected');
  }

  const isConnected = client.isConnected();
  return { connected: isConnected };
}

module.exports = {
  connect,
  disconnect,
  getConnectionStatus,
};
