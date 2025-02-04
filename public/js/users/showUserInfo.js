document.addEventListener("DOMContentLoaded", function () {
    // Callback function callbackForAllUsers to handle the response when fetching the user information from the server
    const callbackForAllUsers = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const userList = document.getElementById('userList'); // Finds div element with id userList

        // forEach loops through each user in responseData
        responseData.forEach((user) => {
            const displayItem = document.createElement("div"); // Creates HTML element to hold data
            displayItem.className =
                "col-xl-4 col-lg-6 col-md-6 col-sm-12 col-xs-12 p-3"
            displayItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${user.username}</h5>
                        <p class="card-text">
                            User ID: ${user.user_id} <br/>
                            Skillpoints: ${user.skillpoints} <br/>
                            Level: ${user.level} <br/>
                            Energy: ${user.energy} <br/>
                        </p>
                    </div>
                </div>
            `;
            // Appends displayItem so all elements can be displayed together
            userList.appendChild(displayItem);
        });
    };
    // Fetch GET /users
    fetchMethod(currentUrl + `/api/users/`, callbackForAllUsers);
});