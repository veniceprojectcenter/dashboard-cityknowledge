const axios = require('axios');
const cheerio = require('cheerio');

async function scrape() {
  // Ottieni l'anno corrente e sottrai 1 per ottenere l'anno precedente
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  // Crea l'URL dinamico usando l'anno precedente
  const url = `https://statistica.regione.veneto.it/jsp/turi1.jsp?D0=${previousYear}&D1=REGIONE+VENETO&D2=00Totale+anno&D3=Movimento+annuale+per+tipo+di+esercizio&B1=Visualizza`;

  try {
    // Fai la richiesta HTTP alla pagina
    const { data } = await axios.get(url);

    // Carica la risposta HTML in Cheerio
    const $ = cheerio.load(data);

    // Seleziona il secondo table (indice 1)
    const table = $('table').eq(1);  // eq(1) per selezionare il secondo table

    // Estrai la descrizione, gli arrivi e le presenze
    const result = [];
    table.find('tr').each((i, row) => {
      const cells = $(row).find('td').map((i, cell) => $(cell).text().trim()).get();

      // Aggiungi solo le righe che contengono almeno una cella (evita righe vuote)
      if (cells.length > 0) {
        const description = cells[0];  // Descrizione (prima colonna)
        const arrivi = cells[cells.length - 2];  // Penultimo valore (arrivi)
        const presenze = cells[cells.length - 1];  // Ultimo valore (presenze)

        // Aggiungi il risultato all'array
        result.push({
          description,
          arrivi,
          presenze
        });
      }
    });

    // Mostra il risultato
    console.log(result);

  } catch (error) {
    console.error('Errore nel fare scraping della pagina:', error);
  }
}

scrape();
