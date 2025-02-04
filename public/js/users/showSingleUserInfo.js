document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.token
    // Callback function callbackForUserInfo to handle the response when fetching the user information from the server
    const callbackForUserInfo = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const userInfo = document.getElementById("userInfo"); // div with id userInfo

        // Status 404
        if (responseStatus == 404) { 
            userInfo.innerHTML = `${responseData.message}`;
            return;
        }

        userInfo.innerHTML = `
            <div class="card my-3">
                <div class="card-body">
                    <h2 class="card-title">${responseData.username}</h5>
                    <p class="card-text">
                        User ID: ${responseData.user_id} <br/>
                        registered email: ${responseData.email} <br/>
                        Skillpoints: ${responseData.skillpoints} <br/>
                        Level: ${responseData.level} <br/>
                        Energy: ${responseData.energy}
                    </p>
                </div>
            </div>
        `;

        localStorage.setItem("username", responseData.username);
    };
    fetchMethod(currentUrl + `/api/users/singleUser`, callbackForUserInfo, "GET", null, token);
});