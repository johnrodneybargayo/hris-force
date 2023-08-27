const app = require("..");
const bcrypt = require("bcrypt");
const ApplicantModel = require("../models/Applicant"); // Import your mongoose model for applicants
const { UserModel } = require("../models/User"); // Replace the path with the correct one

// Mark applicant as hired
exports.markApplicantAsHired = async (req, res) => {
  try {
    const applicantId = req.params.id;

    // Find the applicant by ID
    const applicant = await ApplicantModel.findById(applicantId);

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    const saltRounds = 10; // Number of salt rounds for hashing
    const hashedPassword = await bcrypt.hash("EmpireoneTest123", saltRounds);

    // Update applicant status
    applicant.status = "Onboarding";
    await applicant.save();

    // Create a user record based on applicant data
    const newUser = new UserModel({
      image: applicant.image, // Use the imageUrl from the applicant
      signature: applicant.signature, // Use the signatureUrl from the applicant
      email: applicant.email,
      password: hashedPassword, // You might want to generate a secure password here
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      middleName: applicant.middleName,
      mobileNumber: applicant.mobileNumber,
      dateOfBirth: applicant.dateOfBirth,
      placeOfBirth: applicant.placeOfBirth,
      gender: applicant.gender,
      maritalStatus: applicant.maritalStatus,
      currentAddress: applicant.currentAddress,
      permanentAddress: applicant.permanentAddress,
      barangay: applicant.barangay,
      city: applicant.city,
      state: applicant.state,
      country: applicant.country,
      postcode: applicant.postcode,
      schoolName: applicant.schoolName,
      courseGraduated: applicant.courseGraduated,
      yearGraduated: applicant.yearGraduated,
      emergencyName: applicant.emergencyName,
      emergencyContactNumber: applicant.emergencyContactNumber,
      emergencyAlternateContactNumber: applicant.emergencyAlternateContactNumber,
      emergencyRelationship: applicant.emergencyRelationship,
      sssNumber: applicant.sssNumber,
      tinNumber: applicant.tinNumber,
      philHealthId: applicant.philHealthId,
      fatherName: applicant.fatherName,
      motherMaidenName: applicant.motherMaidenName,
      companyName: applicant.companyName,
      position: applicant.position,
      dateHired: applicant.dateHired,
      dateResigned: applicant.dateResigned,
      companyName2: applicant.companyName2,
      position2: applicant.position2,
      dateHired2: applicant.dateHired2,
      dateResigned2: applicant.dateResigned2,
      status: "Onboarding", // Set the status for the user based on your logic
      positionApplied: applicant.positionApplied,
    });

    // Save the user record to the database
    await newUser.save();

    console.log("Applicant marked as hired:", applicant);
    console.log("User record created:", newUser);

    res.json({ message: "Applicant marked as hired" });
  } catch (error) {
    console.error("Error marking applicant as hired:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};
// Mark applicant as failed
exports.markApplicantAsFailed = async (req, res) => {
  try {
    const applicantId = req.params.id;

    // Find the applicant by ID
    const applicant = await Applicant.findById(applicantId);

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    // Update applicant status
    applicant.status = "Failed";
    await applicant.save();

    res.json({ message: "Applicant marked as failed" });
  } catch (error) {
    console.error("Error marking applicant as failed:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};
