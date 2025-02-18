// api.js
const express = require('express');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");
const {
  scrapeVeniceTrainsTimeData,
  scrapeFlights
} = require('./functions')
const SecureScraping = require('./secure-scraping');
const secureScraping = new SecureScraping();


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

/*@TODO save on firebase*/
router.get('/api/veniceTourism', async (req, res) => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const url = `https://statistica.regione.veneto.it/jsp/turi1.jsp?D0=${previousYear}&D1=REGIONE+VENETO&D2=00Totale+anno&`+
      `D3=Movimento+annuale+per+tipo+di+esercizio&B1=Visualizza`;
  try {
    // Fai la richiesta HTTP alla pagina
    const { data } = await axios.get(url);

    // Carica la risposta HTML in Cheerio
    const $ = cheerio.load(data);

    // Seleziona il secondo table (indice 1)
    const table = $('table').eq(1);

    // Estrai la descrizione, gli arrivi e le presenze
    const tourismData = [];
    table.find('tr').each((i, row) => {
      const rowCells = $(row).find('td')
                              .map((i, cell) =>
                                $(cell).text().trim()).get();
      if (rowCells.length > 0) {
        const description = rowCells[0];
        const arrivals = parseInt(rowCells[rowCells.length - 2].replace(/\./g, ''));
        const present = parseInt(rowCells[rowCells.length - 1].replace(/\./g, ''));

        tourismData.push({
          description,
          arrivals,
          present
        });
      }
    });
    // Invia i dati al frontend
    res.json({
      success: true,
      data: tourismData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Errore durante il recupero dei dati turismo: ${error}`
    });
  }
});



/*@TODO save on firebase*/
  router.get('/api/veniceAirQualityLocations', async (req, res) => {
  const lat = 45.437191; // Latitudine di Venezia
  const lng = 12.334590; // Longitudine di Venezia

  // Nuovo URL per l'API Open-Meteo
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}`
  +`&hourly=pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index,ammonia,methane`;

  try {
    const response = await axios.get(url);

    const airQualityData = response.data; // Estrai i dati della qualità dell'aria

    // Restituisci i dati come risposta JSON
    res.json({
      success: true,
      data: airQualityData
    });
  } catch (error) {
    // In caso di errore, restituisci una risposta di errore
    res.status(500).json({
      success: false,
      message: `Errore durante il recupero dei dati sulla qualità dell'aria: ${error}`
    });
  }
});

router.get('/api/veniceTrainsArrivalTime', async (req, res) => {
  try{
    const url = "https://iechub.rfi.it/ArriviPartenze/ArrivalsDepartures/Monitor?placeId=3009&arrivals=True";
    let trainsArrivalData  = await scrapeVeniceTrainsTimeData(url)
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

    let trainsDepartureData  = await scrapeVeniceTrainsTimeData(url)
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

/* @TODO: save on firebase*/
router.get('/api/airplanes', async (req,res) => {
  // Ottieni la data e l'ora attuali
  const now = new Date();

// Estrai anno, mese e giorno (ricorda che i mesi in JavaScript partono da 0)
  const year = now.getFullYear();
  const month = now.getMonth() + 1;  // aggiungiamo 1 per avere il mese corretto (1-12)
  const day = now.getDate();

// Ottieni l'orario attuale in ore (0-23)
  const currentHour = now.getHours();

// Determina l'intervallo orario in base al valore di currentHour
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

// Costruisci l'URL dinamico
  const urlArrival = `https://www.flightstats.com/v2/flight-tracker/arrivals/VCE/?year=${year}&month=${month}&date=${day}&hour=${hourParam}`;
  const urlDeparture = `https://www.flightstats.com/v2/flight-tracker/departures/VCE/?year=${year}&month=${month}&date=${day}&hour=${hourParam}`;
  try {
    const [arrivalResponse, departureResponse] = await Promise.all([
      secureScraping.secureGet(urlArrival),
      secureScraping.secureGet(urlDeparture),
    ]);

    res.json({
      success: true,
      arrival: await scrapeFlights(arrivalResponse.data, true),
      departure: await scrapeFlights(departureResponse.data, false)
    })
  }catch(error){
    res.status(500).json({
      success: false,
      message:`Error on fetching current FlightData data: ${error} `
    })
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