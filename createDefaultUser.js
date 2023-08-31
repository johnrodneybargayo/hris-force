const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const uri = process.env.MONGODB_URI; // Use environment variable for MongoDB URI
const databaseName = 'hrserverless_db'; // Specify the database name separately
const collectionName = 'users';

async function createDefaultUser() {
  try {
    // Connect to MongoDB
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');

    // Access the target database and collection
    const db = client.db(databaseName); // Use the specified database name
    const collection = db.collection(collectionName);

    // Create the default user document
    const defaultUser = createDefaultUserDocument();

    // Hash the password using bcrypt
    const hashedPassword = await hashPassword(process.env.DEFAULT_USER_PASSWORD);
    defaultUser.password = hashedPassword;

    // Validate email format before querying
    if (!isValidEmail(defaultUser.email)) {
      throw new Error('Invalid email format');
    }

    // Check if the user already exists
    const existingUser = await collection.findOne({ email: defaultUser.email });
    if (!existingUser) {
      // Insert the user document into the collection
      const result = await insertUserDocument(collection, defaultUser);
      console.log('Default user created:', result.insertedId);
    }

    // Disconnect from MongoDB
    await client.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    throw new Error('Error creating default user: ' + error.message);
  }
}

function createDefaultUserDocument() {
  return {
    first_name: 'Default',
    middle_name: 'test',
    last_name: 'admin',
    email: 'test@empireonegroup.com',
    phone_number: '+63999999999',
    address: 'Carcar City, Cebu',
    education: 'none',
    occupation: 'Software Engineer',
    position: 'HR System',
    birthdate: new Date('1995-10-19'),
    role: 'admin',
  };
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function insertUserDocument(collection, userDocument) {
  return await collection.insertOne(userDocument);
}

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

module.exports = {
  createDefaultUser,
};
