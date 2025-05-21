// Firebase v9 Modular SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCA-v0X9OzsToVlNHYBd1WRrOi01CWotVY",
  authDomain: "login-51a65.firebaseapp.com",
  projectId: "login-51a65",
  storageBucket: "login-51a65.appspot.com",
  messagingSenderId: "1051725155986",
  appId: "1:1051725155986:web:31ab5d15f993e9eee0e04b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Show Greeting Based on Auth State
const greetingEl = document.getElementById("userGreeting");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const name = docSnap.data().name || "User";
        greetingEl.textContent = `Welcome, ${name}`;
      } else {
        greetingEl.textContent = "Welcome, User";
      }
    } catch (err) {
      console.error("Error getting user info:", err);
      greetingEl.textContent = "Welcome, User";
    }
  } else {
    greetingEl.textContent = "Welcome, Guest";
  }
});

// Hamburger Menu (Redirect to profile)
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger-menu");
  hamburger.addEventListener("click", () => {
    window.location.href = "pro.html";
  });
});
