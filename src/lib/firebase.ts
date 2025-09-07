import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "zenbiz-n1t50",
  appId: "1:1035711621891:web:d53fe38340637740cdd736",
  storageBucket: "zenbiz-n1t50.firebasestorage.app",
  apiKey: "AIzaSyDG4x6cv3EsnnAiOcGhF7nU0anq43hMG2M",
  authDomain: "zenbiz-n1t50.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "1035711621891"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
