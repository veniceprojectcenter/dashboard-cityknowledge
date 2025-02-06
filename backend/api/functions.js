const admin = require('firebase-admin');
const axios = require('axios');
const cheerio = require('cheerio');
import { HttpsProxyAgent } from 'https-proxy-agent';


// Funzione per eliminare i dati esistenti in Firebase
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

        const {data} = await axios.get(url);
        const $ = cheerio.load(data);
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
async function scrapePopulationData(url) {
    try {
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

async function fetchbusData(){
    try{
        const date = new Date().toISOString().split('T')[0];
        const listProxies = await getUpdatedListProxies();  // Usa la funzione con retry
        await saveBusDataToFirebase(date, listProxies);
    }catch (error) {
        console.error('Errore fetching bus data:', error);
    }
}

async function saveBusDataToFirebase(date, listProxies) {
    try {
        const listBusStopsIds = ['503','501','505','506','507','508','509','510','511','512','6084','8044','514','515','516','517'];
        const listUserAgents = [
            'Mozilla/5.0 (Linux; Android 13; Pixel 6 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
            'Mozilla/5.0 (Linux; Android 11; TC57 Build/11-35-05.00-RG-U00-C120-HEL-04; wv) AppleWebKit/537.36 (KHTML, like Gecko) ' +
            'Version/4.0 Chrome/129.0.6668.102 Mobile Safari/537.36 (AirWatch Browser v24.08.1.437)',
            'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.2pre) Gecko/20070213 BonEcho/2.0.0.2pre',
            'Callpod Keeper for Android 1.0 (app 16.10.0.132801/13280101) Dalvik/2.1.0 (Linux; U; Android 14; Pixel 7a Build/AP2A.240905.003)'
        ];

        for (const busStopId of listBusStopsIds) {
            const url = `https://orari.actv.it/getStopSingle/${date}/AUT/${busStopId}`;
            // Ottieni un proxy casuale e un user agent casuale
            const proxyUrl = getRandomElement(listProxies);
            const userAgent = getRandomElement(listUserAgents);

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
                'User-Agent': userAgent,
            };

            const agent = new HttpsProxyAgent(new URL(proxyUrl));

            // Definisci la funzione che effettua la richiesta
            const func = async () => {
                try {
                    const { data } = await axios.get(url, { httpAgent: agent, headers });
                    console.log(`Dati ricevuti per busStop ${busStopId}:`, data);
                    await admin.database().ref(`busData/stop_${busStopId}`).set(data);
                } catch (error) {
                    console.error(`Errore nella richiesta per busStop ${busStopId}:`, error.message);
                }
            };

            // Attendi un ritardo casuale e poi esegui func, assicurandoti di risolvere la promise
            await new Promise((resolve) => {
                const delayTime = Math.floor(Math.random() * 5) * 1000;
                setTimeout(async () => {
                    await func();
                    resolve();
                    }, delayTime);
            });

            console.log(`${busStopId} inserted`);
        }
    } catch (error) {
        console.error('Error saving Bus Data on firebase:', error);
    }
}


async function getUpdatedListProxies(maxRetries = 20, retryInterval = 15000) {
    let attempts = 0;
    let proxies;

    while (attempts < maxRetries) {
        proxies = await getListProxies();
        if (proxies && proxies.length > 0) {
            console.log(`Lista proxy ottenuta dopo ${attempts + 1} tentativo/i.`);
            return proxies;
        } else {
            console.warn(`Tentativo ${attempts + 1} fallito: lista vuota. Riprovo fra ${retryInterval / 1000} secondi...`);
            await delay(retryInterval);  // Attende retryInterval millisecondi prima di riprovare
            attempts++;
        }
    }

    throw new Error(`Non sono riuscito ad ottenere una lista aggiornata di proxy dopo ${maxRetries} tentativi.`);
}

async function delay(func = (() => {}),ms) {
    return new Promise(resolve =>
        setTimeout(async()=> {
            await func();
            resolve();
        }, ms)
    );
}


async function getListProxies(){
    const url = 'https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/protocols/https/data.json';
    let listProxies = [];

    await axios.get(url,{ responseType:"json"}).then((response) => {
        let data = Object.values(response.data);
        data.forEach(element => {
            listProxies.push(element.proxy);
        });
    }).catch((error) => console.error("Error fetching proxies list",error));
    return listProxies;
}

function getRandomElement(list){
    if(list.length <= 0){
        throw new Error('No Element found');
    }
    let random = Math.floor(Math.random() * list.length);
    return list[random];
}


module.exports = {
    deleteExistingData,
    savePopulationDataToFirebase,
    saveTideDataToFirebase,
    fetchTideData,
    scrapeVeniceTrainsTimeData,
    scrapePopulationData,
    fetchbusData
};