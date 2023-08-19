import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  orderBy,
  serverTimestamp,
  getDocs,
  onSnapshot,
  deleteDoc,
  query,
  where,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxo5-XHqpsHoKoS4whmaOP3X7m-d435MA",
  authDomain: "mini-hackathon-saylani.firebaseapp.com",
  projectId: "mini-hackathon-saylani",
  storageBucket: "mini-hackathon-saylani.appspot.com",
  messagingSenderId: "640790917297",
  appId: "1:640790917297:web:864143513724e428ddb290"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  collection,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  signOut,
  doc,
  onSnapshot,
  onAuthStateChanged,
  deleteDoc,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  query,
  orderBy,
  serverTimestamp,
  auth,
  db,
  where,
  updateDoc,
  arrayRemove,
  arrayUnion,
};







