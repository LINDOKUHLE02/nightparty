const nodemailer = require('nodemailer');
const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

// Log the email user to verify it's loaded correctly
console.log('Email User:', process.env.EMAIL_USER);

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// CORS setup (if necessary)
const cors = require('cors');
app.use(cors());

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Use environment variable for sender email
        pass: process.env.EMAIL_PASS, // Use environment variable for email password
    },
});

// Endpoint for RSVP
app.post('/rsvp', (req, res) => {
    const { name, email, guests } = req.body;

    // Validate input
    if (!name || !email || !guests) {
        return res.status(400).json({ message: 'Name, email, and guests are required.' });
    }
    if (!Number.isInteger(guests) || guests < 0) {
        return res.status(400).json({ message: 'Guests must be a non-negative integer.' });
    }

    const rsvpData = { name, email, guests: Number(guests) }; // Ensure guests is a number
    const filePath = path.join(__dirname, 'rsvps.json');

    fs.readFile(filePath, (err, data) => {
        let rsvps = [];
        if (err) {
            console.error('Error reading RSVP file:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (data.length > 0) {
            try {
                rsvps = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing RSVP data:', parseError);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
        
        rsvps.push(rsvpData);

        fs.writeFile(filePath, JSON.stringify(rsvps, null, 2), (err) => {
            if (err) return res.status(500).json({ message: 'Internal Server Error' });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'Thembokuhlem07@gmail.com', // Recipient's email
                subject: 'New RSVP for Night Party',
                text: `New RSVP from ${name} (${email}).\nGuests: ${guests}`,
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.json({ message: 'Thank you for your RSVP! However, we could not send an email notification.' });
                }
                res.json({ message: 'Thank you for your RSVP!' });
            });
        });
    });
});

// New endpoint to get the RSVP list
app.get('/rsvps', (req, res) => {
    const filePath = path.join(__dirname, 'rsvps.json');

    fs.readFile(filePath, (err, data) => {
        if (err) return res.status(500).json({ message: 'Internal Server Error' });
        
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

// New endpoint to serve the RSVP list HTML page
app.get('/rsvp-list', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rsvp-list.html'));
});

// Start the server
const PORT = process.env.PORT || 3001; // Use port 3001 for the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});