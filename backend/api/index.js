require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const apiRoutes = require('./api');
const serviceAccount = require("./serviceAccountKey.json");


const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'OPTION'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});


const app = express();
// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Usa le rotte API

app.use('/', apiRoutes);


// Avvio del api
module.exports = app;
