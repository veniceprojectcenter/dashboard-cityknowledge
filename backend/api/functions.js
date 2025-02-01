const admin = require('firebase-admin');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const unzipper = require('unzipper');
const FILES_TO_EXTRACT = ["calendar.txt", "calendar_dates.txt", "routes.txt", "stop_times.txt", "trips.txt"];


async function downloadFile(url, zipPathToStore) {
    return new Promise((resolve, reject) => {
        console.log("📥 Scaricamento ZIP...");

        const zip = fs.createWriteStream(zipPathToStore);

        axios.get(url, { responseType: 'stream' })
            .then(response => {
                response.data.pipe(zip);
                zip.on('finish', () => {
                    zip.close(() => {
                        console.log("✅ Download completato!");
                        resolve();
                    });
                });
            })
            .catch(error => {
                fs.unlink(zipPathToStore, () => {}); // Elimina il file se il download fallisce
                reject(new Error(`❌ Errore nel download: ${error.message}`));
            });
    });
}

async function extractFiles(zipPath, extractPath) {
    return new Promise((resolve, reject) => {
        console.log("📂 Estrazione file...");

        fs.createReadStream(zipPath)
            .pipe(unzipper.Extract({ path: extractPath }))
            .on('close', () => {
                console.log("✅ Estrazione completata!");
                resolve();
            })
            .on('error', err => reject(new Error(`❌ Errore nell'estrazione: ${err.message}`)));
    });
}

async function getBusData() {
    try {
        const url = "https://actv.avmspa.it/sites/default/files/attachments/opendata/automobilistico/actv_aut.zip";
        const zipPath = "./api/downloads/data.zip";
        const extractPath = "./api/downloads";

        // 📂 Crea la cartella dentro `api/` se non esiste
        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath, { recursive: true });
        }

        await downloadFile(url, zipPath);
        await extractFiles(zipPath, extractPath);

        console.log("🚀 File GTFS scaricati ed estratti con successo!");
    } catch (error) {
        console.error(`❌ Errore: ${error.message}`);
    }
}

function txtToJson(filePath, batchSize = 500) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n').filter(line => line.trim()); // Rimuove righe vuote
    const headers = lines[0].trim().split(','); // Headers (prima riga)
    const dataRows = lines.slice(1); // Tutti i dati, escludendo gli headers

    let jsonData = {}; // Oggetto JSON finale

    // Suddividere in batch più piccoli
    for (let i = 0; i < dataRows.length; i += batchSize) {
        const batch = dataRows.slice(i, i + batchSize);
        const batchKey = `batch_${i / batchSize + 1}`; // Nome del nodo (batch_1, batch_2, ...)

        jsonData[batchKey] = batch.map(line => {
            const values = line.split(',');
            return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
        });
    }

    return JSON.stringify(jsonData, null, 4);
}


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
        const {data} = await axios.get(url);
        const $ = cheerio.load(data);
        let allTrainsData = [];
        let listTitleRow = $('thead[id=headerTabId] tr');
        const singleTitleRow = {};
        listTitleRow.find('th').each((i,row)=>{
            const id = $(row).attr('id');
            singleTitleRow[id] = $(row).text().trim();
        });
        allTrainsData.push(singleTitleRow);

        let listRows = $('tbody[id=bodyTabId] tr');
        // Versione corretta:
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
                Authorization: process.env.TIDEAPI_KEY, // Sostituisci con la tua chiave API
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

function processFileToBatches(filePath, batchSize = 30, applyFilter = false) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split(/\r?\n/).filter(line => line.trim());

        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim());
        const dataRows = lines.slice(1);

        const batches = [];
        let currentBatch = [];

        dataRows.forEach(line => {
            const values = line.split(',').map(v => v.trim());
            const entry = headers.reduce((obj, header, idx) => {
                obj[header] = values[idx] || null;
                return obj;
            }, {});

            // Applica il filtro solo se richiesto (es. per stop_times)
            if (applyFilter) {
                const headsign = entry.stop_headsign?.toUpperCase();
                if (headsign === "VENEZIA") {
                    currentBatch.push(entry);
                }
            } else {
                currentBatch.push(entry);
            }

            if (currentBatch.length >= batchSize) {
                batches.push([...currentBatch]);
                currentBatch = [];
            }
        });

        if (currentBatch.length > 0) batches.push(currentBatch);
        return batches;

    } catch (error) {
        console.error(`Errore durante l'elaborazione di ${filePath}:`, error);
        return [];
    }
}

/**
 * Funzione principale per salvare i dati dei bus su Firebase con misurazione del tempo.
 */
async function saveBusDataToFirebase() {
    try {
        console.time("Tempo Totale di Elaborazione");

        // Elimina i dati esistenti
        await deleteExistingData("dashboard/data/Bus");

        // Processa ogni file
        for (const item of FILES_TO_EXTRACT) {
            const startTimeFile = Date.now();
            const itemName = item.split('.')[0];
            const basePath = `dashboard/data/Bus/${itemName}`;

            console.log(`Processing ${item}...`);

            // Configurazione speciale per stop_times
            const isStopTimes = item === "stop_times.txt";
            const batchSize = isStopTimes ? 5000 : 100;

            try {
                const batches = processFileToBatches(
                    `./api/downloads/${item}`,
                    batchSize,
                    isStopTimes // Passa il flag per il filtro
                );

                console.log(`Generated ${batches.length} batches per ${item}`);

                for (let i = 0; i < batches.length; i++) {
                    const batchPath = `${basePath}/batch_${i}`;
                    await admin.database().ref(batchPath).set({
                        data: batches[i],
                    });
                }

                const elapsedTimeFile = Date.now() - startTimeFile;
                console.log(`✅ Completed ${item} in ${elapsedTimeFile} ms`);

            } catch (error) {
                console.error(`❌ Error processing ${item}:`, error.message);
            }
        }
        console.timeEnd("Tempo Totale di Elaborazione");
    } catch (error) {
        console.error('Global error:', error);
    }
}



module.exports = {
    deleteExistingData,
    savePopulationDataToFirebase,
    saveTideDataToFirebase,
    saveBusDataToFirebase,
    fetchTideData,
    scrapeVeniceTrainsTimeData,
    scrapePopulationData,
};