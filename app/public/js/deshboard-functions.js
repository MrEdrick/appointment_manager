$(document).ready(function($){  
$(window).resize(function(event){
	if (PhaserInput.KeyboardOpen == true) {
		return;
	}
});

    $('#content-deshboard-1').load('./app/html/wallpaper.html');
    
    $('#home').click(function() {
        location.reload(true);
    });

    $('#appointments').click(function() {
    	$('#content-deshboard-1').load('./app/html/list-appointments.ejs');
	});

    $('#patients').click(function() {
    	$('#content-deshboard-1').load('./app/html/list-patients.html');
	});

    $('#doctors').click(function() {
    	$('#content-deshboard-1').load('./app/html/list-doctors.html');
    });	
    
});
