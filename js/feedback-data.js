/* Separate configuration file. Load before feedback.js.
   Visitor submissions are stored in localStorage, not in this file. */
window.FEEDBACK_CONFIG = Object.freeze({
  storageKey: "uttarakhandExplorerFeedback",
  categories: [
    "Website experience",
    "Destination information",
    "Trip planning",
    "Suggestion"
  ],
  ratingLabels: [
    "5 - Excellent",
    "4 - Very good",
    "3 - Good",
    "2 - Fair",
    "1 - Needs improvement"
  ]
});
