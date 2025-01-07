const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('./firebase');
const { deleteExistingData } = require('./utils');

module.exports = async (req, res) => {
    const url = 'https://portale.comune.venezia.it/millefoglie/statistiche/scheda/QUARTIERE-POPOLA-2$1$--------';

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const lastRow = $('table tr').last();
        const rowData = [];

        lastRow.find('td').each((_, cell) => {
            rowData.push($(cell).text().trim());
        });

        if (rowData.length > 0) {
            const path = `dashboard/data/VenicePopulation/${new Date().toISOString().split('T')[0]}`;
            await deleteExistingData('dashboard/data/VenicePopulation');
            await admin.database().ref(path).set({ rowData });
            res.status(200).json({ success: true, rowData });
        } else {
            res.status(500).json({ success: false, message: 'No data scraped.' });
        }
    } catch (error) {
        console.error('Error scraping population data:', error);
        res.status(500).json({ error: 'Failed to scrape population data.' });
    }
};
