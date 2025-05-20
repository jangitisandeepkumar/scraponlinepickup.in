// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase config (your Firebase project credentials)
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

// DOM element where history will be displayed
const historyList = document.getElementById("historyList");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    historyList.innerHTML = `<li>Loading your pickup history...</li>`;

    try {
      let identifier;
      let queryField;

      // If user logged in with phone number
      if (user.phoneNumber) {
        // Get user's phone number from Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          historyList.innerHTML = `<li>User data not found in Firestore.</li>`;
          return;
        }

        identifier = userSnap.data().phone;
        queryField = "phoneNumber";
      }
      // If user logged in with email
      else if (user.email) {
        identifier = user.email;
        queryField = "email";
      } else {
        historyList.innerHTML = `<li>Cannot identify your account method (email or phone).</li>`;
        return;
      }

      // Query pickupRequests based on identifier
      const pickupsRef = collection(db, "pickupRequests");
      const q = query(pickupsRef, where(queryField, "==", identifier));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        historyList.innerHTML = `<li>No pickup requests found.</li>`;
        return;
      }

      let total = 0;
      let pending = 0;
      historyList.innerHTML = ""; // Clear previous content

      snapshot.forEach((doc) => {
        const data = doc.data();
        total++;
        if (data.status === "pending") pending++;

        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <strong>Date:</strong> ${data.date || "N/A"} |
          <strong>Material:</strong> ${data.material || "N/A"} |
          <strong>Status:</strong>
          <span style="color: ${data.status === "pending" ? "red" : "green"};">${data.status}</span>
        `;
        historyList.appendChild(listItem);
      });

      // Display summary
      const summaryItem = document.createElement("li");
      summaryItem.innerHTML = `
        <strong>Total Requests:</strong> ${total} |
        <strong>Pending:</strong> ${pending}
      `;
      summaryItem.style.fontWeight = "bold";
      summaryItem.style.marginBottom = "20px";
      historyList.prepend(summaryItem);

    } catch (err) {
      console.error("Error loading pickup history:", err);
      historyList.innerHTML = `<li>Error loading your pickup history. Please try again later.</li>`;
    }

  } else {
    historyList.innerHTML = `<li>Please log in to view your pickup history.</li>`;
  }
});
