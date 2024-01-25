// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2pyNVbdokPQ4v-g-BU2Kqx3sVWOaAeZA",
  authDomain: "animania-88956.firebaseapp.com",
  projectId: "animania-88956",
  storageBucket: "animania-88956.appspot.com",
  messagingSenderId: "1023761754772",
  appId: "1:1023761754772:web:4ab51a98f0b73d3767e281"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)