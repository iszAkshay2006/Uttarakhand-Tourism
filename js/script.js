/* =========================================================
   UTTARAKHAND EXPLORER
   MAIN JAVASCRIPT
   Version: 1.0
========================================================= */

"use strict";


/* =========================================================
   GLOBAL APP OBJECT
========================================================= */

const UttarakhandExplorer = {

    /* -----------------------------------------------------
       STATE
    ----------------------------------------------------- */

    state: {
        isLoggedIn: false,
        sidebarOpen: false,
        modalOpen: false,
        currentCaptcha: "",
        userLocation: null
    },


    /* -----------------------------------------------------
       INITIALIZE
    ----------------------------------------------------- */

    init() {

        this.cacheElements();

        this.loadLoginState();

        this.setupSidebar();

        this.setupAccountModal();

        this.setupLoginForm();

        this.setupCaptcha();

        this.setupProtectedFeatures();

        this.setupSearch();

        this.setupHeroSearch();

        this.setupLocation();

        this.setupHeroVideo();

        this.setupNavigation();

        this.setupKeyboardControls();

        this.setupSmoothScrolling();

        this.updateAccountUI();

        this.generateCaptcha();

        this.setupLogout();

    },


    /* =====================================================
       CACHE ELEMENTS
    ====================================================== */

    cacheElements() {

        /* Sidebar */

        this.sidebar =
            document.getElementById("sidebar");

        this.menuButton =
            document.getElementById(
                "mobileMenuButton"
            );


        /* Account */

        this.accountModal =
            document.getElementById(
                "accountModal"
            );

        this.openAccountButton =
            document.getElementById(
                "openAccountModal"
            );

        this.closeAccountButton =
            document.getElementById(
                "closeAccountModal"
            );


        /* Login */

        this.loginForm =
            document.getElementById(
                "loginForm"
            );

        this.loginEmail =
            document.getElementById(
                "loginEmail"
            );

        this.loginPassword =
            document.getElementById(
                "loginPassword"
            );

        this.captchaInput =
            document.getElementById(
                "captchaInput"
            );

        this.captchaCode =
            document.getElementById(
                "captchaCode"
            );

        this.refreshCaptchaButton =
            document.getElementById(
                "refreshCaptcha"
            );


        /* Search */

        this.globalSearch =
            document.getElementById(
                "globalSearch"
            );

        this.heroSearch =
            document.getElementById(
                "heroSearch"
            );

        this.heroSearchForm =
            document.getElementById(
                "heroSearchForm"
            );


        /* Location */

        this.locationButton =
            document.getElementById(
                "enable-location"
            );

        this.currentLocation =
            document.getElementById(
                "current-location"
            );

        this.currentTemperature =
            document.getElementById(
                "current-temperature"
            );

        this.currentWeather =
            document.getElementById(
                "current-weather"
            );

        this.localAlertStatus =
            document.getElementById(
                "local-alert-status"
            );


        /* Video */

        this.heroVideo =
            document.querySelector(
                ".hero-video"
            );


        /* Account UI */

        this.accountLabel =
            document.querySelector(
                ".account-label"
            );

        this.accountAvatar =
            document.querySelector(
                ".account-avatar"
            );

    },


    /* =====================================================
       LOGIN STATE
    ====================================================== */

    loadLoginState() {

        try {

            const savedState =
                localStorage.getItem(
                    "uttarakhandLoggedIn"
                );


            this.state.isLoggedIn =
                savedState === "true";

        } catch (error) {

            console.warn(
                "Login state could not be loaded.",
                error
            );

            this.state.isLoggedIn = false;

        }

    },


    saveLoginState() {

        try {

            localStorage.setItem(
                "uttarakhandLoggedIn",
                "true"
            );

            this.state.isLoggedIn = true;

        } catch (error) {

            console.warn(
                "Login state could not be saved.",
                error
            );

        }

    },


    clearLoginState() {

        try {

            localStorage.removeItem(
                "uttarakhandLoggedIn"
            );

        } catch (error) {

            console.warn(
                "Login state could not be removed.",
                error
            );

        }

        this.state.isLoggedIn = false;

    },


    /* =====================================================
       SIDEBAR
    ====================================================== */

    setupSidebar() {

        if (!this.sidebar || !this.menuButton) {
            return;
        }


        /* Create overlay only once */

        this.sidebarOverlay =
            document.querySelector(
                ".sidebar-overlay"
            );


        if (!this.sidebarOverlay) {

            this.sidebarOverlay =
                document.createElement("div");

            this.sidebarOverlay.className =
                "sidebar-overlay";

            document.body.appendChild(
                this.sidebarOverlay
            );

        }


        /* Menu button */

        this.menuButton.addEventListener(
            "click",
            () => {

                this.toggleSidebar();

            }
        );


        /* Overlay */

        this.sidebarOverlay.addEventListener(
            "click",
            () => {

                this.closeSidebar();

            }
        );


        /* Sidebar links */

        const sidebarLinks =
            this.sidebar.querySelectorAll(
                "a"
            );


        sidebarLinks.forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    /*
                     * Protected links will be handled
                     * separately by setupProtectedFeatures().
                     */

                    const protectedLink =
                        link.hasAttribute(
                            "data-requires-login"
                        );


                    if (
                        !protectedLink ||
                        this.state.isLoggedIn
                    ) {

                        this.closeSidebar();

                    }

                }
            );

        });

    },


    openSidebar() {

        if (!this.sidebar) {
            return;
        }


        document.body.classList.add(
            "sidebar-open"
        );


        this.state.sidebarOpen = true;


        if (this.menuButton) {

            this.menuButton.setAttribute(
                "aria-expanded",
                "true"
            );

            this.menuButton.setAttribute(
                "aria-label",
                "Close navigation"
            );

        }

    },


    closeSidebar() {

        document.body.classList.remove(
            "sidebar-open"
        );


        this.state.sidebarOpen = false;


        if (this.menuButton) {

            this.menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            this.menuButton.setAttribute(
                "aria-label",
                "Open navigation"
            );

        }

    },


    toggleSidebar() {

        if (this.state.sidebarOpen) {

            this.closeSidebar();

        } else {

            this.openSidebar();

        }

    },


    /* =====================================================
       ACCOUNT MODAL
    ====================================================== */

    setupAccountModal() {

        if (!this.accountModal) {
            return;
        }


        if (this.openAccountButton) {

            this.openAccountButton.addEventListener(
                "click",
                () => {

                    if (this.state.isLoggedIn) {

                        /*
                         * Logged-in users can go
                         * directly to their account.
                         */

                        window.location.href =
                            "pages/account.html";

                    } else {

                        this.openLoginModal();

                    }

                }
            );

        }


        if (this.closeAccountButton) {

            this.closeAccountButton.addEventListener(
                "click",
                () => {

                    this.closeLoginModal();

                }
            );

        }


        /* Modal backdrop */

        const backdrop =
            this.accountModal.querySelector(
                ".modal-backdrop"
            );


        if (backdrop) {

            backdrop.addEventListener(
                "click",
                () => {

                    this.closeLoginModal();

                }
            );

        }

    },


    openLoginModal() {

        if (!this.accountModal) {
            return;
        }


        this.closeSidebar();


        this.state.modalOpen = true;


        this.accountModal.classList.add(
            "active"
        );


        this.accountModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );


        /* Focus email */

        setTimeout(() => {

            if (this.loginEmail) {

                this.loginEmail.focus();

            }

        }, 150);

    },


    closeLoginModal() {

        if (!this.accountModal) {
            return;
        }


        this.state.modalOpen = false;


        this.accountModal.classList.remove(
            "active"
        );


        this.accountModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "modal-open"
        );

    },


    /* =====================================================
       PROTECTED FEATURES
    ====================================================== */

    setupProtectedFeatures() {

        const protectedElements =
            document.querySelectorAll(
                "[data-requires-login]"
            );


        protectedElements.forEach(
            element => {

                /*
                 * Avoid attaching duplicate events
                 */

                if (
                    element.dataset.loginHandler ===
                    "attached"
                ) {

                    return;

                }


                element.dataset.loginHandler =
                    "attached";


                element.addEventListener(
                    "click",
                    event => {

                        if (
                            this.state.isLoggedIn
                        ) {

                            /*
                             * Logged-in user:
                             * allow normal link/button.
                             */

                            return;

                        }


                        /*
                         * Guest:
                         * stop navigation/action.
                         */

                        event.preventDefault();

                        event.stopPropagation();


                        this.closeSidebar();

                        this.openLoginModal();

                    }
                );

            }
        );

    },


    /* =====================================================
       LOGIN FORM
    ====================================================== */

    setupLoginForm() {

        if (!this.loginForm) {
            return;
        }


        this.loginForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                this.handleLogin();

            }
        );

    },


    async handleLogin() {

        const email =
            this.loginEmail
                ? this.loginEmail.value.trim()
                : "";


        const password =
            this.loginPassword
                ? this.loginPassword.value
                : "";


        const captcha =
            this.captchaInput
                ? this.captchaInput.value
                    .trim()
                    .toUpperCase()
                : "";


        /* ---------------------------------------------
           Basic validation
        --------------------------------------------- */

        if (!email) {

            this.showMessage(
                "Please enter your email or mobile number."
            );

            if (this.loginEmail) {
                this.loginEmail.focus();
            }

            return;

        }


        if (!password) {

            this.showMessage(
                "Please enter your password."
            );

            if (this.loginPassword) {
                this.loginPassword.focus();
            }

            return;

        }


        if (!captcha) {

            this.showMessage(
                "Please enter the security code."
            );

            if (this.captchaInput) {
                this.captchaInput.focus();
            }

            return;

        }


        /* ---------------------------------------------
           CAPTCHA validation
        --------------------------------------------- */

        if (
            captcha !==
            this.state.currentCaptcha
        ) {

            this.showMessage(
                "Security code is incorrect."
            );


            this.generateCaptcha();


            if (this.captchaInput) {

                this.captchaInput.value = "";

                this.captchaInput.focus();

            }

            return;

        }


        /* ---------------------------------------------
           DEMO LOGIN
           
           Real authentication should be connected
           to a secure backend/API.
        --------------------------------------------- */

        this.setLoginLoading(true);


        /*
         * Small delay so the UI feels natural.
         * Replace this section with backend API
         * authentication later.
         */

        await this.delay(700);


        this.saveLoginState();


        this.setLoginLoading(false);


        this.closeLoginModal();


        this.updateAccountUI();


        this.showMessage(
            "Login successful. Personal features are now available."
        );


        /*
         * Clear password field
         */

        if (this.loginPassword) {

            this.loginPassword.value = "";

        }


        if (this.captchaInput) {

            this.captchaInput.value = "";

        }


        this.generateCaptcha();

    },


    setLoginLoading(isLoading) {

        const button =
            this.loginForm
                ? this.loginForm.querySelector(
                    'button[type="submit"]'
                )
                : null;


        if (!button) {
            return;
        }


        if (isLoading) {

            button.disabled = true;

            button.dataset.originalText =
                button.textContent;

            button.textContent =
                "Signing in...";

        } else {

            button.disabled = false;

            button.textContent =
                button.dataset.originalText ||
                "Login";

        }

    },


    /* =====================================================
       LOGOUT
    ====================================================== */

    setupLogout() {

        /*
         * Any element with data-logout
         * can be used later on account.html.
         */

        const logoutButtons =
            document.querySelectorAll(
                "[data-logout]"
            );


        logoutButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        this.logout();

                    }
                );

            }
        );

    },


    logout() {

        this.clearLoginState();

        this.updateAccountUI();


        this.showMessage(
            "You have been logged out."
        );


        /*
         * If user is on a protected page,
         * send them to homepage.
         */

        const currentPath =
            window.location.pathname;


        const protectedPages = [
            "/saved-places.html",
            "/account.html"
        ];


        const isProtectedPage =
            protectedPages.some(
                page =>
                    currentPath.endsWith(page)
            );


        if (isProtectedPage) {

            window.location.href =
                "../index.html";

        }

    },


    /* =====================================================
       ACCOUNT UI
    ====================================================== */

    updateAccountUI() {

        if (!this.accountLabel) {
            return;
        }


        if (this.state.isLoggedIn) {

            this.accountLabel.textContent =
                "My Account";


            if (this.accountAvatar) {

                this.accountAvatar.textContent =
                    "U";

            }

        } else {

            this.accountLabel.textContent =
                "My Account";


            if (this.accountAvatar) {

                this.accountAvatar.textContent =
                    "U";

            }

        }

    },


    /* =====================================================
       CAPTCHA
    ====================================================== */

    setupCaptcha() {

        if (this.refreshCaptchaButton) {

            this.refreshCaptchaButton.addEventListener(
                "click",
                () => {

                    this.generateCaptcha();

                }
            );

        }

    },


    generateCaptcha() {

        if (!this.captchaCode) {
            return;
        }


        const characters =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


        let captcha = "";


        for (
            let index = 0;
            index < 5;
            index++
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    characters.length
                );


            captcha +=
                characters[randomIndex];

        }


        this.state.currentCaptcha =
            captcha;


        this.captchaCode.textContent =
            captcha;

    },


    /* =====================================================
       SEARCH
    ====================================================== */

    setupSearch() {

        if (!this.globalSearch) {
            return;
        }


        this.globalSearch.addEventListener(
            "keydown",
            event => {

                if (event.key !== "Enter") {
                    return;
                }


                this.performSearch(
                    this.globalSearch.value
                );

            }
        );

    },


    performSearch(query) {

        const cleanQuery =
            String(query || "")
                .trim();


        if (!cleanQuery) {
            return;
        }


        window.location.href =
            "pages/explore.html?search=" +
            encodeURIComponent(
                cleanQuery
            );

    },


    /* =====================================================
       HERO SEARCH
    ====================================================== */

    setupHeroSearch() {

        if (
            !this.heroSearchForm ||
            !this.heroSearch
        ) {

            return;

        }


        this.heroSearchForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const query =
                    this.heroSearch.value.trim();


                if (!query) {

                    this.heroSearch.focus();

                    return;

                }


                this.performSearch(
                    query
                );

            }
        );

    },


    /* =====================================================
       LOCATION
    ====================================================== */

    setupLocation() {

        if (!this.locationButton) {
            return;
        }


        this.locationButton.addEventListener(
            "click",
            () => {

                this.requestLocation();

            }
        );

    },


    requestLocation() {

        if (!navigator.geolocation) {

            this.updateLocationText(
                "Location is not supported"
            );

            return;

        }


        this.updateLocationText(
            "Detecting your location..."
        );


        this.locationButton.disabled =
            true;


        this.locationButton.textContent =
            "Detecting...";


        navigator.geolocation.getCurrentPosition(

            position => {

                this.state.userLocation = {
                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude,

                    accuracy:
                        position.coords.accuracy
                };


                const latitude =
                    position.coords.latitude
                        .toFixed(3);


                const longitude =
                    position.coords.longitude
                        .toFixed(3);


                this.updateLocationText(
                    `${latitude}°, ${longitude}°`
                );


                this.locationButton.disabled =
                    false;


                this.locationButton.textContent =
                    "Location Enabled";


                /*
                 * Weather API can be connected here later.
                 */

                this.updateWeatherPlaceholder();

            },


            error => {

                let message =
                    "Location unavailable";


                switch (error.code) {

                    case error.PERMISSION_DENIED:

                        message =
                            "Location permission denied";

                        break;


                    case error.POSITION_UNAVAILABLE:

                        message =
                            "Location unavailable";

                        break;


                    case error.TIMEOUT:

                        message =
                            "Location request timed out";

                        break;

                }


                this.updateLocationText(
                    message
                );


                this.locationButton.disabled =
                    false;


                this.locationButton.textContent =
                    "Use My Location";

            },


            {
                enableHighAccuracy: true,

                timeout: 10000,

                maximumAge: 300000
            }

        );

    },


    updateLocationText(text) {

        if (this.currentLocation) {

            this.currentLocation.textContent =
                text;

        }

    },


    updateWeatherPlaceholder() {

        if (this.currentTemperature) {

            this.currentTemperature.textContent =
                "--°";

        }


        if (this.currentWeather) {

            this.currentWeather.textContent =
                "Weather service ready";

        }


        if (this.localAlertStatus) {

            this.localAlertStatus.textContent =
                "Check live updates";

        }

    },


    /* =====================================================
       HERO VIDEO
    ====================================================== */

    setupHeroVideo() {

        if (!this.heroVideo) {
            return;
        }


        this.heroVideo.addEventListener(
            "error",
            () => {

                this.heroVideo.classList.add(
                    "video-failed"
                );

            }
        );


        this.heroVideo.addEventListener(
            "loadeddata",
            () => {

                this.heroVideo.classList.remove(
                    "video-failed"
                );

            }
        );


        /*
         * Try autoplay again after page load.
         */

        const playVideo =
            () => {

                const promise =
                    this.heroVideo.play();


                if (
                    promise &&
                    typeof promise.catch ===
                    "function"
                ) {

                    promise.catch(
                        () => {
                            /* Autoplay blocked */
                        }
                    );

                }

            };


        playVideo();

    },


    /* =====================================================
       NAVIGATION
    ====================================================== */

    setupNavigation() {

        const navLinks =
            document.querySelectorAll(
                ".main-navigation .nav-link"
            );


        if (!navLinks.length) {
            return;
        }


        const currentPage =
            window.location.pathname
                .split("/")
                .pop() ||
            "index.html";


        navLinks.forEach(link => {

            const href =
                link.getAttribute("href");


            if (!href) {
                return;
            }


            const linkPage =
                href.split("/")
                    .pop()
                    .split("?")[0];


            if (
                linkPage ===
                currentPage
            ) {

                link.classList.add(
                    "active"
                );

            }

        });

    },


    /* =====================================================
       KEYBOARD CONTROLS
    ====================================================== */

    setupKeyboardControls() {

        document.addEventListener(
            "keydown",
            event => {

                /* ESC */

                if (
                    event.key === "Escape"
                ) {

                    if (
                        this.state.modalOpen
                    ) {

                        this.closeLoginModal();

                    }


                    if (
                        this.state.sidebarOpen
                    ) {

                        this.closeSidebar();

                    }

                }


                /* "/" focuses search */

                if (
                    event.key === "/" &&
                    !this.isTypingInField()
                ) {

                    event.preventDefault();


                    if (this.globalSearch) {

                        this.globalSearch.focus();

                    }

                }

            }
        );

    },


    isTypingInField() {

        const element =
            document.activeElement;


        if (!element) {
            return false;
        }


        const tag =
            element.tagName.toLowerCase();


        return (
            tag === "input" ||
            tag === "textarea" ||
            tag === "select" ||
            element.isContentEditable
        );

    },


    /* =====================================================
       SMOOTH SCROLL
    ====================================================== */

    setupSmoothScrolling() {

        const anchorLinks =
            document.querySelectorAll(
                'a[href^="#"]'
            );


        anchorLinks.forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });

    },


    /* =====================================================
       MESSAGE / TOAST
    ====================================================== */

    showMessage(message) {

        /*
         * Remove existing toast
         */

        const existingToast =
            document.querySelector(
                ".ue-toast"
            );


        if (existingToast) {

            existingToast.remove();

        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "ue-toast";


        toast.textContent =
            message;


        document.body.appendChild(
            toast
        );


        requestAnimationFrame(() => {

            toast.classList.add(
                "show"
            );

        });


        setTimeout(() => {

            toast.classList.remove(
                "show"
            );


            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 3000);

    },


    /* =====================================================
       UTILITY DELAY
    ====================================================== */

    delay(milliseconds) {

        return new Promise(
            resolve => {

                setTimeout(
                    resolve,
                    milliseconds
                );

            }
        );

    }

};



/* =========================================================
   START APPLICATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        UttarakhandExplorer.init();

    }
);