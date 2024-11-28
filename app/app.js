'use strict';

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Configurazione di Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAsjGK7o4ohgZqxZah6JfvYrgEwJHMJQoA",
    authDomain: "cityknowledge.firebaseapp.com",
    databaseURL: "https://cityknowledge.firebaseio.com",
    projectId: "firebase-cityknowledge",
    storageBucket: "firebase-cityknowledge.firebasestorage.app",
    messagingSenderId: "445655714967",
    appId: "1:445655714967:web:8d41a1a45cef93ecaeadd2"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Definisci il modulo AngularJS
var placeDash = angular.module('placeDash', [
    'firebase',
    'gridster',
    'ui.bootstrap',
    'debounce',
    'ngRoute',
]);

placeDash.filter('unsafe', function($sce) {
    return $sce.trustAsHtml;
});
