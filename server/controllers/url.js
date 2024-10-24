const shortid = require("shortid");
const QRCode = require('qrcode');
const URL = require('../models/url');


const handleGenerateNewShortURL = async (req, res) => {
    const { url, expiresAt } = req.body; 
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const shortID = shortid.generate(); 
    const shortUrl = `http://localhost:8001/${shortID}`; 

    await URL.create({
        shortId: shortID,
        redirectURL: url,
        visitHistory: [],
        expiresAt, 
    });

    
    const qrCodeUrl = await QRCode.toDataURL(shortUrl); 

    return res.json({ id: shortID, qrCode: qrCodeUrl }); 
};


const handleGetAnalytics = async (req, res) => {
    const shortId = req.params.shortId;

    try {
        const url = await URL.findOne({ shortId });
        if (url) {
            const totalClicks = url.visitHistory.length;
            res.json({
                totalClicks,
                analytics: url.visitHistory,
            });
        } else {
            res.status(404).json({ message: 'Short URL not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { handleGenerateNewShortURL, handleGetAnalytics };
