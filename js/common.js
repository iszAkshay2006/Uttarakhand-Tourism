
import { auth } from "./firebase/firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

// ========================================
// 1. SMOOTH SCROLLING
// ========================================
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = link.getAttribute("href");

    if (!target || target === "#") return;

    const section = document.querySelector(target);

    if (section) {
      event.preventDefault();

      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

// ========================================
// 2. LOGIN STATUS AND LOGOUT
// ========================================
onAuthStateChanged(auth, (user) => {
  const headerNav = document.querySelector(".site-header nav");

  if (!headerNav) return;

  let accountLink = headerNav.querySelector(
    'a[data-account-link="true"], a[href*="login.html"]'
  );

  // If this page has no Login link, do nothing.
  if (!accountLink) return;

  let logoutButton = headerNav.querySelector("#logoutButton");

  if (user) {
    accountLink.textContent =
      user.displayName || user.email || "My Account";

    accountLink.href = "#account";
    accountLink.dataset.accountLink = "true";
    accountLink.title = "Currently logged in";

    if (!logoutButton) {
      logoutButton = document.createElement("button");

      logoutButton.id = "logoutButton";
      logoutButton.type = "button";
      logoutButton.className = "logout-button";
      logoutButton.textContent = "Logout";

      accountLink.insertAdjacentElement("afterend", logoutButton);

      logoutButton.addEventListener("click", async () => {
        logoutButton.disabled = true;
        logoutButton.textContent = "Logging out...";

        try {
          await signOut(auth);

          window.location.href = new URL(
            "../index.html",
            window.location.href
          ).href;
        } catch (error) {
          console.error("Logout error:", error);

          logoutButton.disabled = false;
          logoutButton.textContent = "Logout";

          alert("Logout nahi ho paya. Please dobara try karein.");
        }
      });
    }
  } else {
    if (logoutButton) {
      logoutButton.remove();
    }

    accountLink.textContent = "Login";

    const isInPagesFolder =
      window.location.pathname.split("/").includes("pages");

    // FIXED: correct variable name
    accountLink.href = isInPagesFolder
      ? "login.html"
      : "pages/login.html";

    accountLink.removeAttribute("data-account-link");
    accountLink.removeAttribute("title");
  }
});
