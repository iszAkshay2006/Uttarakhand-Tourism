// js/pages/login.js

import { auth } from "../firebase/firebase-config.js";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("loginButton");
  const loginMessage = document.getElementById("loginMessage");
  const togglePassword = document.getElementById("togglePassword");
  const forgotPassword = document.getElementById("forgotPassword");

  if (
    !loginForm ||
    !emailInput ||
    !passwordInput ||
    !loginButton ||
    !loginMessage
  ) {
    console.error("Login form ke required HTML elements nahi mile.");
    return;
  }

  // Message show karna
  function showMessage(message, type = "error") {
    loginMessage.textContent = message;
    loginMessage.style.color =
      type === "success" ? "#15803d" : "#dc2626";
  }

  function clearMessage() {
    loginMessage.textContent = "";
  }

  // Show / Hide Password
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";

      passwordInput.type = isHidden ? "text" : "password";
      togglePassword.textContent = isHidden ? "🙈" : "👁";
      togglePassword.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password"
      );
      togglePassword.setAttribute(
        "aria-pressed",
        String(isHidden)
      );
    });
  }

  // Input change par message clear
  emailInput.addEventListener("input", clearMessage);
  passwordInput.addEventListener("input", clearMessage);

  // Login form submit
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showMessage("Please enter your email and password.");
      return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      showMessage("Login successful! Redirecting...", "success");

      // User details console mein expose nahi kar rahe.
      // Login page se homepage par redirect.
      window.location.href = "../index.html";
    } catch (error) {
      console.error("Login error:", error.code);

      switch (error.code) {
        case "auth/invalid-email":
          showMessage("Please enter a valid email address.");
          break;

        case "auth/user-not-found":
        case "auth/invalid-credential":
        case "auth/wrong-password":
          showMessage("Email or password is incorrect. Please try again.");
          break;

        case "auth/too-many-requests":
          showMessage(
            "Too many attempts. Please wait a while and try again."
          );
          break;

        case "auth/network-request-failed":
          showMessage("Network error. Please check your internet connection.");
          break;

        case "auth/operation-not-allowed":
          showMessage(
            "Email/password login is disabled in Firebase Authentication."
          );
          break;

        default:
          showMessage(
            "Login failed. Please try again. If the issue continues, check the browser console."
          );
      }
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "Login";
    }
  });

  // Forgot Password
  if (forgotPassword) {
    forgotPassword.addEventListener("click", async (event) => {
      event.preventDefault();
      clearMessage();

      const email = emailInput.value.trim();

      if (!email) {
        showMessage(
          "Please enter your email address first, then click Forgot Password."
        );
        emailInput.focus();
        return;
      }

      forgotPassword.style.pointerEvents = "none";
      forgotPassword.style.opacity = "0.6";

      try {
        await sendPasswordResetEmail(auth, email);

        showMessage(
          "If this email is registered, a password reset email has been sent. Check your inbox and spam folder.",
          "success"
        );
      } catch (error) {
        console.error("Password reset error:", error.code);

        switch (error.code) {
          case "auth/invalid-email":
            showMessage("Please enter a valid email address.");
            break;

          case "auth/too-many-requests":
            showMessage("Too many requests. Please try again later.");
            break;

          default:
            showMessage(
              "Could not send the reset email. Check your Firebase settings and try again."
            );
        }
      } finally {
        forgotPassword.style.pointerEvents = "";
        forgotPassword.style.opacity = "";
      }
    });
  }

  console.log("Login page JavaScript loaded successfully.");
});
