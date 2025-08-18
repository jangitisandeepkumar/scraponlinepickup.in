import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// 🔧 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCA-v0X9OzsToVlNHYBd1WRrOi01CWotVY",
  authDomain: "login-51a65.firebaseapp.com",
  projectId: "login-51a65",
  storageBucket: "login-51a65.appspot.com",
  messagingSenderId: "1051725155986",
  appId: "1:1051725155986:web:31ab5d15f993e9eee0e04b"
};

// 🔧 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔐 Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    alert("✅ Login successful!");
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    window.location.href = redirect ? redirect : "iron.html";
  } catch (error) {
    alert("❌ Login failed: " + error.message.replace("Firebase:", ""));
  }
});

// 🔁 Forgot Password (with email & phone check)
const forgotLink = document.getElementById("forgotPasswordLink");
const modal = document.getElementById("resetModal");
const closeModal = document.getElementById("closeModal");
const resetBtn = document.getElementById("resetBtn");

if (forgotLink && modal && closeModal && resetBtn) {
  // Open modal
  forgotLink.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Close modal via "X"
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal by clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Reset password button
  resetBtn.addEventListener("click", async () => {
    const email = document.getElementById("resetEmail").value.trim().toLowerCase();
    const phone = document.getElementById("resetPhone").value.trim();

    if (!email || !phone) {
      alert("❗ Please enter both email and phone number.");
      return;
    }

    resetBtn.disabled = true;
    resetBtn.textContent = "Sending...";

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        alert("❌ No account found with this email.");
        resetBtn.disabled = false;
        resetBtn.textContent = "Send Reset Link";
        return;
      }

      // 🔍 Search Firestore for matching email + phone
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email), where("phone", "==", phone));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("❌ Email and phone do not match.");
        resetBtn.disabled = false;
        resetBtn.textContent = "Send Reset Link";
        return;
      }

      await sendPasswordResetEmail(auth, email);
      alert("✅ Password reset link sent! Check your inbox.");
      modal.style.display = "none";
    } catch (error) {
      alert("❌ Error: " + error.message.replace("Firebase:", ""));
    } finally {
      resetBtn.disabled = false;
      resetBtn.textContent = "Send Reset Link";
    }
  });
}
