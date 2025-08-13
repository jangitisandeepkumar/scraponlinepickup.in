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


const firebaseConfig = {
  apiKey: "AIzaSyCA-v0X9OzsToVlNHYBd1WRrOi01CWotVY",
  authDomain: "login-51a65.firebaseapp.com",
  projectId: "login-51a65",
  storageBucket: "login-51a65.appspot.com",
  messagingSenderId: "1051725155986",
  appId: "1:1051725155986:web:31ab5d15f993e9eee0e04b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

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

const today = new Date();
today.setHours(0, 0, 0, 0);
const maxDate = new Date(today);
maxDate.setDate(today.getDate() + 30);
dateInput.min = today.toISOString().split("T")[0];
dateInput.max = maxDate.toISOString().split("T")[0];

const isDarkMode = localStorage.getItem("darkMode") === "enabled";
if (isDarkMode) {
  document.body.classList.add("dark-mode");
  darkModeToggle.setAttribute("aria-label", "Switch to light mode");
  darkModeToggle.textContent = "☀️";
}
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  darkModeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  darkModeToggle.textContent = isDark ? "☀️" : "🌙";
});


onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loginReminderBox.style.display = "none";
    form.style.display = "block";
    submitBtn.disabled = false;
    if (new URLSearchParams(window.location.search).get("login") === "success") {
      pickupCard.style.display = "block";
      form.style.display = "none";
      statusText.textContent = "Login successful! Schedule your pickup.";
      liveRegion.textContent = "Login successful. You can now schedule a pickup.";
      setTimeout(() => {
        pickupCard.style.display = "none";
        form.style.display = "block";
        resetScene();
      }, 3000);
    }
  } else {
    currentUser = null;
    loginReminderBox.style.display = "block";
    form.style.display = "none";
    pickupCard.style.display = "none";
    submitBtn.disabled = true;
  }
});

// Login button action
goToLoginBtn.addEventListener("click", () => {
  const redirectUrl = window.location.href;
  window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
});


closePickup.addEventListener("click", () => {
  pickupCard.style.display = "none";
  form.style.display = "block";
  resetScene();
});


const allowedLocations = [
  "HITEC City", "Gachibowli", "Madhapur", "Jubilee Hills", "Banjara Hills",
  "Kukatpally", "Miyapur", "Serilingampally", "Manikonda", "Nanakramguda",
  "Tolichowki", "Kompally", "LB Nagar", "Suryapet", "Medchal"
];


function launchConfetti() {
  for (let i = 0; i < 30; i++) {
    const conf = document.createElement('div');
    conf.style.position = 'fixed';
    conf.style.left = (Math.random() * 100) + 'vw';
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
      { transform: `translateY(0px) rotate(0deg)`, opacity: 1 },
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
  liveRegion.textContent = 'Pickup truck is en route';

  wheelL.classList.add('spin');
  wheelR.classList.add('spin');

  setTimeout(() => {
    truckWrap.classList.add('arrived');
  }, 120);

  setTimeout(() => {
    wheelL.classList.remove('spin');
    wheelR.classList.remove('spin');
    boxEl.classList.add('show');
    statusText.textContent = 'Items collected';
    liveRegion.textContent = 'Items collected by pickup truck';
  }, 1200);

  setTimeout(() => {
    badgeEl.classList.add('show');
    scrapPath.classList.add('draw');
    statusText.textContent = 'Recycle pickup complete';
    liveRegion.textContent = 'Recycle pickup complete';
    launchConfetti();
  }, 1600);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const location = document.getElementById("location").value;
  const scrapSource = document.getElementById("scrapSource").value;
  const weight = document.getElementById("weight").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  const selectedMaterials = Array.from(
    document.querySelectorAll('input[name="material"]:checked')
  ).map((checkbox) => checkbox.value);

  if (selectedMaterials.length === 0) {
    errorMessage.textContent = "Please select at least one scrap material.";
    errorMessage.style.display = "block";
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Request";
    setTimeout(() => { errorMessage.style.display = "none"; }, 5000);
    return;
  }

  if (!allowedLocations.includes(location)) {
    errorMessage.textContent = "Pickup is not available in your area.";
    errorMessage.style.display = "block";
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Request";
    setTimeout(() => { errorMessage.style.display = "none"; }, 5000);
    return;
  }

  if (!scrapSource) {
    errorMessage.textContent = "Please select the source of your scrap material.";
    errorMessage.style.display = "block";
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Request";
    setTimeout(() => { errorMessage.style.display = "none"; }, 5000);
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    errorMessage.textContent = "Please enter a valid 10-digit phone number.";
    errorMessage.style.display = "block";
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Request";
    setTimeout(() => { errorMessage.style.display = "none"; }, 5000);
    return;
  }

  const weightNum = parseFloat(weight);
  if (weightNum < 55 || weightNum > 1000) {
    errorMessage.textContent = "Please enter a valid weight between 55 and 1000 kg.";
    errorMessage.style.display = "block";
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Request";
    setTimeout(() => { errorMessage.style.display = "none"; }, 5000);
    return;
  }

  const selectedDate = new Date(date);
  if (selectedDate < today || selectedDate > maxDate) {
    errorMessage.textContent = "Please select a date within the next 30 days.";
    errorMessage.style.display = "block";
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Request";
    setTimeout(() => { errorMessage.style.display = "none"; }, 5000);
    return;
  }

  const [hour] = time.split(":").map(Number);
  if (hour < 8 || hour >= 20) {
    errorMessage.textContent = "Pickup time must be between 8:00 AM and 8:00 PM.";
    errorMessage.style.display = "block";
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Request";
    setTimeout(() => { errorMessage.style.display = "none"; }, 5000);
    return;
  }

  const formattedTime = new Date(`1970-01-01T${time}:00`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  try {
    await addDoc(collection(db, "pickupRequests"), {
      uid: currentUser.uid,
      name,
      email,
      phone,
      location,
      scrapSource,
      selectedMaterials,
      weight: weightNum,
      preferredDate: date,
      preferredTime: formattedTime,
      timestamp: Timestamp.now(),
    });

    form.style.display = "none";
    pickupCard.style.display = "block";
    showPickup();
  } catch (error) {
    console.error("Error submitting request:", error);
    errorMessage.textContent = "Something went wrong. Please try again.";
    errorMessage.style.display = "block";
    setTimeout(() => { errorMessage.style.display = "none"; }, 5000);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Request";
  }
});


resetScene();

