// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const nameEl = document.getElementById("welcome");
const phoneEl = document.getElementById("phone");
const addressEl = document.getElementById("address");
const loginBtn = document.querySelector(".login-btn");
const logoutBtn = document.querySelector(".logout-btn");
const historyBtn = document.querySelector(".history-btn");
const issueBtn = document.querySelector(".issue-btn");
const editToggle = document.querySelector(".user-icon");

// Create editable inputs and Save button
const editPhoneInput = document.createElement("input");
const editAddressInput = document.createElement("input");
const saveBtn = document.createElement("button");

editPhoneInput.type = "text";
editAddressInput.type = "text";
editPhoneInput.placeholder = "Enter new phone number";
editAddressInput.placeholder = "Enter new address";

saveBtn.textContent = "💾 Save Changes";
saveBtn.className = "login-btn"; // Green style
saveBtn.style.marginTop = "15px";

// Add elements to the card
const card = document.querySelector(".profile-card");
card.insertBefore(editPhoneInput, historyBtn);
card.insertBefore(editAddressInput, historyBtn);
card.insertBefore(saveBtn, historyBtn);

// Hide edit elements by default
editPhoneInput.style.display = "none";
editAddressInput.style.display = "none";
saveBtn.style.display = "none";

// Redirect login button
loginBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});

// Auth state check
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        nameEl.textContent = `Welcome, ${data.name || "User"}`;
        phoneEl.innerHTML = `<strong>Phone:</strong> ${data.phone || "-"}`;
        addressEl.innerHTML = `<strong>Address:</strong> ${data.address || "-"}`;
      } else {
        nameEl.textContent = "Welcome, User";
        phoneEl.innerHTML = "<strong>Phone:</strong> Not found";
        addressEl.innerHTML = "<strong>Address:</strong> Not found";
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  } else {
    nameEl.textContent = "Welcome, Guest";
    phoneEl.innerHTML = "<strong>Phone:</strong> -";
    addressEl.innerHTML = "<strong>Address:</strong> -";
  }
});

// Click profile icon to enter edit mode
editToggle.addEventListener("click", () => {
  editPhoneInput.style.display = "block";
  editAddressInput.style.display = "block";
  saveBtn.style.display = "block";

  loginBtn.style.display = "none";
  historyBtn.style.display = "none";
  logoutBtn.style.display = "none";
  issueBtn.style.display = "none";

  // Pre-fill input fields
  const currentPhone = phoneEl.textContent.replace("Phone:", "").trim();
  const currentAddress = addressEl.textContent.replace("Address:", "").trim();
  editPhoneInput.value = currentPhone === "-" ? "" : currentPhone;
  editAddressInput.value = currentAddress === "-" ? "" : currentAddress;
});

// Save changes to Firestore
saveBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (user) {
    const phone = editPhoneInput.value.trim();
    const address = editAddressInput.value.trim();

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { phone, address });

      // Update UI
      phoneEl.innerHTML = `<strong>Phone:</strong> ${phone || "-"}`;
      addressEl.innerHTML = `<strong>Address:</strong> ${address || "-"}`;

      // Hide edit inputs
      editPhoneInput.style.display = "none";
      editAddressInput.style.display = "none";
      saveBtn.style.display = "none";

      // Show main buttons
      historyBtn.style.display = "block";
      logoutBtn.style.display = "block";
      issueBtn.style.display = "block";
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("Failed to update profile. Try again.");
    }
  }
 });
