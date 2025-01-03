const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('firebase-admin');
const express = require('express');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');


const router = express.Router();

// Funzione per eliminare i dati esistenti in Firebase
async function deleteExistingData(path) {
  try {
    await admin.database().ref(path).remove();
    console.log(`Dati esistenti eliminati correttamente da: ${path}`);
  } catch (error) {
    console.error(`Errore durante l'eliminazione dei dati da ${path}:`, error.message);
  }
}








// Funzione per eseguire il web scraping dei dati di popolazione
async function scrapePopulationData(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Trova l'ultima riga della tabella
    const lastRow = $('table tr').last();
    const rowData = [];

    // Estrai i dati dalle celle della riga
    lastRow.find('td').each((_, cell) => {
      rowData.push($(cell).text().trim());
    });

    return rowData.length > 0 ? rowData : null;
  } catch (error) {
    console.error('Errore durante il web scraping dei dati di popolazione:', error);
    return null;
  }
}

// Funzione per salvare i dati di popolazione nel Firebase
async function savePopulationDataToFirebase(data) {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];
  const path = `dashboard/data/VenicePopulation/${dateString}`;

  try {
    await deleteExistingData("dashboard/data/VenicePopulation"); // Elimina i dati esistenti
    await admin.database().ref(path).set({
      col1: data[0] || null,
      col2: data[1] || null,
      col3: data[2] || null,
      timestamp: today.toLocaleString(),
    });
    console.log(`Dati di popolazione salvati correttamente in Firebase: ${path}`);
  } catch (error) {
    console.error(`Errore durante il salvataggio dei dati di popolazione in Firebase: ${error}`);
  }
}


// Funzione per recuperare i dati delle maree
async function fetchTideData(lat, lng) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Incrementa la data di oggi per ottenere domani

  const start = today.toISOString().split('T')[0];
  const end = tomorrow.toISOString().split('T')[0]; // Data di domani

  const url = `https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lng}&start=${start}&end=${end}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: '5cfcfbae-c6e4-11ef-ae24-0242ac130003-5cfcfc12-c6e4-11ef-ae24-0242ac130003', // Sostituisci con la tua chiave API
      },
    });

    return response.data; // Restituisce i dati ricevuti dall'API
  } catch (error) {
    console.error('Errore durante la chiamata all\'API di Stormglass:', error.response?.data || error.message);
    return null;
  }
}


// Funzione per salvare i dati delle maree in Firebase
async function saveTideDataToFirebase(data, startDate, endDate) {
  const path = `dashboard/data/Tides/${startDate}_to_${endDate}`;

  try {
    await deleteExistingData("dashboard/data/Tides"); // Elimina i dati esistenti
    await admin.database().ref(path).set({
      tides: data.data,
      meta: data.meta,
      timestamp: new Date().toLocaleString(),
    });
    console.log(`Dati delle maree salvati correttamente in Firebase: ${path}`);
  } catch (error) {
    console.error('Errore durante il salvataggio dei dati delle maree in Firebase:', error.message);
  }
}



// Endpoint per eseguire lo scraping dei dati di popolazione
router.get('/scrape/population', async (req, res) => {
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
router.get('/fetch/tides', async (req, res) => {
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

router.get('/scrape/tourism', async (req, res) => {
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




router.get('/fetch/air-quality-locations', async (req, res) => {
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



// Esporta il router
module.exports = {
    scrapePopulationData,
    savePopulationDataToFirebase,
    fetchTideData,
    saveTideDataToFirebase,
    deleteExistingData,
    router
};
