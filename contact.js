import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { firebaseConfig } from "./firebaseConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const form = document.getElementById("pickupForm");
const successMessage = document.getElementById("successMessage");

const allowedLocations = [
  "HITEC City", "Gachibowli", "Madhapur", "Jubilee Hills", "Banjara Hills",
  "Kukatpally", "Miyapur", "Serilingampally", "Manikonda", "Nanakramguda",
  "Tolichowki", "Kompally"
];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const location = document.getElementById("location").value;
  const weight = document.getElementById("weight").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  const selectedMaterials = Array.from(
    document.querySelectorAll('input[name="material"]:checked')
  ).map((checkbox) => checkbox.value);

  // Validate location
  if (!allowedLocations.includes(location)) {
    alert("Pickup is not available in your area. Please choose a nearby location.");
    return;
  }

  // Validate time
  if (!time) {
    alert("Please select a valid time.");
    return;
  }

  const [hour, minute] = time.split(":").map(Number);
  if (isNaN(hour) || hour < 8 || hour >= 20) {
    alert("Pickup time must be between 8:00 AM and 8:00 PM.");
    return;
  }

  const formattedTime = new Date(`1970-01-01T${time}:00`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  try {
    await addDoc(collection(db, "pickupRequests"), {
      name,
      email,
      phone,
      location,
      selectedMaterials,
      weight: parseFloat(weight),
      preferredDate: date,
      preferredTime: formattedTime,
      timestamp: Timestamp.now(),
    });

    successMessage.textContent = "Pickup request submitted successfully!";
    successMessage.style.display = "block";
    form.reset();
  } catch (error) {
    console.error("Error submitting request:", error);
    alert("An error occurred while submitting your request. Please try again.");
  }
});
