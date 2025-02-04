jQuery(document).ready(function($){
    // Close popup
	$('.popup').on('click', function(event){
		if($(event.target).is('.popup') && $(event.target).is('#customAlert')) {
			event.preventDefault();
			$(this).addClass('d-none');
			location.reload();
		} else if($(event.target).is('.popup')) {
			event.preventDefault();
			$(this).addClass('d-none');
		}
    });
});