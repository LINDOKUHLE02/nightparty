const axios = require('axios');

// Define the RSVP data
const rsvpData = {
    name: "John Doe",                // Replace with the test name
    email: "johndoe@example.com",    // Replace with the test email
    guests: 2,                       // Number of guests
    // comments: "Looking forward to the event!" // Remove or comment out this line if comments are not needed
};

// Send POST request to the RSVP endpoint
axios.post('http://localhost:3001/rsvp', rsvpData) // Updated port from 5000 to 3001
    .then(response => {
        console.log('Response:', response.data); // Log the response from the server
    })
    .catch(error => {
        console.error('Error:', error.response ? error.response.data : error.message); // Log any errors
    });
