const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.DATABASE_URL,
    });
}

const {
    deleteExistingData,
    scrapePopulationData,
    savePopulationDataToFirebase,
    fetchTideData,
    saveTideDataToFirebase
} = require('./functions');

async function handler(req, res) {
    try {
        console.log('Crono job started...');

        await deleteExistingData("dashboard/data/VenicePopulation");
        await deleteExistingData("dashboard/data/Tides");

        const populationData = await scrapePopulationData('https://portale.comune.venezia.it/millefoglie/statistiche/scheda/QUARTIERE-POPOLA-2$1$--------');
        if (populationData) await savePopulationDataToFirebase(populationData);

        const tideData = await fetchTideData(45.4408, 12.3155);
        if (tideData) {
            const today = new Date();
            const startDate = today.toISOString().split('T')[0];
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const endDate = tomorrow.toISOString().split('T')[0];
            await saveTideDataToFirebase(tideData, startDate, endDate);
        }

        // Se viene passato un oggetto res (tipico di una chiamata HTTP), restituisce una risposta.
        if (res && typeof res.status === 'function') {
            res.status(200).json({ success: true });
        } else {
            // Altrimenti, stampa un messaggio di successo su console.
            console.log('Crono job completed successfully.');
        }
    } catch (error) {
        console.error('Error running crono job:', error);
        if (res && typeof res.status === 'function') {
            res.status(500).json({ error: "Cron job failed!" });
        }
    }
}

module.exports = handler;

// Se il file viene eseguito direttamente (con "node cron.js"), esegui la funzione automaticamente.
if (require.main === module) {
    // Oggetto dummy per req (eventualmente puoi aggiungere proprietà se serve)
    const req = {};

    // Oggetto dummy per res, che simula i metodi status e json e stampa l'output in console.
    const res = {
        status: function(code) {
            console.log('Response status:', code);
            return this;
        },
        json: function(data) {
            console.log('Response data:', data);
        }
    };

    // Invoca la funzione handler direttamente
    handler(req, res);
}
