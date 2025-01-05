#!/bin/bash

# Esegui il build del progetto Angular in produzione
echo "Building Angular project in production mode..."
ng build --configuration=production

# Avvia il server Node.js per servire i file generati
echo "Starting Node.js server..."
node src/app/server.js &

# Avvia ng serve in modalità produzione (questa è una configurazione di sviluppo che usa il server di Angular)
echo "Starting Angular server in production mode (ng serve)..."
ng serve --configuration=production &

# Salva il PID del server Angular
NG_PID=$!

# Funzione per fermare i server (Angular e Node.js)
cleanup() {
  echo "Stopping Node.js server..."
  kill $NODE_PID
  echo "Stopping Angular server..."
  kill $NG_PID
  exit 0
}

# Cattura il segnale di interruzione (CTRL+C) e chiama cleanup
trap cleanup INT

# Attendi entrambi i server
wait
