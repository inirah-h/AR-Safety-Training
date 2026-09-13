let currentOtp = "";
let verifiedContact = "";


// -------------------------
// SCREEN NAVIGATION
// -------------------------

function hideAllScreens() {
    document.getElementById("choiceScreen").classList.add("hidden");
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("registerScreen").classList.add("hidden");
    document.getElementById("otpScreen").classList.add("hidden");
    document.getElementById("passwordScreen").classList.add("hidden");
}

function showChoice() {
    hideAllScreens();
    document.getElementById("choiceScreen").classList.remove("hidden");
}

function showLogin() {
    hideAllScreens();
    document.getElementById("loginScreen").classList.remove("hidden");

    document.getElementById("loginError").textContent = "";
}

function showRegister() {
    hideAllScreens();
    document.getElementById("registerScreen").classList.remove("hidden");

    document.getElementById("registerError").textContent = "";
}


// -------------------------
// VALIDATION FUNCTIONS
// -------------------------

function isValidEmail(email) {
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}

function isValidPhone(phone) {
    return /^[6-9][0-9]{9}$/.test(phone);
}

function isValidPassword(password) {

    const length = password.length >= 8;
    const alphabet = /[A-Za-z]/.test(password);
    const number = /[0-9]/.test(password);
    const special = /[^A-Za-z0-9]/.test(password);

    return length && alphabet && number && special;
}


// -------------------------
// REGISTER - CONTACT
// -------------------------

function verifyContact() {

    const name =
        document.getElementById("registerName").value.trim();

    const username =
        document.getElementById("registerUsername").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const phone =
        document.getElementById("registerPhone").value.trim();

    const error =
        document.getElementById("registerError");

    error.textContent = "";


    // Name validation

    if (name === "") {
        error.textContent = "Please enter your full name.";
        return;
    }


    // Username validation

    if (username.length < 3) {
        error.textContent =
            "Username must contain at least 3 characters.";
        return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        error.textContent =
            "Username can contain only letters, numbers and underscore.";
        return;
    }


    // Check existing username

    const users =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const usernameExists =
        users.some(
            user =>
                user.username.toLowerCase() === username.toLowerCase()
        );

    if (usernameExists) {
        error.textContent =
            "This username is already registered. Please choose another.";
        return;
    }


    // Email / Phone validation

    if (email === "" && phone === "") {
        error.textContent =
            "Please enter at least one Email ID or Phone Number.";
        return;
    }

    if (email !== "" && !isValidEmail(email)) {
        error.textContent =
            "Please enter a valid Email ID.";
        return;
    }

    if (phone !== "" && !isValidPhone(phone)) {
        error.textContent =
            "Please enter a valid 10 digit Indian phone number.";
        return;
    }


    // Check duplicate email

    if (email !== "") {

        const emailExists =
            users.some(
                user =>
                    user.email &&
                    user.email.toLowerCase() === email.toLowerCase()
            );

        if (emailExists) {
            error.textContent =
                "This Email ID is already registered.";
            return;
        }
    }


    // Check duplicate phone

    if (phone !== "") {

        const phoneExists =
            users.some(
                user =>
                    user.phone &&
                    user.phone === phone
            );

        if (phoneExists) {
            error.textContent =
                "This phone number is already registered.";
            return;
        }
    }


    // Select contact for OTP

    if (phone !== "") {
        verifiedContact = phone;
    } else {
        verifiedContact = email;
    }


    // Generate OTP

    currentOtp =
        Math.floor(100000 + Math.random() * 900000).toString();


    document.getElementById("demoOtp").textContent =
        currentOtp;


    // Save temporary registration data

    const registrationData = {
        name: name,
        username: username,
        email: email,
        phone: phone
    };

    localStorage.setItem(
        "pendingRegistration",
        JSON.stringify(registrationData)
    );


    hideAllScreens();

    document.getElementById("otpScreen").classList.remove("hidden");
}


// -------------------------
// OTP VERIFICATION
// -------------------------

