jQuery(document).ready(function($){
    // Close popup
	$('.popup').on('click', function(event){
		if($(event.target).is('.popup') && $(event.target).is('#customAlert')) {
			// For the custom alert
			event.preventDefault();
			$(this).addClass('d-none');
		} else if($(event.target).is('.popup')) {
			// For normal popups
			event.preventDefault();
			console.log("User canceled action.");
			$(this).addClass('d-none');
			$(this).find('.popup-form').trigger('reset');

			document.getElementById("challengeSelect").innerHTML = ``; // Specifically for challenge select
		}
    });
});