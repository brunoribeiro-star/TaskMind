import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBKP417V1SV6KyORsBH6NFILc5ng0tJQA0",
    authDomain: "task-mind.firebaseapp.com",
    projectId: "task-mind",
    storageBucket: "task-mind.appspot.com",
    messagingSenderId: "1070694643296",
    appId: "1:1070694643296:web:0c061794470b1175343505"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore (app);
  const auth = getAuth (app);
  
  export {db, auth};