/* Client-side feedback saver for Uttarakhand Explorer.
   Saves submissions in this browser's localStorage, not on a server. */
(function () {
  "use strict";
  const form = document.getElementById("home-feedback");
  const status = document.getElementById("feedback-status");
  if (!form || !status) return;

  const key = (window.FEEDBACK_CONFIG && window.FEEDBACK_CONFIG.storageKey)
    || "uttarakhandExplorerFeedback";

  function readSaved() {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (e) {
      console.error("Unable to read saved feedback:", e);
      return [];
    }
  }

  function message(text, error) {
    status.textContent = text;
    status.style.color = error ? "#b42318" : "#176b3a";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const fd = new FormData(form);
    const ratingLabel = String(fd.get("rating") || "");
    const match = ratingLabel.match(/^([1-5])/);
    const entry = {
      id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
        : "feedback-" + Date.now() + "-" + Math.random().toString(16).slice(2),
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      rating: match ? Number(match[1]) : null,
      ratingLabel: ratingLabel,
      category: String(fd.get("category") || "Website experience").trim(),
      message: String(fd.get("message") || "").trim(),
      submittedAt: new Date().toISOString()
    };

    if (!entry.name || !entry.email || !entry.rating || !entry.message) {
      message("Please complete all required fields.", true);
      return;
    }

    try {
      const saved = readSaved();
      saved.push(entry);
      localStorage.setItem(key, JSON.stringify(saved));
      form.reset();
      message("Thank you! Your feedback has been saved in this browser.");
    } catch (e) {
      console.error("Unable to save feedback:", e);
      message("Could not save feedback. Browser storage may be disabled or full.", true);
    }
  });

  // Use window.getUttarakhandFeedback() in DevTools Console to inspect saved entries.
  window.getUttarakhandFeedback = readSaved;
  window.clearUttarakhandFeedback = function () {
    localStorage.removeItem(key);
    message("Saved feedback was cleared from this browser.");
  };
})();
