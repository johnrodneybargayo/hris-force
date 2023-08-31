const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// Connection URL and database name
const url = 'mongodb+srv://johnrodneybargayo:SqSB54TJ!NA6tc7@hrsystem.alub4ez.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'hrsystem';

// Create a new MongoDB client
const client = new MongoClient(url);

// Function to insert a sample document with roles and hashed password into the existing users collection
async function insertSampleUserWithRolesAndHashedPassword() {
  try {
    // Connect to the MongoDB server
    await client.connect();

    // Access the hrSystem database
    const db = client.db(dbName);

    // Access the existing users collection
    const usersCollection = db.collection('users');

    // Generate a salt and hash the password using bcrypt
    const saltRounds = 10;
    const plainPassword = process.env.DEFAULT_PASSWORD;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Insert a sample document with roles and hashed password
    const sampleUser = {
      user_id: 1,
      first_name: 'Default',
      middle_name: 'test',
      last_name: 'admin',
      email: 'rodney@empireonegroup.com',
      phone_number: '+63999999999',
      address: 'Carcar City, Cebu',
      education: 'none',
      occupation: 'Software Engineer',
      position: 'HR Systemr',
      birthdate: '1995-10-19',
      hobbies: ['Reading', 'Gaming', 'Cooking'],
      role: 'admin',
      password: hashedPassword // Store the hashed password in the document
    };
    await usersCollection.insertOne(sampleUser);

    console.log('Sample user with roles and hashed password inserted successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Close the MongoDB connection
    client.close();
  }
}

// Call the function to insert the sample user document with roles and hashed password
insertSampleUserWithRolesAndHashedPassword().catch(console.error);
