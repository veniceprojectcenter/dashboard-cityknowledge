// api.js
const express = require('express');
const admin = require('firebase-admin');


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
    const data = snapshot.val();
    res.json({success:true, data:data});
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    res.status(500).json({ error: 'Errore durante il recupero dei dati' });
  }
});
// Endpoint per recuperare i dati delle maree da Firebase
router.get('/api/tides', async (req, res) => {
  try {
    const snapshot = await admin.database()
                                              .ref('dashboard/data/Tides')
                                               .once('value');
    const data = snapshot.val();

    if (data) {
      res.json({ success: true, tides: data });
    } else {
      res.status(404).json({ success: false, message: 'Nessun dato trovato.' });
    }
  } catch (error) {
    console.error('Errore durante il recupero dei dati delle maree:', error);
    res.status(500).json({ success: false, message: 'Errore durante il recupero dei dati.' });
  }
});



// Esporta il router
module.exports = router;