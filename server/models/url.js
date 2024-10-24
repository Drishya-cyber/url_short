const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    redirectURL: {
        type: String,
        required: true,
    },
    visitHistory: [{
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }],
    expiresAt: {
        type: Date,
        required: false,
    },
});

module.exports = mongoose.model('URL', urlSchema);
