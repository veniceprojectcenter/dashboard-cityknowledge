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
  // Prova a leggere dalla cache
  const cachedData = await redisClient.getData(key);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  // Se non esiste, esegui la funzione fetch
  const freshData = await fetchFunction();
  // Salva in cache
  await redisClient.setData(key, JSON.stringify(freshData), ttlSeconds);
  return freshData;
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

    // La chiave della cache include anche la data per evitare conflitti

    const data = await cacheMiddleware('airplanes', 21600, async () => {
      // Costruisci gli URL dinamici
      const urlArrival = `https://www.flightstats.com/v2/flight-tracker/arrivals/VCE/?year=${year}&month=${month}&date=${day}&hour=${hourParam}`;
      const urlDeparture = `https://www.flightstats.com/v2/flight-tracker/departures/VCE/?year=${year}&month=${month}&date=${day}&hour=${hourParam}`;

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

      return {
        arrival: arrivalData,
        departure: departureData
      };
    });

    res.json({
      success: true,
      data: data
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

    const data = await cacheMiddleware('busData', 600, async () => {
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
      return busResults;
    });

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
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

    const data = await cacheMiddleware('boatData', 600, async () => {
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
      return results;
    });

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Errore nel recupero dati: ${error.message}`
    });
  }
});


// Esporta il router
module.exports = router;