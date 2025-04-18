document.addEventListener("DOMContentLoaded", function () {
    const reviewForm = document.getElementById("reviewForm");

    const warningCard = document.getElementById("warningCard");
    const warningText = document.getElementById("warningText");
    const successCard = document.getElementById("successCard");
    const successText = document.getElementById("successText");
    
    const token = localStorage.getItem("token");

    // Callback that handles response data when fetching challenges for option select
    const callbackForAllChallenges = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        
        if (responseStatus != 200) {
            alert(responseData.message + ` (there are no challenges in database)`);
            location.reload()
        } else {
            // Insert selection of challenges in form
            const challengeSelect = document.getElementById("challengeSelect");

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
    // Gets all challenges
    fetchMethod(currentUrl + "/api/challenges", callbackForAllChallenges);

    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedRating = document.querySelector('input[name="rating"]:checked');
        const selectedChallenge = document.getElementById('challengeSelect').value

        if (localStorage.token) {
            if (selectedRating) {
                if (selectedChallenge) {
                    // If user is logged in, rating reviewAmt and challenge selected, then proceed
                    const reviewAmt = selectedRating.value;
                    const challengeId = selectedChallenge
                    const notes = document.getElementById("notes").value;

                    console.log("Review successful");
                    warningCard.classList.add("d-none");
            
                    const data = {
                        review_amt: reviewAmt,
                        challenge_id: challengeId,
                        notes: notes
                    };
            
                    const callback = (responseStatus, responseData) => {
                        console.log("responseStatus:", responseStatus);
                        console.log("responseData:", responseData);
                        if (responseStatus != 201) {
                            warningCard.classList.remove("d-none");
                            warningText.innerText = responseData.message;
                        }
                    };

                    fetchMethod(currentUrl + "/api/review", callback, "POST", data, token);

                    // Reset the form fields
                    reviewForm.reset();

                    // Show success text
                    warningCard.classList.add("d-none");
                    successCard.classList.remove("d-none");
                    successText.innerText = "Review submitted!";
                } else {
                    // If challenge is not selected
                    successCard.classList.add("d-none");
                    warningCard.classList.remove("d-none");
                    warningText.innerText = "Select a Challenge";
                    // remove warning card after 4.5s
                    setTimeout(() => {
                        warningCard.classList.add("d-none");
                    }, 4500);
                }
            } else {
                // If review amount is not selected
                successCard.classList.add("d-none");
                warningCard.classList.remove("d-none");
                warningText.innerText = "Select a Rating";
                // remove warning card after 4.5s
                setTimeout(() => {
                    warningCard.classList.add("d-none");
                }, 4500);
            }
        } else {
            successCard.classList.add("d-none");
            warningCard.classList.remove("d-none");
            warningText.innerText = "You must be logged in to send a review";
        } 
    })
});