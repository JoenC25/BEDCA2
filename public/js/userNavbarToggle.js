document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const registerButton = document.getElementById("registerButton");
    const logoutButton = document.getElementById("logoutButton");
    const profileButton = document.getElementById("profileButton");
  
    const token = localStorage.getItem("token");

    const callback = (responseStatus, responseData) => {
        console.log(responseStatus);
        console.log(responseData);
        if (responseStatus == 200) {
            // Token is verified, show profile button and hide login and register buttons
            loginButton.classList.add("d-none");
            registerButton.classList.add("d-none");
            logoutButton.classList.remove("d-none");
            profileButton.classList.remove("d-none");
        } else {
            // Token does not exist or is not verified, show login and register buttons and hide profile and logout buttons
            loginButton.classList.remove("d-none");
            registerButton.classList.remove("d-none");
            logoutButton.classList.add("d-none");
            profileButton.classList.add("d-none");
            localStorage.removeItem("token");
        }
    }
    fetchMethod(currentUrl + `/api/jwt/verify/`, callback, "GET", null, token);

    logoutButton.addEventListener("click", function () {
        // Remove the token from local storage and redirect to index.html
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });
});