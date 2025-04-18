document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    // If token exists GET challenges with checking the token will be run
    // If token does not exist, simpler GET challenges will be run that does not check token
    if(token) {
        // Callback function callbackForAllChallenges to handle the response when fetching the user information from the server
        const callbackForAllChallenges = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);

            const challengesList = document.getElementById('challengesList'); // Finds div element with id challengesList

            // forEach loops through each challenge in responseData
            responseData.forEach((challenge) => {
                const displayItem = document.createElement("div"); // Creates HTML element to hold data
                displayItem.className =
                    "col-xl-4 col-lg-6 col-md-6 col-sm-12 col-xs-12 p-3"
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
                                ${challenge.ownership ? `
                                <button class="btn btn-secondary ec-button" value="${challenge.challenge_id}">Edit</button>` : ""}
                            </div>
                        </div>
                    </div>
                `;
                // Appends displayItem so all elements can be displayed together
                challengesList.appendChild(displayItem);
            });
        };
        // GET challenges with relation to userid (check ownership)
        fetchMethod(currentUrl + `/api/users/challenges/`, callbackForAllChallenges, "GET", null, token);
    } else {
        // Callback function callbackForAllChallenges to handle the response when fetching the user information from the server
        const callbackForAllChallenges = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);

            const challengesList = document.getElementById('challengesList'); // Finds div element with id challengesList

            // forEach loops through each challenge in responseData
            responseData.forEach((challenges) => {
                const displayItem = document.createElement("div"); // Creates HTML element to hold data
                displayItem.className =
                    "col-xl-4 col-lg-6 col-md-6 col-sm-12 col-xs-12 p-3"
                displayItem.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                        <h6>Challenge: ${challenges.challenge}</h6>
                            <p class="card-text">
                                Challenge ID: ${challenges.challenge_id} <br/>
                                Creator ID: ${challenges.creator_id} <br/>
                                Skillpoints awarded: ${challenges.skillpoints} <br/>
                            </p>
                            <p>You must be logged in to enter a Completion log</p>
                        </div>
                    </div>
                `;
                // Appends displayItem so all elements can be displayed together
                challengesList.appendChild(displayItem);
            });
        };
        // Fetch GET /challenges
        fetchMethod(currentUrl + `/api/challenges/`, callbackForAllChallenges);
    }


    
    // COMPLETE CHALLENGES
    // Popup confirmation for completing challenges, function Checks if target of event is cc-button
    document.getElementById("challengesList").addEventListener("click", async function (event) {
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
    document.getElementById("challengesList").addEventListener("click", async function (event) {
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

                // Update Tier of Plant
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