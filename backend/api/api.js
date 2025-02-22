// api.js
const express = require('express');
const admin = require('firebase-admin');
const axios = require("axios");
const secureScraping = require('secure-scraping');
const redisClient = require('redis');
const redis = redisClient.getClient();
const {
  scrapeFlights,
  scrapeVeniceTrainsTimeData
} = require('./functions')


const router = express.Router();

// Endpoint per la radice
router.get('/', (req, res) => {
  res.json({ message: 'Benvenuto nell\'API di scraping!' });
});

// Endpoint per ottenere i dati della popolazione
router.get('/api/venicePopulation', async (req, res) => {
  try {
    const snapshot = await admin.database()
                                              .ref('dashboard/data/VenicePopulation')
                                               .once('value');
    const populationData = snapshot.val();
    res.json({
      success:true,
      data:populationData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Errore durante il recupero dei dati Popolazione: ${error}`
    });
  }
});


// Endpoint per recuperare i dati delle maree da Firebase
router.get('/api/veniceTides', async (req, res) => {
  try {
    const snapshot = await admin.database()
        .ref('dashboard/data/Tides')
        .once('value');

    const tideData = snapshot.val();
    if (tideData) {
      res.json({
        success: true,
        tides: tideData
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Nessun dato trovato.'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Errore durante il recupero dei dati tide: ${error}`
    });
  }
});

router.get('/api/veniceTourism', async (req, res) => {
  try {
    // 1. First try to get cached data
    const snapshot = await admin.database()
        .ref('dashboard/data/Tourism')
        .once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: `Tourism data cannot be found!`,
      });
    }

    const tourismData = snapshot.val();

    res.json({
      date: tourismData,
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to process request',
      details: error.message
    });
  }
});



router.get('/api/veniceAirQualityLocations', async (req, res) => {
  try {
    // 1. First try to get cached data
    const snapshot = await admin.database()
        .ref('dashboard/data/VeniceAir')
        .once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: `Venice Air quality data cannot be found!`,
      });
    }

    const tourismData = snapshot.val();

    res.json({
      date: tourismData,
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to process request',
      details: error.message
    });
  }
});

router.get('/api/veniceTrainsArrivalTime', async (req, res) => {
  try{
    const url = "https://iechub.rfi.it/ArriviPartenze/ArrivalsDepartures/Monitor?placeId=3009&arrivals=True";
    let trainsArrivalData  = await axios.get(url)
    res.json({
      success:true,
      data:trainsArrivalData
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: `Error on fetching TrainArrival data: ${error} `
    });
  }
})

router.get('/api/veniceTrainsDepartureTime', async (req, res) => {
  try{
    const url = "https://iechub.rfi.it/ArriviPartenze/ArrivalsDepartures/Monitor?placeId=3009&arrivals=False";

    let trainsDepartureData  = await axios.get(url)
    res.json({
      success:true,
      data:trainsDepartureData
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message:`Error on fetching TrainDestination data: ${error} `
    });
  }
})

router.get('/api/airplanes', async (req, res) => {

  // Ottieni la data e l'ora attuali
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const currentHour = now.getHours();

  let hourParam;
  if (currentHour < 6) {
    hourParam = 0;       // Intervallo 0-6
  } else if (currentHour < 12) {
    hourParam = 6;       // Intervallo 6-12
  } else if (currentHour < 18) {
    hourParam = 12;      // Intervallo 12-18
  } else {
    hourParam = 18;      // Intervallo 18-24
  }

  // Costruisci gli URL dinamici
  const urlArrival = `https://www.flightstats.com/v2/flight-tracker/arrivals/VCE/?year=${year}&month=${month}&date=${day}&hour=${hourParam}`;
  const urlDeparture = `https://www.flightstats.com/v2/flight-tracker/departures/VCE/?year=${year}&month=${month}&date=${day}&hour=${hourParam}`;

  try {
    // Genera due ritardi casuali (es. tra 500 e 3000 ms)
    const delayArrival = Math.floor(Math.random() * (5000 - 3000 + 1)) + 500;
    const delayDeparture = Math.floor(Math.random() * (5000 - 3000 + 1)) + 500;

    // Esegue la richiesta degli arrivi con delay
    await secureScraping.delay(() => {}, delayArrival);
    const arrivalResponse = await axios.get(urlArrival);

    // Esegue la richiesta delle partenze con delay
    await secureScraping.delay(() => {}, delayDeparture);
    const departureResponse = await axios.get(urlDeparture);

    // Elabora i dati con la funzione scrapeFlights (presumibilmente definita altrove)
    const arrivalData = await scrapeFlights(arrivalResponse.data, true);
    const departureData = await scrapeFlights(departureResponse.data, false);

    res.json({
      success: true,
      arrival: arrivalData,
      departure: departureData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error on fetching current FlightData data: ${error}`
    });
  }
});




router.get('/api/bus', async (req, res) => {
  try {
    const now = new Date();
    const currentTimeSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const endTime = currentTimeSeconds + 600;

    const databaseRef = admin.database().ref('busData');
    const busSnapshot = await databaseRef
        .orderByChild('departureTimestamp')
        .startAt(currentTimeSeconds)
        .endAt(endTime)
        .once('value');

    const busResults = [];
    busSnapshot.forEach((childSnapshot) => {
      busResults.push(childSnapshot.val());
    });

    console.log('Results:', busResults);
    res.json({
      success: true,
      data: busResults
    });

  } catch (error) {
    console.error('Errore:', error);
    res.status(500).json({
      success: false,
      message: `Errore nel recupero dati: ${error.message}`
    });
  }
});

router.get('/api/boat', async (req, res) => {
  try {
    const now = new Date();
    const currentTimeSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const endTime = currentTimeSeconds + 600;

    const databaseRef = admin.database().ref('boatData');
    const boatSnapshot = await databaseRef
        .orderByChild('departureTimestamp')
        .startAt(currentTimeSeconds)
        .endAt(endTime)
        .once('value');

    const results = [];
    boatSnapshot.forEach((childSnapshot) => {
      results.push(childSnapshot.val());
    });

    console.log('Results:', results);
    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Errore:', error);
    res.status(500).json({
      success: false,
      message: `Errore nel recupero dati: ${error.message}`
    });
  }
});

// Esporta il router
module.exports = router;