// Import Firebase modules (version 11.5.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Firebase config
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
const db = getFirestore(app);
const auth = getAuth(app);

// DOM elements
const form = document.getElementById("pickupForm");
const errorMessage = document.getElementById("errorMessage");
const loginReminderBox = document.getElementById("loginReminderBox");
const goToLoginBtn = document.getElementById("goToLoginBtn");
const submitBtn = form.querySelector('button[type="submit"]');
const pickupCard = document.getElementById("pickupCard");
const truckWrap = document.getElementById("truckWrap");
const wheelL = document.getElementById("wheelL");
const wheelR = document.getElementById("wheelR");
const boxEl = document.getElementById("boxEl");
const badgeEl = document.getElementById("badgeEl");
const scrapPath = document.getElementById("scrapPath");
const statusText = document.getElementById("statusText");
const liveRegion = document.getElementById("liveRegion");
const darkModeToggle = document.getElementById("darkModeToggle");
const closePickup = document.getElementById("closePickup");
const dateInput = document.getElementById("date");

let currentUser = null;

// Date limits
const today = new Date();
today.setHours(0, 0, 0, 0);
const maxDate = new Date(today);
maxDate.setDate(today.getDate() + 30);
dateInput.min = today.toISOString().split("T")[0];
dateInput.max = maxDate.toISOString().split("T")[0];

// Dark mode toggle
const isDarkMode = localStorage.getItem("darkMode") === "enabled";
if (isDarkMode) {
  document.body.classList.add("dark-mode");
  darkModeToggle.setAttribute("aria-label", "Switch to light mode");
  darkModeToggle.textContent = "☀️";
}
darkModeToggle.addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", dark ? "enabled" : "disabled");
  darkModeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  darkModeToggle.textContent = dark ? "☀️" : "🌙";
});

// Auth state listener
onAuthStateChanged(auth, (user) => {
  currentUser = user || null;
  if (user) {
    loginReminderBox.style.display = "none";
    form.style.display = "block";
    submitBtn.disabled = false;
  } else {
    loginReminderBox.style.display = "block";
    form.style.display = "none";
    pickupCard.style.display = "none";
    submitBtn.disabled = true;
  }
});

// Go to login
goToLoginBtn.addEventListener("click", () => {
  window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
});

// Close pickup
closePickup.addEventListener("click", () => {
  pickupCard.style.display = "none";
  form.style.display = "block";
  resetScene();
});

// Allowed locations
const allowedLocations = [
  "HITEC City", "Gachibowli", "Madhapur", "Jubilee Hills", "Banjara Hills",
  "Kukatpally", "Miyapur", "Serilingampally", "Manikonda", "Nanakramguda",
  "Tolichowki", "Kompally", "LB Nagar", "Suryapet", "Medchal"
];

// Animations
function launchConfetti() {
  for (let i = 0; i < 30; i++) {
    const conf = document.createElement('div');
    conf.style.position = 'fixed';
    conf.style.left = `${Math.random() * 100}vw`;
    conf.style.top = '-10px';
    conf.style.width = '8px';
    conf.style.height = '8px';
    conf.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
    conf.style.opacity = 0.9;
    conf.style.transform = `rotate(${Math.random() * 360}deg)`;
    conf.style.borderRadius = '2px';
    conf.style.pointerEvents = 'none';
    document.body.appendChild(conf);

    const fall = conf.animate([
      { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
      { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0.8 }
    ], { duration: 2000 + Math.random() * 1000, easing: 'ease-out' });

    fall.onfinish = () => conf.remove();
  }
}

function resetScene() {
  truckWrap.classList.remove('arrived');
  wheelL.classList.remove('spin');
  wheelR.classList.remove('spin');
  boxEl.classList.remove('show');
  badgeEl.classList.remove('show');
  scrapPath.classList.remove('draw');
  statusText.textContent = 'Waiting for pickup';
  liveRegion.textContent = '';
}

function showPickup() {
  resetScene();
  statusText.textContent = 'Truck is on the way…';
  wheelL.classList.add('spin');
  wheelR.classList.add('spin');

  setTimeout(() => truckWrap.classList.add('arrived'), 120);
  setTimeout(() => {
    wheelL.classList.remove('spin');
    wheelR.classList.remove('spin');
    boxEl.classList.add('show');
    statusText.textContent = 'Items collected';
  }, 1200);
  setTimeout(() => {
    badgeEl.classList.add('show');
    scrapPath.classList.add('draw');
    statusText.textContent = 'Recycle pickup complete';
    launchConfetti();
  }, 1600);
}

// Form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const location = document.getElementById("location").value;
  const scrapSource = document.getElementById("scrapSource").value;
  const weight = parseFloat(document.getElementById("weight").value.trim());
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  const selectedMaterials = Array.from(
    document.querySelectorAll('input[name="material"]:checked')
  ).map(cb => cb.value);

  // Validation
  if (!selectedMaterials.length) return showError("Please select at least one scrap material.");
  if (!allowedLocations.includes(location)) return showError("Pickup is not available in your area.");
  if (!scrapSource) return showError("Please select the source of your scrap material.");
  if (!/^\d{10}$/.test(phone)) return showError("Please enter a valid 10-digit phone number.");
  if (weight < 55 || weight > 1000) return showError("Weight must be between 55 and 1000 kg.");
  if (new Date(date) < today || new Date(date) > maxDate) return showError("Date must be within the next 30 days.");
  const [hour] = time.split(":").map(Number);
  if (hour < 8 || hour >= 20) return showError("Pickup time must be between 8 AM and 8 PM.");

  try {
    await addDoc(collection(db, "pickupRequests"), {
      uid: currentUser.uid,
      name, email, phone, location, scrapSource,
      selectedMaterials, weight,
      preferredDate: date,
      preferredTime: new Date(`1970-01-01T${time}:00`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
      timestamp: Timestamp.now()
    });
    form.style.display = "none";
    pickupCard.style.display = "block";
    showPickup();
  } catch (err) {
    console.error(err);
    showError("Something went wrong. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Request";
  }
});

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.style.display = "block";
  setTimeout(() => errorMessage.style.display = "none", 5000);
  submitBtn.disabled = false;
  submitBtn.textContent = "Submit Request";
}

// Init
resetScene();
