const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const bcrypt = require("bcrypt");
const path = require('path');
const jwt = require("jsonwebtoken");
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Define your StatusEnum here
const StatusEnum = Object.freeze({
  Interview: "Interview",
  Shortlisted: "Shortlisted",
  Onboarding: "Onboarding",
  Hired: "Hired",
  Failed: "Failed",
});

// Enumerations for Gender and Marital Status
const GenderEnum = Object.freeze({
  Female: "female",
  Male: "male",
  Other: "other",
});

const MaritalStatusEnum = Object.freeze({
  Single: "single",
  Married: "married",
  Divorced: "divorced",
  Widowed: "widowed",
  Other: "other",
});

const secretKey = process.env.JWT_SECRET_KEY;

// Define the user schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String, },
  mobileNumber: { type: String, },
  dateOfBirth: { type: Date,  },
  placeOfBirth: { type: String,  },
  gender: {
    type: String,
    enum: Object.values(GenderEnum),

  },
  maritalStatus: {
    type: String,
    enum: Object.values(MaritalStatusEnum),

  },
  currentAddress: { type: String,  },
  permanentAddress: { type: String, },
  barangay: { type: String,  },
  postcode: { type: String, },
  city: { type: String,  },
  state: { type: String,  },
  country: { type: String, },
  schoolName: { type: String,  },
  courseGraduated: { type: String,  },
  yearGraduated: { type: String,  },
  emergencyName: { type: String,  },
  emergencyContactNumber: { type: String,  },
  emergencyAlternateContactNumber: { type: String,  },
  emergencyRelationship: { type: String,  },
  sssNumber: { type: String,  },
  tinNumber: { type: String,  },
  philHealthId: { type: String, },
  fatherName: { type: String,  },
  motherMaidenName: { type: String,  },
  companyName: { type: String,  },
  position: { type: String,},
  dateHired: { type: Date },
  dateResigned: { type: Date },
  companyName2: { type: String },
  position2: { type: String },
  dateHired2: { type: Date },
  dateResigned2: { type: Date },
  status: {
    type: String,
    enum: Object.values(StatusEnum),
    default: StatusEnum.Interview, // Set the default status
  },
  positionApplied: { type: String,  },

  image: {
    type: Schema.Types.ObjectId,
    ref: "Image",
  },

  signatureUrl: { type: String },

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],

  // New fields for admin and authentication
  isAdmin: {
    type: Boolean,
    default: false, // Set to false by default
  },
  isAuthenticated: {
    type: Boolean,
    default: false, // Set to false by default
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual property to get full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Static method to find a user by ID
userSchema.statics.findUserById = function (userId) {
  return this.findOne({ _id: userId });
};


// Static method to find a user by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

// Method to compare a password with the hashed password stored in the database
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Method to generate an authentication token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id.toString() }, secretKey);
  this.tokens = this.tokens.concat({ token });
  return token;
};

// Create the UserModel using the user schema
const UserModel = mongoose.model("User", userSchema);


// Define the schema for validating user data using Joi
const validateUserSchema = Joi.object({
  image: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  middleName: Joi.string(),
  mobileNumber: Joi.string(),
  dateOfBirth: Joi.date(),
  currentAddress: Joi.string(),
  permanentAddress: Joi.string(),
  country: Joi.string(),
  postcode: Joi.string(),
  state: Joi.string(),
  city: Joi.string(),
  barangay: Joi.string(),
  schoolName: Joi.string(),
  courseGraduated: Joi.string(),
  yearGraduated: Joi.string(),
  emergencyName: Joi.string(),
  emergencyContactNumber: Joi.string(),
  emergencyAlternateContactNumber: Joi.string(),
  emergencyRelationship: Joi.string(),
  sssNumber: Joi.string(),
  tinNumber: Joi.string(),
  philHealthId: Joi.string(),
  fatherName: Joi.string(),
  motherMaidenName: Joi.string(),
  companyName: Joi.string(),
  position: Joi.string(),
  dateHired: Joi.date(),
  dateResigned: Joi.date(),
  companyName2: Joi.string(),
  position2: Joi.string(),
  dateHired2: Joi.date(),
  dateResigned2: Joi.date(),
  positionApplied: Joi.string(),
  signature: Joi.string(),
  isAdmin: Joi.boolean().default(false), // Validates that isAdmin is a boolean, defaulting to false if not provided
  isAuthenticated: Joi.boolean().default(false), // Validates that isAuthenticated is a boolean, defaulting to false if not provided
});

module.exports = { UserModel, validateUserSchema };
