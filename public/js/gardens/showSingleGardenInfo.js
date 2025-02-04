document.addEventListener("DOMContentLoaded", function () {
    url = new URL(document.URL);
    const urlParams = url.searchParams;
    const gardenId = urlParams.get("garden_id");
    const token = localStorage.token;
    
    // Callback function callbackForAllGardens to handle the response when fetching the user information from the server
    const callbackForGardenInfo = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const gardenInfo = document.getElementById('gardenInfo'); // Finds div element with id gardenInfo

        // Status 404
        if (responseStatus == 404) { 
            userInfo.innerHTML = `${responseData.message}`;
            return;
        }

        gardenInfo.innerHTML = `
            <div class="card my-3">
                <div class="card-body">
                    <h2 class="card-title">${responseData.garden_name}</h2>
                    <p class="card-text">
                        Garden ID: ${responseData.garden_id} <br/>
                        Plant Count: ${responseData.plant_count} <br/>
                    </p>
                </div>
            </div>
        `;
    };
    // Fetch GET /garden/:garden_id
    fetchMethod(currentUrl + `/api/garden/${gardenId}`, callbackForGardenInfo);

    // Callback function callbackForPlants to handle the response when fetching the user information from the server
    const callbackForPlants = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const plantList = document.getElementById('plantList'); // Finds div element with id gardenList

        // forEach loops through each garden in responseData
        responseData.forEach((plant) => {
            const displayItem = document.createElement("div"); // Creates HTML element to hold data
            displayItem.className =
                "col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 p-3"
            displayItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">${plant.plant_name}</h6>
                        <p class="card-text">
                            Plant ID: ${plant.plant_id} <br/>
                            Tier: ${plant.tier_name} (${plant.tier_num}) <br/>
                        </p>
                        ${plant.ownership ? 
                        `<div class="card-buttons">
                            <button class="btn btn-success wp-button" value=${plant.plant_id}>Water</br>(Tier Up)</button>
                            <button class="btn btn-secondary rp-button" value=${plant.plant_id}>Rename</button>
                        </div>` : ""}
                    </div>
                </div>
            `;
            // Only creates buttons when plant belongs to user, done through retrieving owner_id from SQL

            // Appends displayItem so all elements can be displayed together
            plantList.appendChild(displayItem);
        });
    };
    // Fetch GET /garden/:garden_id/plants
    fetchMethod(currentUrl + `/api/garden/${gardenId}/plants`, callbackForPlants, "GET", null, token);

    // WATER PLANTS (tier up)
    // Popup confirmation for watering plants, function Checks if target of event is wp-button
    document.getElementById("plantList").addEventListener("click", async function (event) {
        if (event.target.classList.contains("wp-button")) {
            console.log("Click detected on:", event.target);
            // Show popup
            document.getElementById('wp-popup').classList.remove("d-none");

            const confirmed = await waitForConfirmation_wp();

            if (confirmed) {
                console.log("User confirmed action!");
                const callbackForWaterPlant = (responseStatus, responseData) => {
                    console.log("responseStatus:", responseStatus);
                    console.log("responseData:", responseData);

                    if (responseStatus == 409) { 
                        showAlert(responseData.message, responseStatus);
                        return;
                    }
                    // Sends success message
                    showAlert(responseData.message);
                }

                // Update Tier of Plant
                fetchMethod(currentUrl + `/api/plant/${event.target.value}/water`, callbackForWaterPlant, 'PUT', null, token);
            } else {
                console.log("User canceled action.");
            }

            // Hide popup after confirmation/cancellation
            document.getElementById('wp-popup').classList.add("d-none");
        }
    });

    // Function that awaits confirmation from user
    function waitForConfirmation_wp() {
        return new Promise((resolve) => {
            const confirmBtn = document.getElementById('wp-confirm');
            const cancelBtn = document.getElementById('wp-popup-close');

            confirmBtn.addEventListener("click", () => resolve(true), { once: true });

            cancelBtn.addEventListener("click", () => resolve(false), { once: true });
        });
    }

    // RENAME PLANTS
    // Popup confirmation for renaming plants, function Checks if target of event is rp-button
    document.getElementById("plantList").addEventListener("click", async function (event) {
        if (event.target.classList.contains("rp-button")) {
            console.log("Click detected on:", event.target);
            // Show popup
            document.getElementById('rp-popup').classList.remove("d-none");

            const confirmed = await waitForConfirmation_rp();

            if (confirmed) {
                console.log("User confirmed action!");
                const plantName = document.getElementById("plantName").value;

                const data = {
                    plant_name: plantName != "" ? plantName : null
                }

                const callbackForRenamePlant = (responseStatus, responseData) => {
                    console.log("responseStatus:", responseStatus);
                    console.log("responseData:", responseData);

                    if (responseStatus == 200) {
                        // Sends success message
                        showAlert(responseData.message);
                    } else {
                        // Show message with error code
                        showAlert(responseData.message, responseStatus);
                    }
                }

                // Update Tier of Plant
                fetchMethod(currentUrl + `/api/plant/${event.target.value}`, callbackForRenamePlant, 'PUT', data, token);
            } else {
                console.log("User canceled action.");
            }

            // Hide popup after confirmation/cancellation
            document.getElementById('rp-popup').classList.add("d-none");
        }
    });

    // Function that awaits confirmation from user
    function waitForConfirmation_rp() {
        return new Promise((resolve) => {
            const confirmBtn = document.getElementById('rp-confirm');
            const cancelBtn = document.getElementById('rp-popup-close');

            confirmBtn.addEventListener("click", () => resolve(true), { once: true });

            cancelBtn.addEventListener("click", () => resolve(false), { once: true });
        });
    }
});