const axios = require('axios');
const admin = require('./firebase');
const { deleteExistingData } = require('./utils');

module.exports = async (req, res) => {
    const lat = 45.4408; // Venice Latitude
    const lng = 12.3155; // Venice Longitude
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const startDate = today.toISOString().split('T')[0];
    const endDate = tomorrow.toISOString().split('T')[0];
    const url = `https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lng}&start=${startDate}&end=${endDate}`;

    try {
        const response = await axios.get(url, { headers: { Authorization: process.env.TIDEAPI_KEY } });
        const data = response.data;

        const path = `dashboard/data/Tides/${startDate}_to_${endDate}`;
        await deleteExistingData('dashboard/data/Tides');
        await admin.database().ref(path).set({ tides: data });
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching tides data:', error);
        res.status(500).json({ error: 'Failed to scrape tides data.' });
    }
};
