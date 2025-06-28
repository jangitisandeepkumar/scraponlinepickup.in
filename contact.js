import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { firebaseConfig } from "./firebaseConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const form = document.getElementById("pickupForm");
const successMessage = document.getElementById("successMessage");

// 🚫 Hide the form until we verify the user
form.style.display = "none";

const allowedLocations = [
  "HITEC City", "Gachibowli", "Madhapur", "Jubilee Hills", "Banjara Hills",
  "Kukatpally", "Miyapur", "Serilingampally", "Manikonda", "Nanakramguda",
  "Tolichowki", "Kompally"
];

// ✅ Check if user is logged in and fetch Firestore user info
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Not logged in → redirect to login page
    window.location.href = `login.html?redirect=contact.html`;
  } else {
    // Show form
    form.style.display = "block";

    // Pre-fill email field
    document.getElementById("email").value = user.email || "";

    // Optional: Fetch name & phone from Firestore (if stored)
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        document.getElementById("name").value = data.name || "";
        document.getElementById("phone").value = data.phone || "";
      }
    } catch (error) {
      console.warn("Could not fetch user data from Firestore:", error);
    }
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to submit a request.");
    return;
  }

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

  if (!allowedLocations.includes(location)) {
    alert("Pickup is not available in your area. Please choose a nearby location.");
    return;
  }

  if (!time) {
    alert("Please select a valid pickup time.");
    return;
  }

  const [hour] = time.split(":").map(Number);
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
      uid: user.uid
    });

    successMessage.textContent = "Pickup request submitted successfully!";
    successMessage.style.display = "block";
    form.reset();
  } catch (error) {
    console.error("Error submitting request:", error);
    alert("An error occurred while submitting your request. Please try again.");
  }
});

