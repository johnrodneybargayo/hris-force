const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

const secretKey =
  "431dd5dddcde37181d3816f9e604083693b7fc52873db4a8f2b009d51a23937f"; // Replace with your actual secret key

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
  middleName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  placeOfBirth: { type: String, required: true },
  gender: {
    type: String,
    enum: Object.values(GenderEnum),
    required: true,
  },
  maritalStatus: {
    type: String,
    enum: Object.values(MaritalStatusEnum),
    required: true,
  },
  currentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  barangay: { type: String, required: true },
  postcode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  schoolName: { type: String, required: true },
  courseGraduated: { type: String, required: true },
  yearGraduated: { type: String, required: true },
  emergencyName: { type: String, required: true },
  emergencyContactNumber: { type: String, required: true },
  emergencyAlternateContactNumber: { type: String, required: true },
  emergencyRelationship: { type: String, required: true },
  sssNumber: { type: String, required: true },
  tinNumber: { type: String, required: true },
  philHealthId: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherMaidenName: { type: String, required: true },
  companyName: { type: String, required: true },
  position: { type: String, required: true },
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
  positionApplied: { type: String, required: true },

  token: {
    type: String, // or whatever data type is appropriate for storing the token
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

// Static method to find a user by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

// Method to compare a password with the hashed password stored in the database
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Method to generate an authentication token for the user
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, secretKey);
  return token;
};

// Create the UserModel using the user schema
const UserModel = mongoose.model("User", userSchema);

// Define the schema for validating user data using Joi
const validateUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  middleName: Joi.string().required(),
  mobileNumber: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  currentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  country: Joi.string().required(),
  postcode: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  barangay: Joi.string().required(),
  schoolName: Joi.string().required(),
  courseGraduated: Joi.string().required(),
  yearGraduated: Joi.string().required(),
  emergencyName: Joi.string().required(),
  emergencyContactNumber: Joi.string().required(),
  emergencyAlternateContactNumber: Joi.string().required(),
  emergencyRelationship: Joi.string().required(),
  sssNumber: Joi.string().required(),
  tinNumber: Joi.string().required(),
  philHealthId: Joi.string().required(),
  fatherName: Joi.string().required(),
  motherMaidenName: Joi.string().required(),
  companyName: Joi.string().required(),
  position: Joi.string().required(),
  dateHired: Joi.date().required(),
  dateResigned: Joi.date().required(),
  companyName2: Joi.string().required(),
  position2: Joi.string().required(),
  dateHired2: Joi.date().required(),
  dateResigned2: Joi.date().required(),
  positionApplied: Joi.string().required(),
});

module.exports = { UserModel, validateUserSchema };
