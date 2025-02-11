const admin = require('firebase-admin');
const axios = require('axios');
const cheerio = require('cheerio');
const SecureScraping = require('./secure-scraping');
const secureScraping = new SecureScraping();
const dotenv = require('dotenv');
dotenv.config();

async function deleteExistingData(path) {
    try {
        await admin.database().ref(path).remove();
        console.log(`Dati esistenti eliminati correttamente da: ${path}`);
    } catch (error) {
        console.error(`Errore durante l'eliminazione dei dati da ${path}:`, error.message);
    }
}

async function scrapeVeniceTrainsTimeData(url){
    try{
        let allTrainsData = [];
        const singleTitleRow = {};

        const response = await secureScraping.secureGet(url)
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
        const { data } = await secureScraping.secureGet(url);

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
        await deleteExistingData('dashboard/data/VenicePopulation/');
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
        await deleteExistingData('dashboard/data/Tides/');
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

        await deleteExistingData('busData');
        for (const busStopId of listBusStopsIds) {
            const url = `https://orari.actv.it/getStopSingle/${date}/AUT/${busStopId}`;

            // Definisci la funzione che effettua la richiesta
            const func = async () => {
                try {
                    const { data } = await secureScraping.secureGet(url);
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

        await deleteExistingData('boatData');
        for (const boatStopId of listBoatStopsIds) {
            const url = `https://orari.actv.it/getStopSingle/${date}/NAV/${boatStopId}`;
            // Definisci la funzione che effettua la richiesta
            const func = async () => {
                try {
                    const { data } = await secureScraping.secureGet(url);
                    console.log(`Dati ricevuti per boatStop ${boatStopId}:`, data);
                    await admin.database().ref(`boatData/stop_${boatStopId}`).set(data);
                } catch (error) {
                    console.error(`Errore nella richiesta per boatStop ${boatStopId}:`, error.message);
                }
            };

            const delayTime = (Math.floor(Math.random() * 10 ) + 5) * 1000;
            // Attendi un ritardo casuale e poi esegui func, assicurandoti di risolvere la promise
            await SecureScraping.delay(func,delayTime);

            console.log(`${boatStopId} inserted`);
        }
    } catch (error) {
        console.error('Error saving Boat Data on firebase:', error);
    }
}


async function scrapeFlights(htmlData,isArrival) {
    try {
        const $ = cheerio.load(htmlData);

        // Estrae il contenuto del tag <script> che contiene "__NEXT_DATA__"
        const scriptText = $('script:contains("__NEXT_DATA__")').text().trim();
        if (!scriptText) {
            throw new Error("Impossibile trovare il tag <script> con __NEXT_DATA__");
        }

        // Trova la posizione del primo '{' e dell'ultimo '}'
        const firstCurly = scriptText.indexOf('{');
        const lastCurly = scriptText.lastIndexOf('};');
        if (firstCurly === -1 || lastCurly === -1) {
            throw new Error("Impossibile individuare i delimitatori JSON nella stringa");
        }

        // Estrae la sottostringa che va dalla prima '{' all'ultima '}'
        const jsonString = scriptText.substring(firstCurly, lastCurly + 1);
        const nextData = JSON.parse(jsonString);

        let date = nextData.props.initialState.flightTracker.route.header.date;
        let airportName = nextData.props.initialState.flightTracker.route.header.title;
        let appHostUrl = nextData.props.initialState.app.appHost;
        let flights = nextData.props.initialState.flightTracker.route.flights;

        return Object.values({
            date: date,
            airportName: airportName,
            appHostUrl: appHostUrl,
            flights: flights,
            isArrival: isArrival,
        });

    } catch (error) {
        console.error("Errore nello scraping:", error);
        throw error;
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
    scrapeFlights
};