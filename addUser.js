const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB connection string
const connectionURL = 'mongodb+srv://empireone:hXCieVuIw5DvCX7z@serverlessinstance1.ey8tlta.mongodb.net/hrsystem_serverlessdb?retryWrites=true&w=majority';

// User schema
const userSchema = new mongoose.Schema({
  first_name: String,
  middle_name: String,
  last_name: String,
  email: String,
  phone_number: String,
  address: String,
  education: String,
  occupation: String,
  position: String,
  birthdate: Date,
  hobbies: [String],
  password: String,
  role: String,
  isAdmin: Boolean
});

// User model
const User = mongoose.model('User', userSchema);

async function addUser() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true });

    // Generate salt and hash the password
    const saltRounds = 10;
    const password = 'Password1234'; // Replace with the desired password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user object
    const newUser = new User({
      first_name: 'Default',
      middle_name: 'test',
      last_name: 'admin',
      email: 'rodney@empireonegroup.com',
      phone_number: '+63999999999',
      address: 'Carcar City, Cebu',
      education: 'none',
      occupation: 'Software Engineer',
      position: 'HR System',
      birthdate: new Date('1995-10-19'),
      hobbies: ['Reading', 'Gaming', 'Cooking'],
      password: hashedPassword,
      role: 'isAdmin',
      isAdmin: true
    });

    // Save the user to the database
    await newUser.save();

    console.log('User added successfully.');
  } catch (error) {
    console.error('Error adding user:', error);
  } finally {
    // Disconnect from the MongoDB database
    mongoose.disconnect();
  }
}

// Call the addUser function to add the user
addUser();
