const admin = require('firebase-admin');
const axios = require('axios');
const cheerio = require('cheerio');

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

module.exports = {
    scrapePopulationData,
    savePopulationDataToFirebase,
    fetchTideData,
    saveTideDataToFirebase,
    deleteExistingData,
    scrapeVeniceTrainsTimeData
};