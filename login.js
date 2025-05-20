import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCA-v0X9OzsToVlNHYBd1WRrOi01CWotVY",
  authDomain: "login-51a65.firebaseapp.com",
  projectId: "login-51a65",
  storageBucket: "login-51a65.appspot.com",
  messagingSenderId: "1051725155986",
  appId: "1:1051725155986:web:31ab5d15f993e9eee0e04b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      alert("Please verify your email before logging in.");
      await signOut(auth);
      return;
    }

    alert("Login successful!");

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    window.location.href = redirect ? redirect : "iron.html";

  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

// Resend verification
const resendBtn = document.getElementById("resend-verification");
if (resendBtn) {
  resendBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        alert("Email already verified.");
        await signOut(auth);
        return;
      }

      await sendEmailVerification(user, {
        url: window.location.origin + "/login.html"
      });

      alert("Verification email resent.");
      await signOut(auth);
    } catch (error) {
      alert("Error: " + error.message);
    }
  });
}

// Forgot Password
const forgotLink = document.getElementById("forgotPasswordLink");
const modal = document.getElementById("resetModal");
const closeModal = document.getElementById("closeModal");
const resetBtn = document.getElementById("resetBtn");

if (forgotLink && modal && closeModal && resetBtn) {
  forgotLink.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  resetBtn.addEventListener("click", async () => {
    const resetEmail = document.getElementById("resetEmail").value.trim();
    if (!resetEmail) {
      alert("Please enter your email.");
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, resetEmail);
      if (methods.length === 0) {
        alert("No account found with this email.");
        return;
      }

      await sendPasswordResetEmail(auth, resetEmail);
      alert("Password reset link sent! Check your email.");
      modal.style.display = "none";
    } catch (error) {
      alert("Error sending reset email: " + error.message);
    }
  });
}
