const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = 'mongodb+srv://empireone:hXCieVuIw5DvCX7z@serverlessinstance1.ey8tlta.mongodb.net'; // Remove the database name from the connection string
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
    const defaultUser = {
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

    // Hash the password using bcrypt
    const password = 'password1234';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    defaultUser.password = hashedPassword;

    // Insert the user document into the collection
    const result = await collection.insertOne(defaultUser);
    console.log('Default user created:', result.insertedId);

    // Disconnect from MongoDB
    await client.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating default user:', error);
  }
}

createDefaultUser();
