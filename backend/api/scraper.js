const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
require('dotenv').config();
const {
  savePopulationDataToFirebase,
  saveTideDataToFirebase,
  fetchTideData,
  scrapeVeniceTrainsTimeData,
  scrapePopulationData,
  fetchbusData
} = require('./functions')

const router = express.Router();





// Endpoint per eseguire lo scraping dei dati di popolazione
router.get('/api/scrape/population', async (req, res) => {
  const url = 'https://portale.comune.venezia.it/millefoglie/statistiche/scheda/QUARTIERE-POPOLA-2$1$--------';

  const data = await scrapePopulationData(url);

  if (data) {
    await savePopulationDataToFirebase(data);
    res.json({ success: true, data:data });
  } else {
    res.status(500).json({ success: false, message: 'Errore durante il web scraping.' });
  }
});

// Endpoint per recuperare e salvare i dati delle maree
router.get('/api/fetch/tides', async (req, res) => {
  const lat = 45.4408; // Latitudine di Venezia
  const lng = 12.3155; // Longitudine di Venezia

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const startDate = today.toISOString().split('T')[0];
  const endDate = tomorrow.toISOString().split('T')[0];

  const tideData = await fetchTideData(lat, lng);

  if (tideData) {
    await saveTideDataToFirebase(tideData, startDate, endDate);
    res.json({ success: true, data: tideData });
  } else {
    res.status(500).json({ success: false, message: 'Errore durante il recupero dei dati delle maree.' });
  }
});

router.get('/api/scrape/tourism', async (req, res) => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const url = `https://statistica.regione.veneto.it/jsp/turi1.jsp?D0=${previousYear}&D1=REGIONE+VENETO&D2=00Totale+anno&D3=Movimento+annuale+per+tipo+di+esercizio&B1=Visualizza`;

  try {
    // Fai la richiesta HTTP alla pagina
    const { data } = await axios.get(url);

    // Carica la risposta HTML in Cheerio
    const $ = cheerio.load(data);

    // Seleziona il secondo table (indice 1)
    const table = $('table').eq(1);

    // Estrai la descrizione, gli arrivi e le presenze
    const result = [];
    table.find('tr').each((i, row) => {
      const cells = $(row).find('td').map((i, cell) => $(cell).text().trim()).get();
      if (cells.length > 0) {
        const description = cells[0];
        const arrivi = parseInt(cells[cells.length - 2].replace(/\./g, ''));
        const presenze = parseInt(cells[cells.length - 1].replace(/\./g, ''));

        result.push({
          description,
          arrivi,
          presenze
        });
      }
    });
    // Invia i dati al frontend
    res.json(result);
  } catch (error) {
    console.error('Errore nel fare scraping della pagina:', error);
    res.status(500).send('Errore nel fare scraping della pagina');
  }
});




router.get('/api/fetch/air-quality-locations', async (req, res) => {
  const lat = 45.437191; // Latitudine di Venezia
  const lng = 12.334590; // Longitudine di Venezia

  // Nuovo URL per l'API Open-Meteo
  const apiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&hourly=pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index,ammonia,methane`;

  try {
    const response = await axios.get(apiUrl);

    const airQualityData = response.data; // Estrai i dati della qualità dell'aria

    // Restituisci i dati come risposta JSON
    res.json({ success: true, data: airQualityData });
  } catch (error) {
    console.error('Errore durante la chiamata all\'API Open-Meteo:', error.response?.data || error.message);

    // In caso di errore, restituisci una risposta di errore
    res.status(500).json({ success: false, message: 'Errore durante il recupero dei dati sulla qualità dell\'aria.', error: error.message });
  }
});

router.get('/api/scrape/veniceTrainsArrivalTime', async (req, res) => {
  try{
    let path = "https://iechub.rfi.it/ArriviPartenze/ArrivalsDepartures/Monitor?placeId=3009&arrivals=True";
    let data  = await scrapeVeniceTrainsTimeData(path);
    res.json(data);
  }catch(error){
    res.status(500).json({ message:`Error on fetching TrainArrival data: ${error} `});
  }
})

router.get('/api/scrape/veniceTrainsDestinationTime', async (req, res) => {
  try{
    let path = "https://iechub.rfi.it/ArriviPartenze/ArrivalsDepartures/Monitor?placeId=3009&arrivals=False";
    let data  = await scrapeVeniceTrainsTimeData(path);
    res.json(data);
  }catch(error){
    res.status(500).json({ message:`Error on fetching TrainDestination data: ${error} `});
  }
})

router.get('/api/scrape/veniceBusData',async(req,res) => {
    try{
      await fetchbusData();
      res.json({success:'true'});
    }catch(error){
      console.error('Errore nel fare scraping della pagina:', error);
    }
})


// Esporta il router
module.exports = {
  router
};