function verifyOtp() {

    const enteredOtp =
        document.getElementById("otpInput").value.trim();

    const error =
        document.getElementById("otpError");

    error.textContent = "";


    if (!/^[0-9]{6}$/.test(enteredOtp)) {
        error.textContent =
            "Please enter a valid 6 digit OTP.";
        return;
    }


    if (enteredOtp !== currentOtp) {
        error.textContent =
            "Incorrect OTP. Please try again.";
        return;
    }


    hideAllScreens();

    document.getElementById("passwordScreen").classList.remove("hidden");
}


// -------------------------
// PASSWORD LIVE VALIDATION
// -------------------------

document
    .getElementById("newPassword")
    .addEventListener("input", function () {

        const password = this.value;

        updateRule(
            "ruleLength",
            password.length >= 8,
            "At least 8 characters"
        );

        updateRule(
            "ruleLetter",
            /[A-Za-z]/.test(password),
            "At least 1 alphabet"
        );

        updateRule(
            "ruleNumber",
            /[0-9]/.test(password),
            "At least 1 number"
        );

        updateRule(
            "ruleSpecial",
            /[^A-Za-z0-9]/.test(password),
            "At least 1 special character"
        );
    });


function updateRule(id, valid, text) {

    const element =
        document.getElementById(id);

    if (valid) {
        element.textContent = "✓ " + text;
        element.style.color = "#20c963";
    } else {
        element.textContent = "✗ " + text;
        element.style.color = "#77858a";
    }
}


// -------------------------
// COMPLETE REGISTRATION
// -------------------------

function completeRegistration() {

    const password =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const error =
        document.getElementById("passwordError");

    error.textContent = "";


    if (!isValidPassword(password)) {
        error.textContent =
            "Password must contain at least 8 characters, 1 alphabet, 1 number and 1 special character.";
        return;
    }


    if (password !== confirmPassword) {
        error.textContent =
            "Passwords do not match.";
        return;
    }


    const pendingRegistration =
        JSON.parse(
            localStorage.getItem("pendingRegistration")
        );


    if (!pendingRegistration) {
        error.textContent =
            "Registration session expired. Please register again.";
        return;
    }


    const users =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];


    // Store verified user

    users.push({
        name: pendingRegistration.name,
        username: pendingRegistration.username,
        email: pendingRegistration.email,
        phone: pendingRegistration.phone,
        password: password,
        verified: true
    });


    localStorage.setItem(
        "registeredUsers",
        JSON.stringify(users)
    );


    localStorage.removeItem("pendingRegistration");


    alert(
        "Registration successful! Please login with your Email/Phone and password."
    );


    // Clear fields

    document.getElementById("registerName").value = "";
    document.getElementById("registerUsername").value = "";
    document.getElementById("registerEmail").value = "";
    document.getElementById("registerPhone").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
    document.getElementById("otpInput").value = "";


    showLogin();
}


// -------------------------
// LOGIN
// -------------------------

function loginUser() {

    const identifier =
        document.getElementById("loginIdentifier")
        .value.trim();

    const password =
        document.getElementById("loginPassword")
        .value;

    const error =
        document.getElementById("loginError");

    error.textContent = "";


    if (identifier === "" || password === "") {
        error.textContent =
            "Please enter Email/Phone and password.";
        return;
    }


    const users =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];


    const user =
        users.find(user => {

            const emailMatch =
                user.email &&
                user.email.toLowerCase() ===
                identifier.toLowerCase();

            const phoneMatch =
                user.phone &&
                user.phone === identifier;

            return emailMatch || phoneMatch;
        });


    if (!user) {
        error.textContent =
            "No registered account found with this Email/Phone.";
        return;
    }


    if (!user.verified) {
        error.textContent =
            "Please complete contact verification first.";
        return;
    }


    if (user.password !== password) {
        error.textContent =
            "Incorrect password.";
        return;
    }


    // Save logged-in user

    localStorage.setItem(
        "username",
        user.username
    );

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
    );


    // Go to language selection

    window.location.href = "language.html";
}