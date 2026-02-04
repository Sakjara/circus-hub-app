import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  projectId: "studio-9387410497-72979",
  appId: "1:621670362131:web:1f2accfa7cfb528c60a3e6",
  apiKey: "AIzaSyDyy7Zwv0zQHEn3bW3dM1A-H68bovG_Khw",
  authDomain: "studio-9387410497-72979.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "621670362131"
};

// Initialize Firebase
let firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebaseApp;
