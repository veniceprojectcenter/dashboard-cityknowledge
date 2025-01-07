const admin = require('./firebase');

module.exports = async (req, res) => {
    try {
        const snapshot = await admin.database().ref('dashboard/data/Tides').once('value');
        const data = snapshot.val();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching tides data:', error);
        res.status(500).json({ error: 'Failed to fetch tides data.' });
    }
};
