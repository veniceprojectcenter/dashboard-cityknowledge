// api.js
const express = require('express');
const admin = require('firebase-admin');
const axios = require("axios");
const secureScraping = require('./secure-scraping');
const redisClient = require('./redis');
const {
  scrapeFlights,
  scrapeVeniceTrainsTimeData
} = require('./functions')
const router = express.Router();


async function cacheMiddleware(key, ttlSeconds, fetchFunction) {

  const cachedData = await redisClient.getData(key);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  // Se non esiste, esegui la funzione fetch
  console.log("no cached data");
  const freshData = await fetchFunction();
  // Salva in cache
  await redisClient.setData(key, JSON.stringify(freshData), ttlSeconds);
  return freshData;
}

function getRomeTime() {
  const now = new Date();
  const options = { timeZone: 'Europe/Rome', hour12: false };
  const formatter = new Intl.DateTimeFormat('it-IT', {
    ...options,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });

  const parts = formatter.formatToParts(now);
  const getPart = (type) => parts.find(p => p.type === type)?.value || '0';

  return {
    year: parseInt(getPart('year')),
    month: parseInt(getPart('month')),
    day: parseInt(getPart('day')),
    hour: parseInt(getPart('hour')),
    minute: parseInt(getPart('minute')),
    second: parseInt(getPart('second')),
  };
}

// Endpoint per la radice
router.get('/', (req, res) => {
  res.json({ message: 'Benvenuto nell\'API di scraping!' });
});

// Endpoint per ottenere i dati della popolazione
router.get('/api/venicePopulation', async (req, res) => {
  try {
    const data = await cacheMiddleware('VenicePopulation', 86400, async () => {
      const snapshot = await admin.database()
          .ref('dashboard/data/VenicePopulation')
          .once('value');
      return snapshot.val();
    });

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Errore durante il recupero dei dati Popolazione: ${error}`
    });
  }
});


router.get('/api/veniceTides', async (req, res) => {
  try {
    const data = await cacheMiddleware('VeniceTides', 86400, async () => {
      const snapshot = await admin.database()
          .ref('dashboard/data/Tides')
          .once('value');
      return snapshot.val();
    });

    if (data) {
      res.json({
        success: true,
        tides: data
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
    const data = await cacheMiddleware('VeniceTourism', 86400, async () => {
      const snapshot = await admin.database()
          .ref('dashboard/data/Tourism')
          .once('value');
      if (!snapshot.exists()) throw new Error("Tourism data not found");
      return snapshot.val();
    });

    res.json({
      success: true,
      data: data,
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
    const data = await cacheMiddleware('VeniceAirQualityLocations', 86400, async () => {
      const snapshot = await admin.database()
          .ref('dashboard/data/VeniceAir')
          .once('value');
      if (!snapshot.exists()) throw new Error("Venice Air quality data not found");
      return snapshot.val();
    });

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to process request',
      details: error.message
    });
  }
});

router.get('/api/veniceTrainsArrivalTime', async (req, res) => {
  try {
    const data = await cacheMiddleware('VeniceTrainsArrivalTime', 600, async () => {
      const url = "https://iechub.rfi.it/ArriviPartenze/ArrivalsDepartures/Monitor?placeId=3009&arrivals=True";
      // Assumendo che la funzione scrapeVeniceTrainsTimeData gestisca il parsing
      return await scrapeVeniceTrainsTimeData(url);
    });

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error on fetching TrainArrival data: ${error}`
    });
  }
});

router.get('/api/veniceTrainsDepartureTime', async (req, res) => {
  try {
    const data = await cacheMiddleware('VeniceTrainsDepartureTime', 600, async () => {
      const url = "https://iechub.rfi.it/ArriviPartenze/ArrivalsDepartures/Monitor?placeId=3009&arrivals=False";
      return await scrapeVeniceTrainsTimeData(url);
    });

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error on fetching TrainDeparture data: ${error}`
    });
  }
});


router.get('/api/airplanes', async (req, res) => {
  try {
    const { year, month, day, hour, minute } = getRomeTime();
    const currentTime = hour * 60 + minute; // Converti l'orario attuale in minuti

    const data = await cacheMiddleware('airplanes', 21600, async () => {
      const urlArrival = `https://www.flightstats.com/v2/flight-tracker/arrivals/VCE/?year=${year}&month=${month}&date=${day}&hour=${Math.floor(hour / 6) * 6}`;
      const urlDeparture = `https://www.flightstats.com/v2/flight-tracker/departures/VCE/?year=${year}&month=${month}&date=${day}&hour=${Math.floor(hour / 6) * 6}`;

      await secureScraping.delay(() => {}, Math.floor(Math.random() * (5000 - 3000 + 1)) + 500);
      const arrivalResponse = await axios.get(urlArrival);

      await secureScraping.delay(() => {}, Math.floor(Math.random() * (5000 - 3000 + 1)) + 500);
      const departureResponse = await axios.get(urlDeparture);

      const arrivals = await scrapeFlights(arrivalResponse.data, true);
      const departures = await scrapeFlights(departureResponse.data, false);


      return { arrival: arrivals, departure: departures };
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: `Errore: ${error}` });
  }
});


router.get('/api/bus', async (req, res) => {
  try {
    const { hour, minute, second } = getRomeTime();
    const currentTimeSeconds = hour * 3600 + minute * 60 + second;
    const endTime = currentTimeSeconds + 600;

    const data = await cacheMiddleware('busData', 600, async () => {
      const busSnapshot = await admin.database()
          .ref('busData')
          .orderByChild('departureTimestamp')
          .startAt(currentTimeSeconds)
          .endAt(endTime)
          .once('value');

      return busSnapshot.val() || [];
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: `Errore: ${error}` });
  }
});


router.get('/api/boat', async (req, res) => {
  try {
    const { hour, minute, second } = getRomeTime();
    const currentTimeSeconds = hour * 3600 + minute * 60 + second;
    const endTime = currentTimeSeconds + 600;

    const data = await cacheMiddleware('boatData', 600, async () => {
      const boatSnapshot = await admin.database()
          .ref('boatData')
          .orderByChild('departureTimestamp')
          .startAt(currentTimeSeconds)
          .endAt(endTime)
          .once('value');

      return boatSnapshot.val() || [];
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: `Errore: ${error}` });
  }
});

// Esporta il router
module.exports = router;