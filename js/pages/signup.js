import { auth, db } from "../firebase/firebase-config.js";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const message = document.getElementById("formMessage");

  if (!form || !message) {
    console.error("Signup form ya formMessage nahi mila.");
    return;
  }

  const fields = {
    fullName: document.getElementById("fullName"),
    username: document.getElementById("username"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
    terms: document.getElementById("terms")
  };

  // Required fields check
  const missingField = Object.entries(fields).find(
    ([, field]) => !field
  );

  if (missingField) {
    console.error("Signup field nahi mila:", missingField[0]);
    message.textContent = "Signup form mein kuch fields missing hain.";
    message.className = "form-message error";
    return;
  }

  function showError(fieldName, text) {
    const error = document.getElementById(`${fieldName}Error`);
    if (error) error.textContent = text;

    const field = fields[fieldName];
    if (field) {
      field.setAttribute("aria-invalid", text ? "true" : "false");
    }
  }

  function validateForm() {
    let valid = true;

    Object.keys(fields).forEach(name => showError(name, ""));

    const fullName = fields.fullName.value.trim();
    const username = fields.username.value.trim();
    const email = fields.email.value.trim();
    const password = fields.password.value;
    const confirmPassword = fields.confirmPassword.value;

    if (fullName.length < 2) {
      showError("fullName", "Please enter your full name.");
      valid = false;
    }

    if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) {
      showError(
        "username",
        "Use 3–24 letters, numbers or underscores."
      );
      valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("email", "Please enter a valid email address.");
      valid = false;
    }

    if (password.length < 8) {
      showError(
        "password",
        "Password must contain at least 8 characters."
      );
      valid = false;
    }

    if (!confirmPassword || confirmPassword !== password) {
      showError("confirmPassword", "Passwords do not match.");
      valid = false;
    }

    if (!fields.terms.checked) {
      showError(
        "terms",
        "Please accept the Terms of Service and Privacy Policy."
      );
      valid = false;
    }

    return valid;
  }

  // Show / Hide password
  document.querySelectorAll(".toggle-password").forEach(button => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.target);

      if (!input) {
        console.error(
          "Password input nahi mila:",
          button.dataset.target
        );
        return;
      }

      const isHidden = input.type === "password";

      input.type = isHidden ? "text" : "password";
      button.textContent = isHidden ? "Hide" : "Show";
      button.setAttribute("aria-pressed", String(isHidden));

      button.setAttribute(
        "aria-label",
        `${isHidden ? "Hide" : "Show"} ${
          button.dataset.target === "password"
            ? "password"
            : "confirmation password"
        }`
      );
    });
  });

  // Signup + verification email
  form.addEventListener("submit", async event => {
    event.preventDefault();

    message.textContent = "";
    message.className = "form-message";

    if (!validateForm()) {
      message.textContent =
        "Please correct the highlighted fields.";
      message.classList.add("error");

      const firstInvalid = form.querySelector(
        '[aria-invalid="true"]'
      );

      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const fullName = fields.fullName.value.trim();
    const username = fields.username.value.trim();
    const email = fields.email.value.trim();
    const password = fields.password.value;

    const submitButton = form.querySelector('[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Creating account...";
    }

    let accountCreated = false;

    try {
      // 1. Firebase account create karein
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      accountCreated = true;

      // 2. Firebase profile mein full name save karein
      await updateProfile(credential.user, {
        displayName: fullName
      });

      // 3. Firestore mein user profile save karein
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        fullName,
        username,
        email,
        createdAt: serverTimestamp()
      });

      // 4. Verification email bhejein
      // Apne actual deployed login page URL se replace karein.
      const verificationRedirectURL =
        "https://YOUR-WEBSITE-URL.com/pages/login.html";

      await sendEmailVerification(credential.user, {
        url: verificationRedirectURL,
        handleCodeInApp: false
      });

      // 5. User ko success message dikhayein
      message.textContent =
        "Account created! Check your inbox or spam folder and click the verification link. Then log in.";

      message.classList.add("success");

      // Password field ko clear karein
      fields.password.value = "";
      fields.confirmPassword.value = "";

      // Redirect nahi karte, taaki user message padh sake.
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Create Account";
      }

    } catch (error) {
      console.error(
        "Signup error:",
        error.code,
        error.message
      );

      const errors = {
        "auth/email-already-in-use":
          "This email is already registered. Please log in.",

        "auth/invalid-email":
          "Please enter a valid email address.",

        "auth/weak-password":
          "Please choose a stronger password.",

        "auth/network-request-failed":
          "Check your internet connection and try again.",

        "auth/operation-not-allowed":
          "Enable Email/Password in Firebase Authentication.",

        "auth/too-many-requests":
          "Too many attempts. Please try again later.",

        "permission-denied":
          "Firestore permission denied. Check your security rules.",

        "unavailable":
          "The service is temporarily unavailable. Please try again."
      };

      if (accountCreated) {
        // Account ban chuka hai, lekin profile ya email step fail hua.
        message.textContent =
          "Your account was created, but setup or the verification email could not be completed. Please try logging in and request a new verification email if needed.";
      } else {
        message.textContent =
          errors[error.code] ||
          "Signup failed. Please try again.";
      }

      message.classList.add("error");

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Create Account";
      }
    }
  });

  // Typing ke dauran errors clear/update karein
  Object.entries(fields).forEach(([name, field]) => {
    if (!field) return;

    field.addEventListener("input", () => {
      showError(name, "");

      if (name === "password" &&
          fields.confirmPassword.value) {
        showError(
          "confirmPassword",
          fields.confirmPassword.value === field.value
            ? ""
            : "Passwords do not match."
        );
      }

      if (name === "confirmPassword") {
        showError(
          "confirmPassword",
          field.value === fields.password.value
            ? ""
            : "Passwords do not match."
        );
      }
    });

    field.addEventListener("change", () => {
      if (name === "terms" && field.checked) {
        showError("terms", "");
      }
    });
  });
});
