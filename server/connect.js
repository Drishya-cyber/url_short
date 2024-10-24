const mongoose = require('mongoose');

const connectToMongoDB = (uri) => {
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

module.exports = { connectToMongoDB };
