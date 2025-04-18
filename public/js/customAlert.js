// Function to show alert
function showAlert(message, errCode = null, results = null) {
    // Make alert box visible
    document.getElementById("customAlert").classList.remove("d-none");
    // Display error code only if it exists, with a button that calls closeAlert()
    document.getElementById('customAlertText').innerHTML = `
        <p class="card-title" style="font-weight: 700;">${message}</p>
        <p class="card-text">
            ${errCode ? `errCode: ${errCode}` : ""}
            ${results ? `${results}` : ""}
        </p>
        <button class="popup-close btn btn-secondary px-3" onclick="closeAlert(${errCode ? errCode : ""})">Close</button>
    `;
}
// Function to hide alert
function closeAlert(errCode = null) {
    document.getElementById("customAlert").classList.add("d-none");
}