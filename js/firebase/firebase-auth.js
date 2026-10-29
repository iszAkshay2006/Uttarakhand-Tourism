// js/firebase-auth.js

import { auth } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

// Signup
export async function signUp(name, email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  if (name && name.trim()) {
    await updateProfile(userCredential.user, {
      displayName: name.trim()
    });
  }

  return userCredential.user;
}

// Login
export async function logIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
}

// Logout
export async function logOut() {
  await signOut(auth);
}

// Track login status
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

// Reset password
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}
