const mongoose = require("mongoose");

const { Schema } = mongoose;


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

// Create the applicants schema
const applicantSchema = new Schema({
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
  status: { type: String,
    enum: Object.values(StatusEnum),
    default: StatusEnum.Interview, // Set the default status
  },
  positionApplied: {type: String, required: true },
  imageUrl: { type: String, required: true },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

// Create and export the "applicants" model
const ApplicantModel = mongoose.model("applicants", applicantSchema);

module.exports = ApplicantModel;
