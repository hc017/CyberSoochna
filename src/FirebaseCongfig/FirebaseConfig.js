// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import  {getDatabase} from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyD5kgkbKhHVVa9MmJwpD7zNZP5p-T-Huxw",
  authDomain: "cybersoochna-ec4e6.firebaseapp.com",
  databaseURL: "https://cybersoochna-ec4e6-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "cybersoochna-ec4e6",
  storageBucket: "cybersoochna-ec4e6.appspot.com",
  messagingSenderId: "370994734512",
  appId: "1:370994734512:web:3e82c1a31746693779e275",
  measurementId: "G-STG4B5C20Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const  database = getDatabase()