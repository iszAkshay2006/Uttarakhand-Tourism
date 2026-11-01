
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

    const signupForm = document.getElementById("signupForm");

    if (!signupForm) {
        console.error("Signup form with id='signupForm' was not found.");
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

    const submitButton = signupForm.querySelector(
        'button[type="submit"]'
    );

    // Change this if your login page has a different filename.
    const LOGIN_PAGE_URL = "./login.html";


    // TOP NOTIFICATION
    function showTopAlert(message, type = "success") {

        const oldAlert = document.getElementById("signupTopAlert");

        if (oldAlert) {
            oldAlert.remove();
        }

        const alertBox = document.createElement("div");

        alertBox.id = "signupTopAlert";
        alertBox.textContent = message;

        const isSuccess = type === "success";

        alertBox.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 30px);
            max-width: 500px;
            padding: 16px 22px;
            border-radius: 12px;
            background: ${isSuccess ? "#e8f8ee" : "#fff0f0"};
            color: ${isSuccess ? "#176b38" : "#b42318"};
            border: 1px solid ${isSuccess ? "#9ad5ad" : "#f2b8b5"};
            font-size: 15px;
            font-weight: 700;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0,0,0,.15);
            z-index: 999999;
        `;

        document.body.appendChild(alertBox);
    }


    // PASSWORD SHOW / HIDE
    document.querySelectorAll("[data-toggle-password]").forEach(button => {

        button.addEventListener("click", () => {

            const targetId = button.getAttribute("data-toggle-password");
            const passwordInput = document.getElementById(targetId);

            if (!passwordInput) return;

            passwordInput.type =
                passwordInput.type === "password" ? "text" : "password";

        });

    });


    // SIGNUP FORM SUBMIT
    signupForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const fullName = fields.fullName?.value.trim() || "";
        const username = fields.username?.value.trim() || "";
        const email = fields.email?.value.trim().toLowerCase() || "";
        const password = fields.password?.value || "";
        const confirmPassword = fields.confirmPassword?.value || "";
        const termsAccepted = fields.terms?.checked || false;


        // VALIDATION
        if (!fullName || !username || !email || !password || !confirmPassword) {
            showTopAlert("Please fill in all required fields.", "error");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showTopAlert("Please enter a valid email address.", "error");
            return;
        }

        if (password.length < 8) {
            showTopAlert("Password must contain at least 8 characters.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showTopAlert("Passwords do not match.", "error");
            return;
        }

        if (!termsAccepted) {
            showTopAlert("Please accept the Terms and Conditions.", "error");
            return;
        }


        // BUTTON LOADING
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Creating Account...";
        }


        let accountCreated = false;

        try {

            // CREATE FIREBASE ACCOUNT
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            accountCreated = true;


            // SAVE USER PROFILE
            await updateProfile(user, {
                displayName: fullName
            });


            // SAVE USER DATA IN FIRESTORE
            await setDoc(doc(db, "users", user.uid), {

                uid: user.uid,
                fullName: fullName,
                username: username,
                email: email,
                createdAt: serverTimestamp()

            });


            // SEND EMAIL VERIFICATION
            try {

                await sendEmailVerification(user);

            } catch (verificationError) {

                console.error(
                    "Verification email could not be sent:",
                    verificationError
                );

            }


            // SUCCESS NOTIFICATION
            showTopAlert(
                "✓ Account Created Successfully! Please Login.",
                "success"
            );


            // CLEAR PASSWORD FIELDS
            if (fields.password) {
                fields.password.value = "";
            }

            if (fields.confirmPassword) {
                fields.confirmPassword.value = "";
            }


            // OPEN LOGIN PAGE AFTER 2 SECONDS
            setTimeout(() => {
                window.location.href = LOGIN_PAGE_URL;
            }, 2000);


        } catch (error) {

            console.error("Signup error:", error);

            let errorMessage = "Unable to create account. Please try again.";

            if (error.code === "auth/email-already-in-use") {
                errorMessage = "This email is already registered. Please Login.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Please enter a valid email address.";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "Please choose a stronger password.";
            } else if (error.code === "auth/network-request-failed") {
                errorMessage = "Network error. Please check your internet connection.";
            } else if (accountCreated) {
                errorMessage = "Account created, but profile saving failed. Please contact support.";
            }

            showTopAlert(errorMessage, "error");

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Create Account";
            }

        }

    });

});
