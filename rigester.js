
/* script.js */
function registerUser() {
    let fullName = document.getElementById("fullName").value;
    let voterId = document.getElementById("voterId").value;
    let password = document.getElementById("password").value;
    let registerMessage = document.getElementById("registerMessage");

    if (!fullName || !voterId || !password) {
        registerMessage.innerText = "⚠️ All fields are required!";
        registerMessage.style.color = "red";
        return;
    }

    if (localStorage.getItem(voterId)) {
        registerMessage.innerText = "🚫 Voter ID already exists!";
        registerMessage.style.color = "red";
        return;
    }

    let userData = { fullName: fullName, password: password };
    localStorage.setItem(voterId, JSON.stringify(userData));

    registerMessage.innerText = "✅ Registration successful! You can now vote.";
    registerMessage.style.color = "green";
}
