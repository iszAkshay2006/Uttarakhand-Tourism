// js/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBcO2I9pN0cgzbj97zEt9bRUHcnjlPD7AI",
  authDomain: "uttarakhand-explorer-9551d.firebaseapp.com",
  projectId: "uttarakhand-explorer-9551d",
  storageBucket: "uttarakhand-explorer-9551d.firebasestorage.app",
  messagingSenderId: "1001122541127",
  appId: "1:1001122541127:web:ca5186aef8814a8d490b62",
  measurementId: "G-NP2WBWN4YX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export let analytics = null;

isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  })
  .catch((error) => {
    console.warn("Firebase Analytics unavailable:", error);
  });

export default app;
