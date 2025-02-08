const admin = require('firebase-admin');
const axios = require('axios');
const cheerio = require('cheerio');
const SecureScraping = require('./secure-scraping');
const dotenv = require('dotenv');
dotenv.config();

const secureScrapingPromise = (async () => {
    const proxies = await SecureScraping.getUpdatedListProxies();
    const userAgents = SecureScraping.getListUserAgents();
    return new SecureScraping(proxies, userAgents);
})();



async function scrapeVeniceTrainsTimeData(url,headers= {}){
    try{
        let allTrainsData = [];
        const singleTitleRow = {};

        const response = await axios.get(url,headers);
        const $ = cheerio.load(response.data);
        let listTitleRow = $('thead[id=headerTabId] tr');

        listTitleRow.find('th').each((i,row)=>{
            const id = $(row).attr('id');
            singleTitleRow[id] = $(row).text().trim();
        });
        allTrainsData.push(singleTitleRow);

        let listRows = $('tbody[id=bodyTabId] tr');

        listRows.each((i, row) => {
            const $row = $(row);
            const singleTrainData = {};

            $row.find('td').each((y, cell) => {
                const $cell = $(cell);
                const id = $cell.attr('id');

                if($cell.find('img').length > 0) {
                    singleTrainData[id] = $cell.find('img').attr('src');
                } else {
                    // Cerca prima nei div, altrimenti testo diretto
                    singleTrainData[id] = $cell.find('div').text().trim() || $cell.text().trim();
                }
            });
            allTrainsData.push(singleTrainData); // Spostato FUORI dal loop interno
        });
        return allTrainsData;
    }catch(error){
        console.error("Error fetching Venice Trains Time Data", error);
    }
}

// Funzione per eseguire il web scraping dei dati di popolazione
async function scrapePopulationData() {
    try {
        const url = 'https://portale.comune.venezia.it/millefoglie/statistiche/scheda/QUARTIERE-POPOLA-2$1$--------'
        const headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-GB,en;q=0.9',
            'Connection': 'keep-alive',
            'Host': 'portale.comune.venezia.it',
            'Referer': 'https://www.google.com/',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'User-Agent': '',
        };
        const secureScrapingInstance = await secureScrapingPromise;
        const { data } = await secureScrapingInstance.secureGet(url,headers);

        const $ = cheerio.load(data);

        // Trova l'ultima riga della tabella
        const lastRow = $('table tr').last();
        const rowData = [];

        // Estrai i dati dalle celle della riga
        lastRow.find('td').each((x, cell) => {
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
        const { data } = await axios.get(url, {
            headers: {
                Authorization: process.env.TIDEAPI_KEY, // Sostituisci con la tua chiave API
            },
        });

        return data; // Restituisce i dati ricevuti dall'API
    } catch (error) {
        console.error('Errore durante la chiamata all\'API di Stormglass:', error.response?.data || error.message);
        return null;
    }
}


// Funzione per salvare i dati delle maree in Firebase
async function saveTideDataToFirebase(data, startDate, endDate) {
    const path = `dashboard/data/Tides/${startDate}_to_${endDate}`;

    try {
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

async function saveBusDataToFirebase() {
    try {
        const date = new Date().toISOString().split('T')[0];
        const listBusStopsIds = ['503','501','505','506','507','508','509','510','511','512','6084','8044','514','515','516','517'];

        for (const busStopId of listBusStopsIds) {
            const url = `https://orari.actv.it/getStopSingle/${date}/AUT/${busStopId}`;
            const headers = {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-GB,en;q=0.9',
                'Connection': 'keep-alive',
                'Host': 'orari.actv.it',
                'Referer': 'https://www.google.com/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': '',
            };

            // Definisci la funzione che effettua la richiesta
            const func = async () => {
                try {
                    const secureScrapingInstance = await secureScrapingPromise;
                    const { data } = await secureScrapingInstance.secureGet(url,headers);
                    console.log(`Dati ricevuti per busStop ${busStopId}:`, data);
                    await admin.database().ref(`busData/stop_${busStopId}`).set(data);
                } catch (error) {
                    console.error(`Errore nella richiesta per busStop ${busStopId}:`, error.message);
                }
            };

            const delayTime = Math.floor(Math.random() * 5) * 1000;
            // Attendi un ritardo casuale e poi esegui func, assicurandoti di risolvere la promise
            await SecureScraping.delay(func,delayTime);

            console.log(`${busStopId} inserted`);
        }
    } catch (error) {
        console.error('Error saving Bus Data on firebase:', error);
    }
}

async function saveBoatDataToFirebase() {
    try {
        const date = new Date().toISOString().split('T')[0];
        const listBoatStopsIds = ['5029','5028','5027','5104','5112','5030','5031'];

        for (const boatStopId of listBoatStopsIds) {
            const url = `https://orari.actv.it/getStopSingle/${date}/NAV/${boatStopId}`;
            const headers = {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-GB,en;q=0.9",
                "Connection": "keep-alive",
                "Host": "orari.actv.it",
                "Referer": "https://orari.actv.it",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "User-Agent": ""
            };

            // Definisci la funzione che effettua la richiesta
            const func = async () => {
                try {
                    const secureScrapingInstance = await secureScrapingPromise;
                    const { data } = await secureScrapingInstance.secureGet(url,headers);
                    console.log(`Dati ricevuti per boatStop ${boatStopId}:`, data);
                    await admin.database().ref(`boatData/stop_${boatStopId}`).set(data);
                } catch (error) {
                    console.error(`Errore nella richiesta per boatStop ${boatStopId}:`, error.message);
                }
            };

            const delayTime = Math.floor(Math.random() * 10) * 1000;
            // Attendi un ritardo casuale e poi esegui func, assicurandoti di risolvere la promise
            await SecureScraping.delay(func,delayTime);

            console.log(`${boatStopId} inserted`);
        }
    } catch (error) {
        console.error('Error saving Boat Data on firebase:', error);
    }
}




module.exports = {
    savePopulationDataToFirebase,
    saveTideDataToFirebase,
    saveBusDataToFirebase,
    saveBoatDataToFirebase,
    fetchTideData,
    scrapePopulationData,
    scrapeVeniceTrainsTimeData,
};