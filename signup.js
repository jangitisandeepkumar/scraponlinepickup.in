import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "login-51a65.firebaseapp.com",
  projectId: "login-51a65",
  storageBucket: "login-51a65.appspot.com",
  messagingSenderId: "1051725155986",
  appId: "1:1051725155986:web:31ab5d15f993e9eee0e04b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Helper function to show error
function showError(message) {
  const errorBox = document.getElementById("errorMsg");
  if (errorBox) {
    errorBox.innerText = message;
  } else {
    alert(message);
  }
}

// ================= SIGNUP =================
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    // 🔹 Step 1: Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User created:", user.uid);

    // 🔹 Step 2: Save to Firestore (separate error handling)
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date()
      });
      console.log("User data saved to Firestore");
    } catch (dbError) {
      console.error("Firestore Error:", dbError);
    }

    // 🔹 Step 3: Send verification email
    await sendEmailVerification(user, {
      url: window.location.origin + "/login.html"
    });

    alert("Signup successful! Verification email sent.");

    // 🔹 Step 4: Logout user until verified
    await signOut(auth);

    // Optional: redirect
    window.location.href = "/login.html";

  } catch (error) {
    console.error("Signup Error:", error);

    let message = "";

    switch (error.code) {
      case "auth/email-already-in-use":
        message = "This email is already registered. Please login.";
        break;

      case "auth/invalid-email":
        message = "Please enter a valid email address.";
        break;

      case "auth/weak-password":
        message = "Password must be at least 6 characters.";
        break;

      default:
        message = error.message; // 🔥 SHOW REAL ERROR
    }

    showError(message);
  }
});

// ================= RESEND VERIFICATION =================
document.getElementById("resend-verification").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showError("Please enter your email and password first.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.emailVerified) {
      showError("Email is already verified.");
      await signOut(auth);
      return;
    }

    await sendEmailVerification(user, {
      url: window.location.origin + "/login.html"
    });

    alert("Verification email resent. Please check your inbox.");

    await signOut(auth);

  } catch (error) {
    console.error("Resend Error:", error);

    let message = "";

    switch (error.code) {
      case "auth/user-not-found":
        message = "No account found with this email.";
        break;

      case "auth/wrong-password":
        message = "Incorrect password.";
        break;

      case "auth/invalid-email":
        message = "Invalid email format.";
        break;

      default:
        message = error.message;
    }

    showError(message);
  }
});
