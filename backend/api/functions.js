const admin = require('firebase-admin');
const axios = require('axios');
const cheerio = require('cheerio');
const secureScraping = require('./secure-scraping');
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

async function scrapeVeniceAirQualityData(){
    const lat = 45.437191; // Latitudine di Venezia
    const lng = 12.334590; // Longitudine di Venezia

    // Nuovo URL per l'API Open-Meteo
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}`
        +`&hourly=pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index,ammonia,methane`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log('Error fetching Venice air Quality data',error);
    }
}

async function saveVeniceAirDataToFirebase(data){
    try{
        const date = new Date().toISOString().split('T')[0];
        await deleteExistingData('dashboard/data/VeniceAir');
        await admin.database().ref(`dashboard/data/VeniceAir/${date}/`).set({
            data: data
        });
        console.log(`Dati di qualità aria Venezia salvati correttamente in Firebase`);
    }catch(error){
        console.error(`Errore l'eliminazione dei da ${data}`);
    }
}


async function scrapeVeniceTourismData() {
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
        return tourismData;
    } catch (error) {
            console.error(`Errore durante il recupero dei dati turismo: ${error}`);
    }
}

async function saveVeniceTourismDataToFirebase(data) {
    try{
        const date = new Date().toISOString().split('T')[0];
        await deleteExistingData('dashboard/data/Tourism');
        await admin.database().ref(`dashboard/data/Tourism/${date}/`).set({
            data: data
        });
        console.log(`Dati di turismo Venezia salvati correttamente in Firebase`);
    }catch (error) {
        console.error("Error storing Venice tourism data to Firebase");
    }
}

async function scrapeVeniceTrainsTimeData(url){
    try{
        let allTrainsData = [];
        const singleTitleRow = {};

        const response = await axios.get(url);
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
        const { data } = await axios.get(url);

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
    } catch (error) {
        console.error('Errore durante il salvataggio dei dati delle maree in Firebase:', error.message);
    }
}

async function saveBusDataToFirebase() {
    try {
        const date = new Date().toISOString().split('T')[0];
        // Lista di stop per gli autobus (ad es. cluster di fermate vicine)
        const listBusStopsIds = ['503','501','505','506','507','508','509','510','511','512','6084','8044','514','515','516','517'];
        const allBusData = [];

        // Funzione per convertire "HH:MM:SS" in secondi dall'inizio della giornata
        function timeStringToSeconds(timeStr) {
            if (!timeStr || timeStr === "Undefined") return 0;
            const [hh, mm, ss] = timeStr.split(':').map(Number);
            return hh * 3600 + mm * 60 + ss;
        }

        // Funzione per recuperare i dati di una singola fermata per gli autobus
        async function fetchBusStopData(busStopId) {
            try {
                const url = `https://orari.actv.it/getStopSingle/${date}/AUT/${busStopId}`;
                const { data } = await secureScraping.secureGet(url);
                const busData = data[0];

                if (busData && busData.lines) {
                    busData.lines.forEach((line) => {
                        if (line && line.stopTimes) {
                            line.stopTimes.forEach(stopTime => {
                                if (stopTime && stopTime.sTimeDeparture && stopTime.sTimeDeparture !== "Undefined") {
                                    const departureTimestamp = timeStringToSeconds(stopTime.sTimeDeparture);
                                    // Crea il record normalizzato
                                    allBusData.push({
                                        stopId: busStopId,
                                        lineName: line.lineName || null,
                                        linePath: line.linePath || null,
                                        sTimeDeparture: stopTime.sTimeDeparture,
                                        departureTimestamp: departureTimestamp,
                                        sNameNext: stopTime.sNameNext || null,
                                        sTimeNext: stopTime.sTimeNext || null,
                                        sNameTerminal: stopTime.sNameTerminal || null,
                                        sTimeTerminal: stopTime.sTimeTerminal || null
                                    });
                                }
                            });
                        }
                    });
                }
            } catch (error) {
                console.error(`Errore nella richiesta per busStop ${busStopId}:`, error.message);
            }
        }

        // Esegui le richieste in batch (ad esempio, 4 alla volta con 10 secondi di attesa tra i batch)
        await secureScraping.processInBatches(listBusStopsIds, fetchBusStopData, 4, 10000);


        if (allBusData.length > 0) {
            await deleteExistingData('busData/');
            const busDataRef = admin.database().ref("busData");


            const promises = allBusData.map(record => {
                return busDataRef.push(record);
            });
            await Promise.all(promises);

            console.log(`Dati autobus salvati correttamente con ${allBusData.length} record.`);
        } else {
            console.warn('Nessun nuovo dato autobus trovato.');
        }
    } catch (error) {
        console.error('Errore nel salvataggio dei dati autobus su Firebase:', error);
    }
}


