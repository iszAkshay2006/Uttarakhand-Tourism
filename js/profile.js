
import { auth, db } from "./firebase/firebase-config.js";

import {
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // EXISTING HTML ELEMENTS
  // ==========================================

  const profileForm = document.getElementById("profileForm");
  const travelForm = document.getElementById("travelForm");
  const photoInput = document.getElementById("photoInput");

  const avatarPreview = document.getElementById("avatarPreview");
  const avatarFallback = document.getElementById("avatarFallback");

  const profileMessage = document.getElementById("profileMessage");
  const travelMessage = document.getElementById("travelMessage");
  const securityMessage = document.getElementById("securityMessage");

  const sidebarName = document.getElementById("sidebarName");
  const sidebarUsername = document.getElementById("sidebarUsername");

  const resetPasswordBtn = document.getElementById("resetPasswordBtn");

  let currentUser = null;
  let selectedPhoto = "";

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  function showMessage(element, message) {
    if (element) {
      element.textContent = message;
    }
  }

  function updateSidebar(name, username) {
    if (sidebarName) {
      sidebarName.textContent = name || "Your Name";
    }

    if (sidebarUsername) {
      sidebarUsername.textContent = username
        ? `@${username}`
        : "@yourusername";
    }
  }

  function readForm(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function fillForm(form, values) {
    if (!form || !values) return;

    Object.entries(values).forEach(([key, value]) => {
      const field = form.elements.namedItem(key);

      if (field && field.type !== "file") {
        field.value = value ?? "";
      }
    });
  }

  function displayPhoto(photoURL) {
    if (!photoURL || !avatarPreview || !avatarFallback) return;

    avatarPreview.src = photoURL;
    avatarPreview.hidden = false;
    avatarFallback.hidden = true;
  }

  // ==========================================
  // LOAD PROFILE FROM EXISTING FIRESTORE USER
  // ==========================================

  async function loadUserProfile(user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userRef);

      const userData = userSnapshot.exists()
        ? userSnapshot.data()
        : {};

      const profileData = {
        fullName: userData.fullName || user.displayName || "",
        username: userData.username || "",
        email: userData.email || user.email || "",
        phone: userData.phone || "",
        city: userData.city || "",
        state: userData.state || "",
        bio: userData.bio || ""
      };

      fillForm(profileForm, profileData);

      updateSidebar(
        profileData.fullName,
        profileData.username
      );

      if (userData.photoURL) {
        displayPhoto(userData.photoURL);
      }

      if (userData.travelPreferences) {
        fillForm(travelForm, userData.travelPreferences);
      }

      showMessage(
        profileMessage,
        "Your profile has been loaded successfully."
      );

    } catch (error) {
      console.error("Profile loading error:", error);

      showMessage(
        profileMessage,
        "Unable to load your profile. Please try again."
      );
    }
  }

  // ==========================================
  // FIREBASE AUTHENTICATION CHECK
  // ==========================================

  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    currentUser = user;

    await loadUserProfile(user);
  });

  // ==========================================
  // PROFILE PHOTO PREVIEW
  // ==========================================

  photoInput?.addEventListener("change", () => {

    const file = photoInput.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      showMessage(
        profileMessage,
        "Please choose a JPG, PNG or WebP image."
      );

      photoInput.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showMessage(
        profileMessage,
        "Photo size must be 2 MB or less."
      );

      photoInput.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      selectedPhoto = reader.result;
      displayPhoto(selectedPhoto);

      showMessage(
        profileMessage,
        "Photo preview updated. Save Changes to save your profile details."
      );
    };

    reader.onerror = () => {
      showMessage(
        profileMessage,
        "Unable to read this image. Please choose another."
      );
    };

    reader.readAsDataURL(file);
  });

  // ==========================================
  // SAVE PROFILE DETAILS TO FIRESTORE
  // ==========================================

  profileForm?.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!currentUser) {
      showMessage(
        profileMessage,
        "Please login to save your profile."
      );
      return;
    }

    const details = readForm(profileForm);

    const fullName = (details.fullName || "").trim();
    const username = (details.username || "").trim();

    if (!fullName || !username) {
      showMessage(
        profileMessage,
        "Full name and username are required."
      );
      return;
    }

    const saveButton = profileForm.querySelector(
      'button[type="submit"]'
    );

    try {

      if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";
      }

      await updateProfile(currentUser, {
        displayName: fullName
      });

      const userRef = doc(db, "users", currentUser.uid);

      await setDoc(userRef, {
        uid: currentUser.uid,
        fullName: fullName,
        username: username,
        email: currentUser.email || "",
        phone: (details.phone || "").trim(),
        city: (details.city || "").trim(),
        state: (details.state || "").trim(),
        bio: (details.bio || "").trim(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      updateSidebar(fullName, username);

      showMessage(
        profileMessage,
        "Profile updated successfully!"
      );

    } catch (error) {

      console.error("Profile saving error:", error);

      showMessage(
        profileMessage,
        "Unable to save your profile. Please try again."
      );

    } finally {

      if (saveButton) {
        saveButton.disabled = false;
        saveButton.textContent = "Save Changes";
      }

    }
  });

  // ==========================================
  // RESET PROFILE FORM
  // ==========================================

  profileForm?.addEventListener("reset", () => {

    setTimeout(() => {

      if (currentUser) {
        loadUserProfile(currentUser);
      }

      if (photoInput) {
        photoInput.value = "";
      }

      selectedPhoto = "";

    }, 0);
  });

  // ==========================================
  // SAVE TRAVEL PREFERENCES TO FIRESTORE
  // ==========================================

  travelForm?.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!currentUser) {
      showMessage(
        travelMessage,
        "Please login to save your travel preferences."
      );
      return;
    }

    const saveButton = travelForm.querySelector(
      'button[type="submit"]'
    );

    try {

      if (saveButton) {
        saveButton.disabled = true;
      }

      const preferences = readForm(travelForm);

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          travelPreferences: preferences,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      showMessage(
        travelMessage,
        "Travel preferences saved successfully!"
      );

    } catch (error) {

      console.error("Travel preferences error:", error);

      showMessage(
        travelMessage,
        "Unable to save travel preferences. Please try again."
      );

    } finally {

      if (saveButton) {
        saveButton.disabled = false;
      }

    }
  });

  // ==========================================
  // FIREBASE PASSWORD RESET EMAIL
  // ==========================================

  resetPasswordBtn?.addEventListener("click", async () => {

    if (!currentUser || !currentUser.email) {
      showMessage(
        securityMessage,
        "Registered email address not found."
      );
      return;
    }

    try {

      resetPasswordBtn.disabled = true;
      showMessage(
        securityMessage,
        "Sending password reset email..."
      );

      await sendPasswordResetEmail(
        auth,
        currentUser.email
      );

      showMessage(
        securityMessage,
        "Password reset email sent. Please check your inbox and spam folder."
      );

    } catch (error) {

      console.error("Password reset error:", error);

      showMessage(
        securityMessage,
        "Unable to send password reset email. Please try again later."
      );

    } finally {

      resetPasswordBtn.disabled = false;

    }
  });

});
