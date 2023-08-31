const express = require('express');
const router = express.Router();
const ApplicantModel = require('../models/Applicant'); // Import the Applicant model

// Route to get status counts of applicants
router.get('/', async (req, res) => {
  try {
    const statusCounts = await ApplicantModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // If you want to include the total count of all statuses
    const total = statusCounts.reduce((acc, statusCount) => acc + statusCount.count, 0);
    statusCounts.push({ _id: 'Total', count: total });

    res.status(200).json(statusCounts);
  } catch (error) {
    console.error('Error getting status counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
