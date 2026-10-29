
import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

export async function submitFeedback({
  name,
  email,
  rating,
  category,
  message
}) {
  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim();
  const cleanMessage = String(message || "").trim();
  const cleanCategory = String(category || "Suggestion").trim();
  const ratingNumber = Number.parseInt(String(rating).split(" ")[0], 10);

  if (!cleanName || !cleanEmail || !cleanMessage) {
    throw new Error("Please fill in all required fields.");
  }

  if (cleanName.length > 100 || cleanEmail.length > 254) {
    throw new Error("Name or email is too long.");
  }

  if (cleanMessage.length > 3000) {
    throw new Error("Message must be 3000 characters or less.");
  }

  if (!Number.isInteger(ratingNumber) ||
      ratingNumber < 1 || ratingNumber > 5) {
    throw new Error("Please select a valid rating.");
  }

  await addDoc(collection(db, "feedback"), {
    name: cleanName,
    email: cleanEmail,
    rating: ratingNumber,
    category: cleanCategory.slice(0, 100),
    message: cleanMessage,
    createdAt: serverTimestamp()
  });
}
