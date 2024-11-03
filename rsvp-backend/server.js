const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for cross-origin requests

// OAuth2 setup for Gmail
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "http://localhost:5000/auth/google/callback" // Make sure this matches your redirect URI in Google Cloud
);
oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

// Email sending function
async function sendEmail(name, email, guests) {
    try {
        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'Thembokuhlem07@gmail.com', // Recipient's email
            subject: 'New RSVP for Night Party',
            text: `New RSVP from ${name} (${email}).\nGuests: ${guests}`,
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Endpoint to handle RSVPs
app.post('/rsvp', async (req, res) => {
    const { name, email, guests } = req.body;

    if (!name || !email || !Number.isInteger(guests) || guests < 0) {
        return res.status(400).json({ message: 'Invalid input. Name, email, and a non-negative number of guests are required.' });
    }

    const rsvpData = { name, email, guests };
    const filePath = path.join(__dirname, 'rsvps.json');

    fs.readFile(filePath, (err, data) => {
        let rsvps = [];
        if (!err && data.length > 0) {
            try {
                rsvps = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing RSVP data:', parseError);
            }
        }
        
        rsvps.push(rsvpData);

        fs.writeFile(filePath, JSON.stringify(rsvps, null, 2), async (writeErr) => {
            if (writeErr) {
                console.error('Error writing to RSVP file:', writeErr);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            try {
                await sendEmail(name, email, guests);
                res.json({ message: 'Thank you for your RSVP!' });
            } catch (emailError) {
                res.json({ message: 'Thank you for your RSVP! However, we could not send an email notification.' });
            }
        });
    });
});

// Endpoint to retrieve RSVP list
app.get('/rsvps', (req, res) => {
    const filePath = path.join(__dirname, 'rsvps.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading RSVP file:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        let rsvps = [];
        if (data.length > 0) {
            try {
                rsvps = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing RSVP data:', parseError);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
        
        res.json(rsvps);
    });
});

// Endpoint to serve the RSVP list HTML page
app.get('/rsvp-list', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rsvp-list.html'));
});

// Callback route for Google OAuth2
app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query; // Get the authorization code from the query parameters

    if (!code) {
        return res.status(400).send('No code provided');
    }

    try {
        const { tokens } = await oauth2Client.getToken(code); // Exchange the code for tokens
        oauth2Client.setCredentials(tokens); // Set the tokens in the OAuth2 client

        // You can redirect to a success page or handle the tokens further as needed
        res.redirect('/'); // Redirecting to home page after successful authentication
    } catch (error) {
        console.error('Error retrieving access token', error);
        res.status(500).send('Authentication failed');
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
