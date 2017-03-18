$(function () {
	
	// register
	$('#register-form').submit(function (event) {
		var password = $('#password').val();
		var confirm = $('#confirm').val();
		
		if (password !== confirm) {
			$('.trigger-register-message').removeClass('hide');
			$('.trigger-register-message').html("Password and confirm fiels need to be identical.");
			return false;
		}
		
		$('.trigger-register-message').addClass('hide');
		
		return true;
	});
});