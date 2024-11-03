// Event listener for the RSVP button
document.getElementById("rsvp-button").addEventListener("click", function() {
    alert("RSVP button clicked! Redirecting to RSVP form...");
    window.location.href = "#"; // Replace with the actual RSVP form link if available
});

// Function to submit RSVP
function submitRSVP(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const guests = document.getElementById('guests').value;

    // Fetch request to submit RSVP
    fetch('http://localhost:3000/rsvp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, guests }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message); // Notify user of success
    })
    .catch(error => {
        console.error('Error:', error); // Handle error
        alert('Failed to submit RSVP. Please try again.'); // Notify user of error
    });
}

// Attach event listener to the RSVP form submission
document.getElementById('rsvp-form').addEventListener('submit', submitRSVP);
