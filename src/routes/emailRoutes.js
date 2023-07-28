const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const GMAIL_USER_EMAIL = 'career@empireonegs.com';
const GMAIL_USER_REFRESH_TOKEN = 'ya29.a0AbVbY6PnSWnrlDZploNdNshR7oIpBHI_JTno_zEHbT7TF5hmi9LgZx3hF48n8Y7ozSbY4rLHlofT5oqISmCGBQngIe7AV52AAdyDEQ-2m5oguh4zHU4njbCblvIkhtWPCD0zUi3FWSvxZbOw8xmjpay6FeKjaCgYKAcQSARMSFQFWKvPlJUXfSqMmqrxDjZP7bKSosQ0163';

oAuth2Client.setCredentials({
  refresh_token: GMAIL_USER_REFRESH_TOKEN,
});

const getEmailCountForSender = async (sender) => {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    const response = await gmail.users.messages.list({
      userId: GMAIL_USER_EMAIL,
      q: `from:${sender}`,
    });

    if (response && response.status === 200 && response.data && response.data.messages && Array.isArray(response.data.messages)) {
      return response.data.messages.length;
    } else {
      console.error(`Unexpected response from Gmail API for ${sender}:`, response);
      return 0;
    }
  } catch (err) {
    console.error(`Error fetching email counts for ${sender}:`, err);
    return 0;
  }
};

const getEmailsFromAllWithApplications = async () => {
    try {
      const keywords = ['applications'];
      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
      const response = await gmail.users.messages.list({
        userId: GMAIL_USER_EMAIL,
        q: keywords.map((keyword) => `subject:${keyword}`).join(' OR '),
      });
  
      if (response && response.status === 200 && response.data && response.data.messages && Array.isArray(response.data.messages)) {
        const emails = response.data.messages.map((message) => {
          const subjectHeader = message.payload.headers.find((header) => header.name === 'Subject');
          return subjectHeader ? subjectHeader.value : 'No subject';
        });
  
        return emails;
      } else {
        console.error('Unexpected response from Gmail API for All:', response);
        return [];
      }
    } catch (err) {
      console.error('Error fetching emails for All:', err);
      return [];
    }
  };

router.get('/', async (req, res) => {
  try {
    const linkedinCount = await getEmailCountForSender('LinkedIn');
    const indeedCount = await getEmailCountForSender('@indeedemail.com');
    const mynimoCount = await getEmailCountForSender('Mynimo');
    const jobstreetCount = await getEmailCountForSender('Jobstreet');
    const empireoneCount = await getEmailCountForSender('wordpress@empireonecontactcenter.com');
    const allEmails = await getEmailsFromAllWithApplications('career@empireonegs.com');

    const emailCounts = {
        indeed: indeedCount,
      linkedin: linkedinCount,
      mynimo: mynimoCount,
      jobstreet: jobstreetCount,
      empireonecontactcenter: empireoneCount,
      all: allEmails.length,
    };

    res.json(emailCounts);
  } catch (err) {
    console.error('Error fetching email counts:', err);
    res.status(500).json({ error: 'Failed to fetch email counts' });
  }
});

module.exports = router;
