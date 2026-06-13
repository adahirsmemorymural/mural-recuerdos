import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc 
} from "firebase/firestore";

import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

export {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  ref,
  uploadBytes,
  getDownloadURL
};
