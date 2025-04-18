document.addEventListener("DOMContentLoaded", function () {
    url = new URL(document.URL);
    const urlParams = url.searchParams;
    const gardenId = urlParams.get("garden_id");
    const token = localStorage.getItem("token");
    
    // GET GARDEN BY GARDENID
    // If token exists GET garden by id with checking of token will be run
    // If token does not exist, simpler GET garden by id will be run that does not check token
    if(token) {
        // Callback function callbackForAllGardens to handle the response when fetching the user information from the server
        const callbackForGardenInfo = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);

            const gardenInfo = document.getElementById('gardenInfo'); // Finds div element with id gardenInfo

            if (responseData.resting && responseData.ownership) {
                gardenInfo.innerHTML = `
                <div class="card my-3">
                    <div class="card-body">
                        <div class="py-3" id="gardenInfoText">
                            <h2 class="card-title">${responseData.garden_name}</h2>
                            <p class="card-text">
                                Garden ID: ${responseData.garden_id} <br/>
                                Plant Count: ${responseData.plant_count} <br/>
                                Owner ID: ${responseData.owner_id}
                            </p>
                        </div>
                        <p><strong>User is resting!</strong></p>
                    </div>
                </div>
                `;
            } else if (responseStatus == 200) {
                gardenInfo.innerHTML = `
                <div class="card my-3">
                    <div class="card-body">
                        <div class="py-3" id="gardenInfoText">
                            <h2 class="card-title">${responseData.garden_name}</h2>
                            <p class="card-text">
                                Garden ID: ${responseData.garden_id} <br/>
                                Plant Count: ${responseData.plant_count}
                            </p>
                        </div>
                        ${responseData.ownership ? `
                        <div class="card-buttons">
                            <button class="btn btn-success pp-button" value="${responseData.garden_id}">Plant a Plant (-${responseData.energy_deduction} energy)</button>
                        </div>` : `<p>Owner ID: ${responseData.owner_id}</p>`}
                    </div>
                </div>
                `;     
            } else if (responseStatus == 404) { // Status 404
                userInfo.innerHTML = `${responseData.message}`;
            }
        };
        // Fetch GET /garden/:garden_id/user
        fetchMethod(currentUrl + `/api/garden/${gardenId}/user`, callbackForGardenInfo, "GET", null, token);
    } else {
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
                        <div class="py-3" id="gardenInfoText">
                            <h2 class="card-title">${responseData.garden_name}</h2>
                            <p class="card-text">
                                Garden ID: ${responseData.garden_id} <br/>
                                Plant Count: ${responseData.plant_count}
                            </p>
                        </div>
                        <p>Owner ID: ${responseData.owner_id}</p>
                    </div>
                </div>
            `;
        };
        // Fetch GET /garden/:garden_id
        fetchMethod(currentUrl + `/api/garden/${gardenId}`, callbackForGardenInfo);
    }


    // GET PLANTS BY GARDENID
    // If token exists GET plants by garden with checking of token will be run
    // If token does not exist, simpler GET plants by garden will be run that does not check token
    if (token) {
        // Callback function callbackForPlants to handle the response when fetching the user information from the server
        const callbackForPlants = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);

            if (responseData[0].resting) { 
                const plantList = document.getElementById('plantList'); // Finds div element with id gardenList

                responseData.forEach((plant) => {
                const displayItem = document.createElement("div"); // Creates HTML element to hold data
                displayItem.className =
                    "col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 p-3"
                displayItem.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-title" id="plant${plant.plant_id}PlantName">${plant.plant_name}</h6>
                            <p class="card-text">
                                <div>Plant ID: ${plant.plant_id}</div>
                                <div id="plant${plant.plant_id}TierInfo">Tier: ${plant.tier_name} (${plant.tier_num})</div>
                            </p>
                        </div>
                    </div>
                `;
                // Only creates buttons when plant belongs to user, done through retrieving owner_id from SQL

                // Appends displayItem so all elements can be displayed together
                plantList.appendChild(displayItem);
                });
            } else if (responseStatus == 200) {
                const plantList = document.getElementById('plantList'); // Finds div element with id gardenList

                responseData.forEach((plant) => {
                    const displayItem = document.createElement("div"); // Creates HTML element to hold data
                    displayItem.className =
                        "col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 p-3"
                    displayItem.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-title" id="plant${plant.plant_id}PlantName">${plant.plant_name}</h6>
                                <p class="card-text">
                                    <div>Plant ID: ${plant.plant_id}</div>
                                    <div id="plant${plant.plant_id}TierInfo">Tier: ${plant.tier_name} (${plant.tier_num})</div>
                                </p>
                                ${plant.ownership ? 
                                `<div class="card-buttons">
                                    <button class="btn btn-success wp-button" value=${plant.plant_id}>Water Plant</br>(Tier Up)</br>-${plant.energy_deduction} energy</button>
                                    <button class="btn btn-secondary rp-button" value=${plant.plant_id}>Rename</button>
                                </div>` : ""}
                            </div>
                        </div>
                    `;
                    // Only creates buttons when plant belongs to user, done through retrieving owner_id from SQL
    
                    // Appends displayItem so all elements can be displayed together
                    plantList.appendChild(displayItem);
                });
            }
        };
        // Fetch GET /garden/:garden_id/plants
        fetchMethod(currentUrl + `/api/garden/${gardenId}/plants/user`, callbackForPlants, "GET", null, token);
    } else {
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
                            <h6 class="card-title" id="plant${plant.plant_id}PlantName">${plant.plant_name}</h6>
                            <p class="card-text">
                                <div>Plant ID: ${plant.plant_id}</div>
                                <div id="plant${plant.plant_id}TierInfo">Tier: ${plant.tier_name} (${plant.tier_num})</div>
                            </p>
                        </div>
                    </div>
                `;

                // Appends displayItem so all elements can be displayed together
                plantList.appendChild(displayItem);
            });
        };
        // Fetch GET /garden/:garden_id/plants
        fetchMethod(currentUrl + `/api/garden/${gardenId}/plants`, callbackForPlants);
    }



    // CREATE/PLANT PLANTS
    // Popup confirmation for planting plants, function Checks if target of event is pp-button
    document.getElementById("gardenInfo").addEventListener("click", async function (event) {
        if (event.target.classList.contains("pp-button")) {
            console.log("Click detected on:", event.target);
            // Show popup
            document.getElementById('pp-popup').classList.remove("d-none");

            const confirmed = await waitForConfirmation_pp();

            if (confirmed) {
                console.log("User confirmed action!");
                const plantName = document.getElementById("newPlantName").value;

                const data = {
                    plant_name: plantName != "" ? plantName : null,
                    garden_id: event.target.value
                }

                const callbackForCreatePlant = (responseStatus, responseData) => {
                    console.log("responseStatus:", responseStatus);
                    console.log("responseData:", responseData);

                    if (responseStatus == 201) {
                        const gardenInfoText = document.getElementById('gardenInfoText'); // Finds div element with id gardenInfoText
                        gardenInfoText.innerHTML = `
                            <h2 class="card-title">${responseData.garden_name}</h2>
                            <p class="card-text">
                                Garden ID: ${responseData.garden_id} <br/>
                                Plant Count: ${responseData.plant_count}
                            </p>
                        `;

                        const plantList = document.getElementById('plantList');

                        const displayItem = document.createElement("div"); // Creates HTML element to hold data
                        displayItem.className =
                            "col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 p-3"
                        displayItem.innerHTML = `
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title" id="plant${responseData.plant_id}PlantName">${responseData.plant_name}</h6>
                                    <p class="card-text">
                                        <div>Plant ID: ${responseData.plant_id}</div>
                                        <div id="plant${responseData.plant_id}TierInfo">Tier: ${responseData.tier_name} (${responseData.tier_num})</div>
                                    </p>
                                    ${responseData.ownership ? 
                                    `<div class="card-buttons">
                                        <button class="btn btn-success wp-button" value=${responseData.plant_id}>Water Plant</br>(Tier Up)</button>
                                        <button class="btn btn-secondary rp-button" value=${responseData.plant_id}>Rename</button>
                                    </div>` : ""}
                                </div>
                            </div>
                        `;
                        plantList.appendChild(displayItem);
                        // Send success message
                        showAlert(responseData.message, null, responseData.energy);
                    } else {
                        // Show message with error code
                        showAlert(responseData.message, responseStatus);
                    }
                }

                // POST Create a Plant
                fetchMethod(currentUrl + `/api/plant/`, callbackForCreatePlant, 'POST', data, token);
            } else {
                console.log("User canceled action.");
            }

            // Hide popup after confirmation/cancellation
            document.getElementById('pp-popup').classList.add("d-none");
            document.getElementById("pp-form").reset();
        }
    });
    
    // Function that awaits confirmation from user
    function waitForConfirmation_pp() {
        return new Promise((resolve) => {
            const confirmBtn = document.getElementById('pp-confirm');
            const cancelBtn = document.getElementById('pp-popup-close');
            // Prevent page reload from form submission/integrate form submission with confirmation
            document.getElementById("pp-form").addEventListener("submit", function (event) {
                event.preventDefault(); 
                resolve(true), { once: true }
            });

            confirmBtn.addEventListener("click", () => resolve(true), { once: true });

            cancelBtn.addEventListener("click", () => {
                resolve(false), { once: true }
                document.getElementById("pp-form").reset()
            });
        });
    }



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
                const plantId = event.target.value

                const callbackForWaterPlant = (responseStatus, responseData) => {
                    console.log("responseStatus:", responseStatus);
                    console.log("responseData:", responseData);

                    if (responseStatus == 200) { 
                        const plantIdTierInfo = document.getElementById(`plant${plantId}TierInfo`);

                        plantIdTierInfo.innerHTML = `
                            Tier: ${responseData.tier_name} (${responseData.tier_num})
                        `;

                        // Sends success message
                        showAlert(responseData.message, null, responseData.energy);
                    } else {
                        // Show message with error code
                        showAlert(responseData.message, responseStatus);
                    }
                }

                // Update Tier of Plant
                fetchMethod(currentUrl + `/api/plant/${plantId}/water`, callbackForWaterPlant, 'PUT', null, token);
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
                const plantId = event.target.value
                const plantName = document.getElementById("renamePlantName").value;

                const data = {
                    plant_name: plantName != "" ? plantName : null
                }

                const callbackForRenamePlant = (responseStatus, responseData) => {
                    console.log("responseStatus:", responseStatus);
                    console.log("responseData:", responseData);

                    if (responseStatus == 200) {
                        const plantIdPlantName = document.getElementById(`plant${plantId}PlantName`);

                        plantIdPlantName.innerHTML = `
                            ${responseData.plant_name}
                        `;

                        // Sends success message
                        showAlert(responseData.message);
                    } else {
                        // Show message with error code
                        showAlert(responseData.message, responseStatus);
                    }
                }

                // Update Tier of Plant
                fetchMethod(currentUrl + `/api/plant/${plantId}`, callbackForRenamePlant, 'PUT', data, token);
            } else {
                console.log("User canceled action.");
            }

            // Hide popup after confirmation/cancellation
            document.getElementById('rp-popup').classList.add("d-none");
            document.getElementById("rp-form").reset();
        }
    });

    // Function that awaits confirmation from user
    function waitForConfirmation_rp() {
        return new Promise((resolve) => {
            const confirmBtn = document.getElementById('rp-confirm');
            const cancelBtn = document.getElementById('rp-popup-close');
            // Prevent page reload from form submission/integrate form submission with confirmation
            document.getElementById("rp-form").addEventListener("submit", function (event) {
                event.preventDefault(); 
                resolve(true), { once: true }
            });

            confirmBtn.addEventListener("click", () => resolve(true), { once: true });

            cancelBtn.addEventListener("click", () => {
                resolve(false), { once: true }
                document.getElementById("rp-form").reset()
            });
        });
    }
});