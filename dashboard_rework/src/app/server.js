// server.js
const express = require('express');
const cors = require('cors'); // Importa il pacchetto cors
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const apiRoutes = require('./api');
const scraperRoutes = require('./scraper'); // Importa il router dallo scraper
const cron = require('node-cron');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cityknowledge.firebaseio.com/"
});

const app = express();
const PORT = 3000;

// Middleware per gestire le richieste JSON
app.use(express.json());

// Usa CORS per consentire le richieste da altri domini
app.use(cors()); // Abilita CORS per tutte le rotte

// Usa le rotte API
app.use('/', apiRoutes);
app.use('/', scraperRoutes); // Usa il router di scraping

// Pianificazione periodica per eseguire lo scraping ogni giorno a mezzanotte
cron.schedule('0 0 * * *', async () => {
  console.log('Esecuzione del task di web scraping alle 00:00');

  // Elimina i dati esistenti prima di eseguire lo scraping
  await deleteExistingData("dashboard/data/VenicePopulation");
  await deleteExistingData("dashboard/data/Tides");

  // Scraping dei dati di popolazione
  const populationUrl = 'https://portale.comune.venezia.it/millefoglie/statistiche/scheda/QUARTIERE-POPOLA-2$1$--------';
  const populationData = await scrapePopulationData(populationUrl);
  if (populationData) {
    await savePopulationDataToFirebase(populationData); // Salva i dati di popolazione
  }

  // Recupero e salvataggio dei dati delle maree
  const lat = 45.4408;
  const lng = 12.3155;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const startDate = today.toISOString().split('T')[0];
  const endDate = tomorrow.toISOString().split('T')[0];

  const tideData = await fetchTideData(lat, lng);
  if (tideData) {
    await saveTideDataToFirebase(tideData, startDate, endDate); // Salva i dati delle maree
  }
});


// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
