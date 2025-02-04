document.addEventListener("DOMContentLoaded", function () {
    const reviewForm = document.getElementById("reviewForm");
    const warningCard = document.getElementById("warningCard");
    const warningText = document.getElementById("warningText");
    const successCard = document.getElementById("successCard");
    const successText = document.getElementById("successText");
    const token = localStorage.token

    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedRating = document.querySelector('input[name="rating"]:checked');

        if (localStorage.token) {
            if (selectedRating) {
                // If user is logged in and rating reviewAmt selected, then proceed
                const reviewAmt = selectedRating.value
                const notes = document.getElementById("notes").value;

                console.log("Review successful");
                console.log("reviewAmt:", reviewAmt);
                console.log("notes:", notes);
                warningCard.classList.add("d-none");
        
                const data = {
                    review_amt: reviewAmt,
                    notes: notes,
                };
        
                const callback = (responseStatus, responseData) => {
                    console.log("responseStatus:", responseStatus);
                    console.log("responseData:", responseData);
                    if (!responseStatus == 200) {
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