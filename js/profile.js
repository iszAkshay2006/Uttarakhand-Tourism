
/* ========================================
   PROFILE PAGE — Frontend demo
   ======================================== */

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

const PROFILE_KEY = "ue_profile_demo";
const TRAVEL_KEY = "ue_travel_preferences_demo";

let selectedPhoto = "";

function showMessage(element, message) {
  element.textContent = message;
}

function updateSidebar() {
  const name = document.getElementById("fullName").value.trim();
  sidebarName.textContent = name || "Your Name";

  const username = document.getElementById("username").value.trim();
  sidebarUsername.textContent = username ? `@${username}` : "@yourusername";
}

function readForm(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function fillForm(form, values) {
  Object.entries(values).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (field && field.type !== "file") {
      field.value = value ?? "";
    }
  });
}

function loadDemoData() {
  try {
    const savedProfile = localStorage.getItem(PROFILE_KEY);
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      fillForm(profileForm, data.details || {});

      if (data.photo) {
        selectedPhoto = data.photo;
        avatarPreview.src = selectedPhoto;
        avatarPreview.hidden = false;
        avatarFallback.hidden = true;
      }
    }

    const savedTravel = localStorage.getItem(TRAVEL_KEY);
    if (savedTravel) {
      fillForm(travelForm, JSON.parse(savedTravel));
    }
  } catch {
    showMessage(
      profileMessage,
      "Saved demo data could not be loaded. Your browser storage may be unavailable."
    );
  }

  updateSidebar();
}

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    showMessage(profileMessage, "Please choose a JPG, PNG or WebP image.");
    photoInput.value = "";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showMessage(profileMessage, "Photo size must be 2 MB or less.");
    photoInput.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    selectedPhoto = reader.result;
    avatarPreview.src = selectedPhoto;
    avatarPreview.hidden = false;
    avatarFallback.hidden = true;
    showMessage(profileMessage, "Photo preview updated. Click Save Changes to save this demo profile.");
  };

  reader.onerror = () => {
    showMessage(profileMessage, "Unable to read this image. Please try another.");
  };

  reader.readAsDataURL(file);
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const details = readForm(profileForm);

  try {
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({
        details,
        photo: selectedPhoto
      })
    );

    updateSidebar();
    showMessage(
      profileMessage,
      "Demo profile saved in this browser. This is not a server account."
    );
  } catch {
    showMessage(
      profileMessage,
      "Unable to save. The browser may not have enough storage for this photo."
    );
  }
});

profileForm.addEventListener("reset", () => {
  setTimeout(() => {
    photoInput.value = "";
    selectedPhoto = "";

    avatarPreview.removeAttribute("src");
    avatarPreview.hidden = true;
    avatarFallback.hidden = false;

    try {
      const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
      if (saved) {
        fillForm(profileForm, saved.details || {});
        if (saved.photo) {
          selectedPhoto = saved.photo;
          avatarPreview.src = saved.photo;
          avatarPreview.hidden = false;
          avatarFallback.hidden = true;
        }
      }
    } catch {
      // Leave the form reset if stored demo data is unavailable.
    }

    updateSidebar();
    showMessage(profileMessage, "Form reset.");
  }, 0);
});

travelForm.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    localStorage.setItem(TRAVEL_KEY, JSON.stringify(readForm(travelForm)));
    showMessage(travelMessage, "Travel preferences saved in this browser.");
  } catch {
    showMessage(travelMessage, "Unable to save preferences in this browser.");
  }
});

document.getElementById("resetPasswordBtn").addEventListener("click", () => {
  showMessage(
    securityMessage,
    "Password reset is not connected yet. Connect Firebase Authentication or your backend to send a secure reset email."
  );
});

loadDemoData();
