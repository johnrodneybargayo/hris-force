const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
require('dotenv').config();

const MONGO_CONNECTION_STRING = 'mongodb+srv://empireone:hXCieVuIw5DvCX7z@serverlessinstance1.ey8tlta.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DATABASE = 'hrserverless_db';
const MONGODB_COLLECTION = 'users';

mongoose.connect(MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: MONGODB_DATABASE,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  hobby: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  return token;
};

const User = mongoose.model('User', userSchema);

// Create a user
const createUser = async () => {
  const newUser = new User({
    firstName: 'HR',
    lastName: 'admin test',
    email: 'admin@admin.com',
    password: await bcrypt.hash('admin', 10),
    phoneNumber: '1234567890',
    age: 27,
    hobby: 'Reading',
    address: '123 Street, City',
    gender: 'other',
    birthdate: new Date('1995-01-01'),
    isAdmin: true,
  });

  try {
    const savedUser = await newUser.save();
    console.log('User created:', savedUser);

    const token = savedUser.generateAuthToken();
    console.log('Generated token:', token);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

createUser();

const validate = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string(),
    age: Joi.number(),
    hobby: Joi.string(),
    address: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    gender: Joi.string().valid('Male', 'Female', 'Other'),
    birthdate: Joi.date(),
  });
  return schema.validate(user);
};

module.exports = { User, validate };
