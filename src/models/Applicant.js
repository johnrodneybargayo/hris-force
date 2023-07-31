const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String },
  mobileNumber: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  postcode: { type: String, required: true },
  state: { type: String, required: true },
  area: { type: String },
  emailId: { type: String, required: true },
  education: { type: String },
  country: { type: String },
  stateRegion: { type: String },
  experience: { type: String },
  additionalDetails: { type: String },
  provincialAddress: { type: String },
  currentAddress: { type: String },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  dateOfBirth: { type: String },
  placeOfBirth: { type: String },
  maritalStatus: { type: String },
  gender: { type: String },
  courseGraduated: { type: String },
  yearGraduated: { type: String },
  school: { type: String },
  mothersMaidenName: { type: String },
  fathersName: { type: String },
  familyMembers: { type: String },
  contactPerson: { type: String },
  alternatePhoneNumber: { type: String },
  relationship: { type: String },
  workExperiences: [
    {
      company: { type: String },
      position: { type: String },
      companyAddress: { type: String },
      dateHired: { type: String },
      dateResigned: { type: String },
    },
  ],
  image: { type: String }, // New property for image URL (or image filename)
});

const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = Applicant;
