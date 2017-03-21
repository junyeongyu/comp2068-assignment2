$(function () {
	
	// register
	$('#register-form').submit(function (event) {
		var password = $('#password').val();
		var confirm = $('#confirm').val();
		
		if (password !== confirm) {
			$('.trigger-register-message').removeClass('hide');
			$('.trigger-register-message').html("Password and confirm fields need to be identical.");
			return false;
		}
		
		$('.trigger-register-message').addClass('hide');
		
		return true;
	});
	
	// add/edit item for sale in saleItmes
	$('.trigger-item-back').bind('click', function (event) {
		history.back();
	});
	
	// delete item from saleItems
	$('.trigger-item-delete').bind('click', function (event) {
		if (confirm('Are you sure to delete this item?')) {
			location.href = $(this).data('href');
		}
	})
});