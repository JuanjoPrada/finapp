import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyB1Ldt4hVZBkqn93I5bRn3QDFyPO-l3fpg",
    authDomain: "finapp-21fa0.firebaseapp.com",
    projectId: "finapp-21fa0",
    storageBucket: "finapp-21fa0.firebasestorage.app",
    messagingSenderId: "882910558285",
    appId: "1:882910558285:web:838e30b1b21c8ade2ec404",
    measurementId: "G-WLC3LXN06C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
