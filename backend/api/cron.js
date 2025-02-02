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

async function handler() {
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

        console.log('Crono job completed...');
    } catch (error) {
        console.log(error.message);
    }
}

handler();

