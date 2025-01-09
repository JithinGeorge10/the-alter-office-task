import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import 'firebase/storage'


const firebaseConfig = {
    apiKey: "AIzaSyDncy670EUYNpOPnuKXDCL-xtF-o2h2R3E",
    authDomain: "fir-db3bd.firebaseapp.com",
    projectId: "fir-db3bd",
    storageBucket: "fir-db3bd.firebasestorage.app",
    messagingSenderId: "887162102490",
    appId: "1:887162102490:web:25c3b46f0fdabff47afbe3",
    measurementId: "G-1TFZDP10FH"
  };

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth



