const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('../src/app/serviceAccountKey.json');
const apiRoutes = require('./api');
const cron = require('node-cron');
const scraper = require('./scraper');

// Importa le funzioni specifiche da scraper.js
const {
  scrapePopulationData,
  savePopulationDataToFirebase,
  fetchTideData,
  saveTideDataToFirebase,
  deleteExistingData
} = scraper;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cityknowledge.firebaseio.com/"
});

const app = express();
const PORT = process.env.PORT || 3000;
const scraperRoutes = scraper.router;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Usa le rotte API
app.use('/', apiRoutes);
app.use('/', scraperRoutes); // Usa il router di scraping

// Configura il cron job
cron.schedule('0 0 * * *', async () => { // Cambiato da '01 47 * * *' a '48 1 * * *'
  console.log('Avvio task di scraping...');
  try {
    console.log('Eliminazione dati esistenti...');
    await deleteExistingData("dashboard/data/VenicePopulation");
    await deleteExistingData("dashboard/data/Tides");

    const populationUrl = 'https://portale.comune.venezia.it/millefoglie/statistiche/scheda/QUARTIERE-POPOLA-2$1$--------';
    const populationData = await scrapePopulationData(populationUrl);

    if (populationData) {
      await savePopulationDataToFirebase(populationData);
    }

    const lat = 45.4408;
    const lng = 12.3155;
    const tideData = await fetchTideData(lat, lng);

    if (tideData) {
      const today = new Date();
      const startDate = today.toISOString().split('T')[0];
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const endDate = tomorrow.toISOString().split('T')[0];

      await saveTideDataToFirebase(tideData, startDate, endDate);
    }
  } catch (error) {
    console.error('Errore durante il task di scraping:', error);
  }
});


// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
