document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.token
    // Callback function callbackForAllGardens to handle the response when fetching the user information from the server
    const callbackForAllGardens = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const gardenList = document.getElementById('gardenList'); // Finds div element with id gardenList

        // forEach loops through each garden in responseData
        responseData.forEach((garden) => {
            const displayItem = document.createElement("div"); // Creates HTML element to hold data
            displayItem.className =
                "col-xl-4 col-lg-6 col-md-6 col-sm-12 col-xs-12 p-3"
            displayItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">${garden.garden_name}</h6>
                        <p class="card-text">
                            Garden ID: ${garden.garden_id} <br/>
                            Plant Count: ${garden.plant_count} <br/>
                        </p>
                        <a href="singleGardenInfo.html?garden_id=${garden.garden_id}" class="btn btn-success">View</a>
                    </div>
                </div>
            `;
            // Appends displayItem so all elements can be displayed together
            gardenList.appendChild(displayItem);
        });
    };
    // Fetch GET /users/singleUser/garden
    fetchMethod(currentUrl + `/api/users/singleUser/gardens`, callbackForAllGardens, 'GET', null, token);
});