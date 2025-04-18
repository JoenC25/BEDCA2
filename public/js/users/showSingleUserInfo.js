document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    // If token does not exist redirect user back to home page
   if (!token) {
        alert("Not authorized, please log in.");
        window.location.href = "index.html";
    }

    // GET single user by userid
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
                        <div id="userEnergy">Energy: ${responseData.energy}</div>
                    </p>
                    <div class="card-buttons" id="userInfo-buttons"></div>
                </div>
            </div>
        `;

        localStorage.setItem("username", responseData.username);
    };
    // GET single user by userid
    fetchMethod(currentUrl + `/api/users/singleUser`, callbackForUserInfo, "GET", null, token);



    // GET gardens by userid
    // Callback function callbackForAllGardens to handle the response when fetching the user information from the server
    const callbackForAllGardens = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        if (responseStatus == 200) {
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
        } else {
            gardenList.innerHTML = `<p id="gardenNone">User has no gardens</p>`;
        }
    };
    // GET gardens by userid
    fetchMethod(currentUrl + `/api/users/singleUser/gardens`, callbackForAllGardens, 'GET', null, token);



    // GET challenges by userid
    // Callback function callbackForAllCompletion to handle the response when fetching the user information from the server
    const callbackForAllChallenges = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        if (responseStatus == 200) {
            const challengeList = document.getElementById('challengeList'); // Finds div element with id completionList

            // forEach loops through each completion in responseData
            responseData.forEach((challenge) => {
                const displayItem = document.createElement("div"); // Creates HTML element to hold data
                displayItem.id = `challenge${challenge.challenge_id}Card`
                displayItem.className =
                    "col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12 p-3"
                displayItem.innerHTML = `
                    <div class="card">
                            <div class="card-body" id="challenge${challenge.challenge_id}Info">
                            <h6>Challenge: ${challenge.challenge}</h6>
                            <p class="card-text">
                                Challenge ID: ${challenge.challenge_id} <br/>
                                Creator ID: ${challenge.creator_id} <br/>
                                Skillpoints awarded: ${challenge.skillpoints} <br/>
                            </p>
                            <div class="card-buttons">
                                <button class="btn btn-success cc-button" value="${challenge.challenge_id}">Enter Log</button>
                                <button class="btn btn-secondary ec-button" value="${challenge.challenge_id}">Edit</button>
                            </div>
                        </div>
                    </div>
                `;
                // Appends displayItem so all elements can be displayed together
                challengeList.appendChild(displayItem);
            });
        } else {
            document.getElementById("challengeList").innerHTML = `<p id="challengesNone">User has no challenges</p>`;
            document.getElementById("dc-button").classList.add("d-none");
        }
        
    };
    // Fetch GET /users/singleUser/challenges/
    fetchMethod(currentUrl + `/api/users/singleUser/challenges/`, callbackForAllChallenges, "GET", null, token);



    // GET completions by userid
    // Callback function callbackForAllCompletion to handle the response when fetching the user information from the server
    const callbackForAllCompletion = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const completionList = document.getElementById('completionList'); // Finds div element with id completionList

        // forEach loops through each completion in responseData
        responseData.forEach((completion) => {
            const displayItem = document.createElement("div"); // Creates HTML element to hold data
            displayItem.className =
                "col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12 p-3"
            displayItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h6>Completion ID: ${completion.complete_id}</h6>
                        <p class="card-text">
                            Challenge: ${completion.challenge} <br/>
                            Challenge ID: ${completion.challenge_id} <br/>
                            User ID: ${completion.user_id} <br/>
                            Completed: ${completion.completed} <br/>
                            Notes: ${completion.notes?completion.notes:""}
                        </p>
                        <div>Date: ${completion.creation_date}</div>
                    </div>
                </div>
            `;
            // Appends displayItem so all elements can be displayed together
            completionList.appendChild(displayItem);
        });
    };
    // Fetch GET /users/singleUser/completions/
    fetchMethod(currentUrl + `/api/users/singleUser/completions/`, callbackForAllCompletion, "GET", null, token);



    // GET REST info
    // Callback function callbackForRest to handle the response when fetching the user information from the server
    const callbackForRest = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const userInfoButtons = document.getElementById('userInfo-buttons'); // Finds div element with id userInfo-buttons
        const userEnergy =  document.getElementById('userEnergy'); // Finds div element with id userEnergy
        if (responseStatus == 409) {
            userInfoButtons.innerHTML = `
                ${responseData.message}
            `;
            if (responseData.resting) {
                userEnergy.innerHTML = ``;
            }
        } else if (responseStatus == 404) {
            userInfoButtons.innerHTML = `
                <button class="btn btn-success cr-button">Rest!</button>
            `;
        } else {
            userInfoButtons.innerHTML = `
                <button class="btn btn-success cr-button">Rest!</button>
            `;
        }
    };
    // Fetch GET /users/singleUser/rest/
    fetchMethod(currentUrl + `/api/users/singleUser/rest/`, callbackForRest, "GET", null, token);





    // REST USER / Create rest
    // Popup confirmation for planting plants, function Checks if target of event is pp-button
    document.getElementById("userInfo").addEventListener("click", async function (event) {
        if (event.target.classList.contains("cr-button")) {
            console.log("Click detected on:", event.target);
            // Show popup
            document.getElementById('cr-popup').classList.remove("d-none");

            const confirmed = await waitForConfirmation_cr();

            if (confirmed) {
                console.log("User confirmed action!");

                const callbackForCreateRest = (responseStatus, responseData) => {
                    console.log("responseStatus:", responseStatus);
                    console.log("responseData:", responseData);

                    if (responseStatus == 201) {
                        const userInfoButtons = document.getElementById('userInfo-buttons'); // Finds div element with id userInfo-buttons
                        const userEnergy =  document.getElementById('userEnergy'); // Finds div element with id userEnergy

                        userInfoButtons.innerHTML = `
                            "User is resting"
                        `;
                        userEnergy.innerHTML = ``;

                        // Send success message
                        showAlert(responseData.message, null);
                    } else {
                        // Show message with error code
                        showAlert(responseData.message, responseStatus);
                    }
                }

                // POST Create a Rest entry
                fetchMethod(currentUrl + `/api/users/singleUser/rest`, callbackForCreateRest, 'POST', null, token);
            } else {
                console.log("User canceled action.");
            }

            // Hide popup after confirmation/cancellation
            document.getElementById('cr-popup').classList.add("d-none");  
        }
    });
    
    // Function that awaits confirmation from user
    function waitForConfirmation_cr() {
        return new Promise((resolve) => {
            const confirmBtn = document.getElementById('cr-confirm');
            const cancelBtn = document.getElementById('cr-popup-close');

            confirmBtn.addEventListener("click", () => resolve(true), { once: true });

            cancelBtn.addEventListener("click", () => resolve(false), { once: true });
        });
    }



    // CREATE/BUILD GARDEN
    // Popup confirmation for building garden, function Checks if target of event is buildg-button
    document.getElementById("buildg-button").addEventListener("click", async function (event) {
        console.log("Click detected on:", event.target);
        // Show popup
        document.getElementById('buildg-popup').classList.remove("d-none");

        const confirmed = await waitForConfirmation_buildg();

        if (confirmed) {
            console.log("User confirmed action!");
            const gardenName = document.getElementById("gardenName").value;

            const data = {
                garden_name: gardenName != "" ? gardenName : null,
            }

            const callbackForCreatePlant = (responseStatus, responseData) => {
                console.log("responseStatus:", responseStatus);
                console.log("responseData:", responseData);

                if (responseStatus == 201) {
                    const gardenList = document.getElementById('gardenList');

                    const displayItem = document.createElement("div"); // Creates HTML element to hold data
                    displayItem.className =
                        "col-xl-4 col-lg-6 col-md-6 col-sm-12 col-xs-12 p-3"
                    displayItem.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-title">${responseData.garden_name}</h6>
                                <p class="card-text">
                                    Garden ID: ${responseData.garden_id} <br/>
                                    Plant Count: ${responseData.plant_count} <br/>
                                </p>
                                <a href="singleGardenInfo.html?garden_id=${responseData.garden_id}" class="btn btn-success">View</a>
                            </div>
                        </div>
                    `;
                    // Appends displayItem so all elements can be displayed together
                    gardenList.appendChild(displayItem);

                    if (gardenList.children.length > 0) {
                        document.getElementById("gardenNone").innerHTML = ``;
                    }
                    // Sends success message
                    showAlert(responseData.message);
                } else {
                    // Show message with error code
                    showAlert(responseData.message, responseStatus);
                }
            }

            // POST Create a Plant
            fetchMethod(currentUrl + `/api/garden/`, callbackForCreatePlant, 'POST', data, token);
        } else {
            console.log("User canceled action.");
        }
        // Hide popup after confirmation/cancellation
        document.getElementById('buildg-popup').classList.add("d-none");
        document.getElementById("buildg-form").reset();
    });

    // Function that awaits confirmation from user
    function waitForConfirmation_buildg() {
        return new Promise((resolve) => {
            const confirmBtn = document.getElementById('buildg-confirm');
            const cancelBtn = document.getElementById('buildg-popup-close');
            // Prevent page reload from form submission/integrate form submission with confirmation
            document.getElementById("buildg-form").addEventListener("submit", function (event) {
                event.preventDefault(); 
                resolve(true), { once: true }
                document.getElementById("buildg-form").reset()
            });

            confirmBtn.addEventListener("click", () => resolve(true), { once: true });
            cancelBtn.addEventListener("click", () => resolve(false), { once: true });
        });
    }



    // CREATE CHALLENGE
    // Popup confirmation for creating challenge, function Checks if target of event is createc-button
    document.getElementById("createc-button").addEventListener("click", async function (event) {
        console.log("Click detected on:", event.target);
        // Show popup
        document.getElementById('createc-popup').classList.remove("d-none");

        const confirmed = await waitForConfirmation_createc();

        if (confirmed) {
            console.log("User confirmed action!");
            const challengeName = document.getElementById("newChallengeName").value;
            const skillpointsAwarded = document.getElementById("newSkillpointsAwarded").value;

            const data = {
                challenge: challengeName != "" ? challengeName : null,
                skillpoints: skillpointsAwarded != "" ? skillpointsAwarded : null
            }

            const callbackForCreateChallenge = (responseStatus, responseData) => {
                console.log("responseStatus:", responseStatus);
                console.log("responseData:", responseData);
                
                if (responseStatus == 201) {
                    const challengeList = document.getElementById('challengeList');

                    const displayItem = document.createElement("div"); // Creates HTML element to hold data
                    displayItem.id = `challenge${responseData.challenge_id}Card`
                    displayItem.className =
                        "col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12 p-3"
                    displayItem.innerHTML = `
                    <div class="card" id="challenge${responseData.challenge_id}Card">
                        <div class="card-body" id="challenge${responseData.challenge_id}Info">
                            <h6>Challenge: ${responseData.challenge}</h6>
                            <p class="card-text">
                                Challenge ID: ${responseData.challenge_id} <br/>
                                Creator ID: ${responseData.creator_id} <br/>
                                Skillpoints awarded: ${responseData.skillpoints} <br/>
                            </p>
                            <div class="card-buttons">
                                <button class="btn btn-success cc-button" value="${responseData.challenge_id}">Enter Log</button>
                                <button class="btn btn-secondary ec-button" value="${responseData.challenge_id}">Edit</button>
                            </div>
                        </div>
                    <div/>
                    `;
                    // Appends displayItem so all elements can be displayed together
                    challengeList.appendChild(displayItem);

                    if (challengeList.children.length > 0) {
                        document.getElementById("challengesNone").innerHTML = ``;
                        document.getElementById("dc-button").classList.remove("d-none");
                    }

                    // Sends success message
                    showAlert(responseData.message);
                } else {
                    // Show message with error code
                    showAlert(responseData.message, responseStatus);
                }
            }

            // POST Create a Challenge
            fetchMethod(currentUrl + `/api/challenges/`, callbackForCreateChallenge, 'POST', data, token);
        } else {
            console.log("User canceled action.");
        }
        // Hide popup after confirmation/cancellation
        document.getElementById('createc-popup').classList.add("d-none");
        document.getElementById("createc-form").reset();
    });

    // Function that awaits confirmation from user
    function waitForConfirmation_createc() {
        return new Promise((resolve) => {
            const confirmBtn = document.getElementById('createc-confirm');
            const cancelBtn = document.getElementById('createc-popup-close');
            // Prevent page reload from form submission/integrate form submission with confirmation
            document.getElementById("createc-form").addEventListener("submit", function (event) {
                event.preventDefault(); 
                resolve(true), { once: true }
                document.getElementById("createc-form").reset()
            });

            confirmBtn.addEventListener("click", () => resolve(true), { once: true });
            cancelBtn.addEventListener("click", () => resolve(false), { once: true });
        });
    }



    // REMOVE CHALLENGE
    // Popup confirmation for creating challenge, function Checks if target of event is dc-button
    document.getElementById("dc-button").addEventListener("click", async function (event) {
        console.log("Click detected on:", event.target);
        // Show popup
        document.getElementById('dc-popup').classList.remove("d-none");

        // Callback that handles response data when fetching challenges for option select
        const callbackForChallengesByUserid = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
            
            if (responseStatus != 200) {
                document.getElementById("dc-button").classList.add("d-none");
            } else {
                // Insert selection of challenges in form
                const challengeSelect = document.getElementById("challengeSelect");
                challengeSelect.innerHTML = `<option selected value="">Select</option>`

                responseData.forEach((challenge) => {
                    const formSelectOption = document.createElement("option");
                    formSelectOption.value = 
                    `${challenge.challenge_id}`
                    formSelectOption.innerHTML = `
                        ${challenge.challenge_id}) ${challenge.challenge}
                    `;

                    challengeSelect.appendChild(formSelectOption);
                });
            }
        }
        // Gets all challenges by userid
        fetchMethod(currentUrl + "/api/users/singleUser/challenges", callbackForChallengesByUserid, "GET", null, token);

        const confirmed = await waitForConfirmation_dc();

        if (confirmed) {
            console.log("User confirmed action!");
            const challengeId = document.getElementById("challengeSelect").value;

            const data = {
                challenge_id: challengeId != ""? challengeId : null
            }

            const callbackForDeleteChallenge = (responseStatus, responseData) => {
                console.log("responseStatus:", responseStatus);
                console.log("responseData:", responseData);
                
                if (responseStatus == 204) {
                    const challengeCard = document.getElementById(`challenge${challengeId}Card`);
                    challengeCard.remove();
                    
                    const challengeList = document.getElementById(`challengeList`);
                    if (challengeList.children.length == 0) {
                        document.getElementById("challengeList").innerHTML = `<p id="challengesNone">User has no challenges</p>`;
                        document.getElementById("dc-button").classList.add("d-none");
                    }

                    // Sends success message
                    showAlert("Challenge removed!");
                } else {
                    // Show message with error code
                    showAlert(responseData.message, responseStatus);
                }
            }

            if (challengeId != "") {
                // DELETE a challenge
                fetchMethod(currentUrl + `/api/challenges/${challengeId}`, callbackForDeleteChallenge, 'DELETE', data, token);
            } else {
                showAlert("request body missing challenge_id (select a challenge)", "400");
            }
        } else {
            console.log("User canceled action.");
        }
        // Hide popup after confirmation/cancellation
        document.getElementById('dc-popup').classList.add("d-none");
        document.getElementById("dc-form").reset();
        document.getElementById("challengeSelect").innerHTML = ``;
    });

    // Function that awaits confirmation from user
    function waitForConfirmation_dc() {
        return new Promise((resolve) => {
            const confirmBtn = document.getElementById('dc-confirm');
            const cancelBtn = document.getElementById('dc-popup-close');
            // Prevent page reload from form submission/integrate form submission with confirmation
            document.getElementById("dc-form").addEventListener("submit", function (event) {
                event.preventDefault(); 
                resolve(true), { once: true }
                document.getElementById("dc-form").reset();
            });

            confirmBtn.addEventListener("click", () => resolve(true), { once: true });
            cancelBtn.addEventListener("click", () => resolve(false), { once: true });
        });
    }



    // COMPLETE CHALLENGES
    // Popup confirmation for completing challenges, function Checks if target of event is cc-button
    document.getElementById("challengeList").addEventListener("click", async function (event) {
        if (event.target.classList.contains("cc-button")) {
            console.log("Click detected on:", event.target);
            // Show popup
            document.getElementById('cc-popup').classList.remove("d-none");

            const confirmed = await waitForConfirmation_cc();

            if (confirmed) {
                console.log("User confirmed action!");
                const notes = document.getElementById("notes").value;
                const completed = document.getElementById("completed").checked;
                const challengeId = event.target.value;

                const data = {
                    completed: completed,
                    notes: notes != "" ? notes : null
                }

                const callbackForCompleteChallenge = (responseStatus, responseData) => {
                    console.log("responseStatus:", responseStatus);
                    console.log("responseData:", responseData);

                    if (responseStatus == 201) {
                        const completionList = document.getElementById('completionList');

                        const displayItem = document.createElement("div"); // Creates HTML element to hold data
                        displayItem.className =
                            "col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12 p-3"
                        displayItem.innerHTML = `
                            <div class="card">
                                <div class="card-body">
                                    <h6>Completion ID: ${responseData.complete_id}</h6>
                                    <p class="card-text">
                                        Challenge: ${responseData.challenge} <br/>
                                        Challenge ID: ${responseData.challenge_id} <br/>
                                        User ID: ${responseData.user_id} <br/>
                                        Completed: ${responseData.completed} <br/>
                                        Notes: ${responseData.notes?responseData.notes:""}
                                    </p>
                                    <div>Date: ${responseData.creation_date}</div>
                                </div>
                            </div>
                        `;
                        // Appends displayItem so all elements can be displayed together
                        completionList.appendChild(displayItem);

                        const resultMessage = `${responseData.leveled_up ? 
                            `User level Up! (level ${responseData.level}), Skillpoints: ${responseData.skillpoints}`
                            : `Skillpoints: ${responseData.skillpoints}` }`;
                        // Sends success message
                        showAlert(responseData.message, null, resultMessage);
                    } else {
                        // Show message with error code
                        showAlert(responseData.message, responseStatus);
                    }
                }

                // Complete challenge
                fetchMethod(currentUrl + `/api/challenges/completion/${challengeId}/`, callbackForCompleteChallenge, 'POST', data, token);
            } else {
                console.log("User canceled action.");
            }

            // Hide popup after confirmation/cancellation
            document.getElementById('cc-popup').classList.add("d-none");
        }
    });

    // Function that awaits confirmation from user
    function waitForConfirmation_cc() {
        return new Promise((resolve) => {
            const confirmBtn = document.getElementById('cc-confirm');
            const cancelBtn = document.getElementById('cc-popup-close');
            // Prevent page reload from form submission/integrate form submission with confirmation
            document.getElementById("cc-form").addEventListener("submit", function (event) {
                event.preventDefault(); 
                resolve(true), { once: true }
            });

            confirmBtn.addEventListener("click", () => resolve(true), { once: true });

            cancelBtn.addEventListener("click", () => {
                resolve(false), { once: true }
                document.getElementById("cc-form").reset()
            });
        });
    }



    // EDIT CHALLENGES
    // Popup confirmation for editing challenges, function Checks if target of event is rc-button
    document.getElementById("challengeList").addEventListener("click", async function (event) {
        if (event.target.classList.contains("ec-button")) {
            console.log("Click detected on:", event.target);
            const challengeId = event.target.value
            
            // Callback for retrieving info for single challenge (NOT a nested callback), so we can set default values for form
            const callbackForSingleChallenge = (responseStatus, responseData) => {
                console.log("responseStatus:", responseStatus);
                console.log("responseData:", responseData);

                if (responseStatus != 200) {
                    alert(responseData.message);
                    location.reload()
                } else {
                    // Set default values for form
                    document.getElementById("challengeName").value = responseData.challenge
                    document.getElementById("skillpointsAwarded").value = responseData.skillpoints
                }
            }
            // Get info of Single Challenge
            fetchMethod(currentUrl + `/api/challenges/${challengeId}`, callbackForSingleChallenge)


            // Show popup
            document.getElementById('ec-popup').classList.remove("d-none");

            const confirmed = await waitForConfirmation_ec();

            if (confirmed) {
                console.log("User confirmed action!");
                const challengeName = document.getElementById("challengeName").value;
                const skillpointsAwarded = document.getElementById("skillpointsAwarded").value;

                const data = {
                    challenge: challengeName,
                    skillpoints: skillpointsAwarded
                }

                const callbackForEditChallenge = (responseStatus, responseData) => {
                    console.log("responseStatus:", responseStatus);
                    console.log("responseData:", responseData);

                    if (responseStatus == 200) {
                        // Targets specific text that has same challenge id as button
                        const challengeChallengeIdInfo = document.getElementById(`challenge${challengeId}Info`);

                        challengeChallengeIdInfo.innerHTML = `
                            <h6>Challenge: ${responseData.challenge}</h6>
                            <p class="card-text">
                                Creator ID: ${responseData.creator_id} <br/>
                                Challenge ID: ${responseData.challenge_id} <br/>
                                Skillpoints awarded: ${responseData.skillpoints} <br/>
                            </p>
                            <div class="card-buttons">
                                <button class="btn btn-success cc-button" value="${responseData.challenge_id}">Enter Log</button>
                                <button class="btn btn-secondary ec-button" value="${responseData.challenge_id}">Edit</button>
                            </div>
                        `;

                        // Sends success message
                        showAlert(responseData.message);
                    } else {
                        // Show message with error code
                        showAlert(responseData.message, responseStatus);
                    }
                }

                // Update Challenge
                fetchMethod(currentUrl + `/api/challenges/${challengeId}`, callbackForEditChallenge, 'PUT', data, token);
            } else {
                console.log("User canceled action.");
            }

            // Hide popup after confirmation/cancellation
            document.getElementById('ec-popup').classList.add("d-none");
        }
    });

    // Function that awaits confirmation from user
    function waitForConfirmation_ec() {
        return new Promise((resolve) => {
            const confirmBtn = document.getElementById('ec-confirm');
            const cancelBtn = document.getElementById('ec-popup-close');
            // Prevent page reload from form submission/integrate form submission with confirmation
            document.getElementById("ec-form").addEventListener("submit", function (event) {
                event.preventDefault(); 
                resolve(true), { once: true }
            });

            confirmBtn.addEventListener("click", () => resolve(true), { once: true });

            cancelBtn.addEventListener("click", () => {
                resolve(false), { once: true }
                document.getElementById("ec-form").reset()
            });
        });
    }
});