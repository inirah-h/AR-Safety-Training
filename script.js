function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "" || password === "") {

        alert("Please enter Employee ID and Password");

        return;
    }

    // Login-la enter panna username save pannum
    localStorage.setItem("username", username);

    // Language selection page-ku pogum
    window.location.href = "language.html";
}