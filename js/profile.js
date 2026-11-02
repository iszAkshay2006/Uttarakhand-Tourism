
import { auth, db } from "./firebase/firebase-config.js";
import { uploadProfilePhoto } from "./firebase/firebase-storage.js";

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
  let selectedFile = null;
  let savedPhotoURL = "";

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
    if (!avatarPreview || !avatarFallback) return;

    if (!photoURL) {
      avatarPreview.removeAttribute("src");
      avatarPreview.hidden = true;
      avatarFallback.hidden = false;
      return;
    }

    avatarPreview.src = photoURL;
    avatarPreview.hidden = false;
    avatarFallback.hidden = true;
  }

  // ==========================================
  // LOAD PROFILE FROM FIRESTORE
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

      savedPhotoURL = userData.photoURL || "";
      selectedFile = null;

      if (photoInput) {
        photoInput.value = "";
      }

      displayPhoto(savedPhotoURL);

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
      selectedFile = null;
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showMessage(
        profileMessage,
        "Photo size must be 2 MB or less."
      );

      photoInput.value = "";
      selectedFile = null;
      return;
    }

    selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      displayPhoto(reader.result);

      showMessage(
        profileMessage,
        "Photo preview updated. Click Save Changes to upload it."
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
  // SAVE PROFILE DETAILS + PHOTO TO FIREBASE
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

      let photoURL = savedPhotoURL;

      // Upload selected photo to Firebase Storage
      if (selectedFile) {

        showMessage(
          profileMessage,
          "Uploading profile photo..."
        );

        photoURL = await uploadProfilePhoto(
          currentUser,
          selectedFile
        );
      }

      // Update Firebase Authentication display name
      await updateProfile(currentUser, {
        displayName: fullName,
        ...(photoURL ? { photoURL } : {})
      });

      // Save profile details and photo URL in Firestore
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
        photoURL: photoURL,
        updatedAt: serverTimestamp()
      }, { merge: true });

      savedPhotoURL = photoURL;
      selectedFile = null;

      if (photoInput) {
        photoInput.value = "";
      }

      displayPhoto(savedPhotoURL);

      updateSidebar(fullName, username);

      showMessage(
        profileMessage,
        "Profile details and photo saved successfully!"
      );

    } catch (error) {

      console.error("Profile saving error:", error);

      showMessage(
        profileMessage,
        error.message || "Unable to save your profile. Please try again."
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

      selectedFile = null;

      if (photoInput) {
        photoInput.value = "";
      }

      if (currentUser) {
        loadUserProfile(currentUser);
      }

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
        saveButton.textContent = "Saving...";
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
        "Travel preferences saved successfully in Firestore!"
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
        saveButton.textContent = "Save Preferences";
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
      resetPasswordBtn.textContent = "Sending...";

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
      resetPasswordBtn.textContent = "Reset Password";

    }
  });

});
