const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    guests: { type: Number, default: 0 },
    comments: { type: String, default: '' },
});

const Rsvp = mongoose.model('Rsvp', rsvpSchema);

module.exports = Rsvp;
