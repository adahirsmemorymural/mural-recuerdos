// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  getStorage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHwHssU3NWZHA1cfB5ymYaHI4oYCgKnvk",
  authDomain: "mural-de-recuerdos.firebaseapp.com",
  projectId: "mural-de-recuerdos",
  storageBucket: "mural-de-recuerdos.firebasestorage.app",
  messagingSenderId: "497026178089",
  appId: "1:497026178089:web:58aa3e8f373ce8f8199038"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export {
  db,
  storage,
  auth,
  provider
};
