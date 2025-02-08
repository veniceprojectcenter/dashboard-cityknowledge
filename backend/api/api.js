// api.js
const express = require('express');
const admin = require('firebase-admin');
const axios = require("axios");
const cheerio = require("cheerio");
const {
  scrapeVeniceTrainsTimeData,
    /*to remove*/
  saveBoatDataToFirebase,
} = require('./functions')
const SecureScraping = require('./secure-scraping');


const secureScrapingPromise = (async () =>{
   const listProxies = await SecureScraping.getListProxies();
   const listUserAgents = await SecureScraping.getListUserAgents();
   return new SecureScraping(listProxies, listUserAgents);
}) ();


const router = express.Router();

// Endpoint per la radice
router.get('/', (req, res) => {
  res.json({ message: 'Benvenuto nell\'API di scraping!' });
});

// Endpoint per ottenere i dati della popolazione
router.get('/api/population', async (req, res) => {
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
router.get('/api/tides', async (req, res) => {
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


router.get('/api/tourism', async (req, res) => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const url = `https://statistica.regione.veneto.it/jsp/turi1.jsp?D0=${previousYear}
    &D1=REGIONE+VENETO&D2=00Totale+anno&D3=Movimento+annuale+per+tipo+di+esercizio&B1=Visualizza`;
  const headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-GB,en;q=0.9',
    'Connection': 'keep-alive',
    'Host': 'statistica.regione.veneto.it',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'User-Agent': ''
  };
  try {
    const secureScrapingInstance = await secureScrapingPromise;
    // Fai la richiesta HTTP alla pagina
    const { data } = await secureScrapingInstance.secureGet(url, headers);

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




router.get('/api/air-quality-locations', async (req, res) => {
  const lat = 45.437191; // Latitudine di Venezia
  const lng = 12.334590; // Longitudine di Venezia

  // Nuovo URL per l'API Open-Meteo
  const apiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}
  &hourly=pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index,ammonia,methane`;

  try {
    const response = await axios.get(apiUrl);

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
    const headers = {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
      "Cache-Control": "max-age=0",
      "Connection": "keep-alive",
      "Host": "iechub.rfi.it",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": '',
      "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": "\"Android\""
    };
    let trainsArrivalData  = await scrapeVeniceTrainsTimeData(url,headers);
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
    const headers = {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
      "Cache-Control": "max-age=0",
      "Connection": "keep-alive",
      "Host": "iechub.rfi.it",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": '',
      "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": "\"Android\""
    };

    let trainsDepartureData  = await scrapeVeniceTrainsTimeData(url,headers);
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


/*Da eliminare , è per testing */
router.get('/api/test',async(req,res) => {
  try{
      await admin.database().ref(`dashboard/data/Bus/stop_times`).remove();
    const secureScrapingInstance = await secureScrapingPromise;

    // URL to check the IP address
    const ipCheckUrl = 'https://api.ipify.org?format=json';

    // Make a request using secureGet
    const { data } = await secureScrapingInstance.secureGet(ipCheckUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    // Log the IP address used for the request
    console.log('IP address used for the request:', data.ip);

    // Check if the IP matches any of the proxies
    const proxies = await SecureScraping.getUpdatedListProxies();
    if (proxies.includes(data.ip)) {
      console.log('The request is using a proxy.');
    } else {
      console.log('The request is NOT using a proxy.');
    }
  }catch(error){
    console.error('Errore nel fare scraping della pagina:', error);
  }
})

// Esporta il router
module.exports = router;