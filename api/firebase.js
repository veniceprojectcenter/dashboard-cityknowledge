const admin = require('firebase-admin');
const serviceAccount = require('../src/app/serviceAccountKey.json'); // Ensure correct path

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://cityknowledge.firebaseio.com/",
    });
}

module.exports = admin;
