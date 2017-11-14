"use_strict";

jQuery(document).ready(function() {

    var scanner = null;
    var activeCameraId = null;
    var cameras = [];
    var scans = [];


    /*
        Fullscreen background
    */
    $.backstretch("assets/img/backgrounds/1.jpg");
    
    $('#top-navbar-1').on('shown.bs.collapse', function(){
    	$.backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function(){
    	$.backstretch("resize");
    });



    
    /*
        Form
    */
    $('#btn_start').on('click', function() {

        $('#btn_start').css('display','None');
        $('.registration-form fieldset:first-child').fadeIn('slow');
        start_camera();

    });

    // $('.registration-form fieldset:first-child').fadeIn('slow');
    
    $('.registration-form input[type="text"], .registration-form input[type="password"], .registration-form textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    
    // next step
    $('.registration-form .btn-next').on('click', function() {
    	var parent_fieldset = $(this).parents('fieldset');

        var button_id = $(this).attr("id");

        if(button_id == "finish_survey"){
            parent_fieldset.fadeOut(400, function() {
                $(this).next().fadeIn();
            });

            $('#btn_start').css('display','');
        }
        else{
            var selected_option = parent_fieldset.find("input[type='radio']:checked").val();

            if(selected_option){
                parent_fieldset.find('.q_error').text("");
                parent_fieldset.fadeOut(400, function() {
                    $(this).next().fadeIn();
                });
            }
            else{
                parent_fieldset.find('.q_error').text("No option selected !");
            }
        }

    });
    
    // previous step
    $('.registration-form .btn-previous').on('click', function() {
    	$(this).parents('fieldset').fadeOut(400, function() {
    		$(this).prev().fadeIn();
    	});
    });
    
    // submit
    $('.registration-form').on('submit', function(e) {
    	
    	$(this).find('input[type="text"], input[type="password"], textarea').each(function() {
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	
    });


    function start_camera(){

        scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
        scanner.addListener('scan', function (content) {
            console.log(content);
            var parsed_content = parse_qr_code(content);
            //login(parsed_content);

            $('fieldset[style*="display: block"]').fadeOut(400, function() {
                $('.registration-form fieldset:nth-child(2)').fadeIn('slow');
                $("#youtube_video")[0].src += "?autoplay=1";
            });

        });
        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                scanner.start(cameras[0]);
            } else {
                $('.qr_error').text("No camera found !");
            }
        }).catch(function (e) {
            console.error(e);
        });

	}

	function parse_qr_code(qr_string){
        qr_string = qr_string.split("&");
        username = qr_string[0].split("=")[1];
        password = qr_string[1].split("=")[1];
        return {'username':username,'password':password,'action':'login'}
	}

    //function to login
    function login(qr_json){

        $.ajax({
            type: "POST",
            url: "/qr/php/main.php",
            dataType: 'json',
            async: false,
            data: qr_json,
            success: function (response){
                if(!response['success']){
                    $('.qr_error').text("");
                    //window.location.href = "/qr/dashboard.php";
                }
                else{
                    $('.qr_error').text("Invalid QR");
                }
            },
            error: function (e){
                console.log("Error ",e);
                $('.qr_error').text("Invalid QR");
            }
        });
    }
    
    
});
