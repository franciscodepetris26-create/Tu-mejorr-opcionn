// firebaseConfig.js
const firebaseConfig = {
  apiKey: "AIzaSyDsRX8iONMb11kwVww6cMYRctEbjB0EC9w",
  authDomain: "catalogo-pwa-ca5bc.firebaseapp.com",
  projectId: "catalogo-pwa-ca5bc",
  storageBucket: "catalogo-pwa-ca5bc.firebasestorage.app",
  messagingSenderId: "1076707936903",
  appId: "1:1076707936903:web:3043cf0acff9b494b64622",
  measurementId: "G-MZXZS2G1V1"
};

// Inicializar Firebase y Firestore
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

