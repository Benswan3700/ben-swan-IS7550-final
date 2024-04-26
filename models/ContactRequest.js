const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    email: {
        type: String,
        required: true,
        
    },
    phone: String,
    message: {
        type: String,
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateResponded: Date,
    response: String
});

contactRequestSchema.virtual('shortMessage').get(function() {
    return `${this.message.split(/\s+/).slice(0, 10).join(" ")}...`;
});

const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema);

module.exports = ContactRequest;
