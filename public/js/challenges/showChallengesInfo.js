document.addEventListener("DOMContentLoaded", function () {
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
                    </div>
                </div>
            `;
            // Appends displayItem so all elements can be displayed together
            challengesList.appendChild(displayItem);
        });
    };
    // Fetch GET /challenges
    fetchMethod(currentUrl + `/api/challenges/`, callbackForAllChallenges);
});