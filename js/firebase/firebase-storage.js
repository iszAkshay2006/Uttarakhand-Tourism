
import { storage } from "./firebase-config.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-storage.js";

// Upload profile photo to Firebase Storage
export async function uploadProfilePhoto(user, file) {
  if (!user || !user.uid) {
    throw new Error("User is not logged in.");
  }

  if (!file) {
    throw new Error("Please select a photo.");
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPG, PNG and WebP images are allowed.");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Photo size must be 2 MB or less.");
  }

  const extension = file.type === "image/png"
    ? "png"
    : file.type === "image/webp"
      ? "webp"
      : "jpg";

  const photoRef = ref(
    storage,
    `profilePhotos/${user.uid}/profile.${extension}`
  );

  await uploadBytes(photoRef, file, {
    contentType: file.type
  });

  return await getDownloadURL(photoRef);
}
