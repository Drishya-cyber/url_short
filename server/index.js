const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require('./routes/url');

const URL = require('./models/url');

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log('MongoDB connected'));

app.use(express.json());

app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    try {
        const entry = await URL.findOneAndUpdate(
            { shortId, expiresAt: { $gt: new Date() } },
            {
                $push: { visitHistory: { timestamp: Date.now() } },
            },
            { new: true }
        );

        if (entry) {
            res.redirect(entry.redirectURL);
        } else {
            res.status(404).json({ message: 'URL not found or expired' });
        }
    } catch (error) {
        console.error('Error during redirection:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