async function saveBoatDataToFirebase() {
    try {
        const date = new Date().toISOString().split('T')[0];
        const listBoatStopsIds = ['5029', '5028', '5027', '5104', '5112', '5030', '5031'];
        const allBoatData = [];

        // Converte "HH:MM:SS" in secondi dall'inizio della giornata
        function timeStringToSeconds(timeStr) {
            if (!timeStr || timeStr === "Undefined") return 0;
            const [hh, mm, ss] = timeStr.split(':').map(Number);
            return hh * 3600 + mm * 60 + ss;
        }

        // Recupera i dati per una singola fermata
        async function fetchBoatStopData(boatStopId) {
            try {
                const url = `https://orari.actv.it/getStopSingle/${date}/NAV/${boatStopId}`;
                const { data } = await secureScraping.secureGet(url);
                const boatData = data[0];

                if (boatData && boatData.lines) {
                    boatData.lines.forEach((line) => {
                        if (line && line.stopTimes) {
                            line.stopTimes.forEach(stopTime => {
                                if (stopTime && stopTime.sTimeDeparture && stopTime.sTimeDeparture !== "Undefined") {
                                    const departureTimestamp = timeStringToSeconds(stopTime.sTimeDeparture);
                                    allBoatData.push({
                                        stopId: boatStopId,
                                        lineName: line.lineName || null,
                                        linePath: line.linePath || null,
                                        sTimeDeparture: stopTime.sTimeDeparture,
                                        departureTimestamp: departureTimestamp,
                                        sNameNext: stopTime.sNameNext || null,
                                        sTimeNext: stopTime.sTimeNext || null,
                                        sNameTerminal: stopTime.sNameTerminal || null,
                                        sTimeTerminal: stopTime.sTimeTerminal || null
                                    });
                                }
                            });
                        }
                    });
                }
            } catch (error) {
                console.error(`Errore nella richiesta per boatStop ${boatStopId}:`, error.message);
            }
        }

        // Processa le richieste in batch (ad esempio, 4 alla volta con 10 secondi di attesa tra i batch)
        await secureScraping.processInBatches(listBoatStopsIds, fetchBoatStopData, 4, 10000);

        if (allBoatData.length > 0) {
            // Cancella i dati esistenti
            await deleteExistingData('boatData/');

            // Per ogni record, inserisci il record sotto il nodo corrispondente al suo departureTimestamp
            const promises = allBoatData.map(record => {
                // Usa record.departureTimestamp come chiave principale (convertito in stringa)
                const ref = admin.database().ref("boatData")
                // Qui usiamo push() per aggiungere il record all'interno di quel nodo,
                // permettendo di avere più record sotto lo stesso timestamp
                return ref.push(record);
            });
            await Promise.all(promises);
            console.log(`Dati vaporetti salvati correttamente con ${allBoatData.length} record.`);
        } else {
            console.warn('Nessun nuovo dato vaporetti trovato.');
        }
    } catch (error) {
        console.error('Errore nel salvataggio dei dati vaporetti su Firebase:', error);
    }
}

async function scrapeFlights(htmlData,isArrival) {
    try {
        const $ = cheerio.load(htmlData);


        const scriptText = $('script:contains("__NEXT_DATA__")').text().trim();
        if (!scriptText) {
            throw new Error("Impossibile trovare il tag <script> con __NEXT_DATA__");
        }

        const firstCurly = scriptText.indexOf('{');
        const lastCurly = scriptText.lastIndexOf('};');
        if (firstCurly === -1 || lastCurly === -1) {
            throw new Error("Impossibile individuare i delimitatori JSON nella stringa");
        }

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
    saveVeniceTourismDataToFirebase,
    saveVeniceAirDataToFirebase,
    fetchTideData,
    scrapePopulationData,
    scrapeVeniceTrainsTimeData,
    scrapeFlights,
    scrapeVeniceTourismData,
    scrapeVeniceAirQualityData,

};