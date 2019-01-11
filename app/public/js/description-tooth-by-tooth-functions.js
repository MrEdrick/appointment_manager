$(document).ready(function($){ 
    var html = '';

    var fillToothByToothScreen = function (toothByTooth) {
        if ((toothByTooth.ID_PATIENT_MAIN || -1) < 0) {
            return;
        };

        let xhr = new XMLHttpRequest();

        var processRequest = function () {
            if (xhr.readyState == 4) {
                var toothByTooths = $.parseJSON(xhr.responseText);

                for (i = 0; i < toothByTooths.length; i++) {
                    $('#input-tooth-' + toothByTooths[i].TOOTH_NUMBER.toString()).val(toothByTooths[i].TOOTH_DESCRIPTION);
                }

            }
        }

        xhr.onreadystatechange = processRequest;
        xhr.open('GET', '/toothByTooth/' + toothByTooth.ID_PATIENT_MAIN.toString());
        xhr.send();
    }

    var fillScreen = function () {
        let id = $('#edit-id').val();

        if ((id == 0) || (id == undefined)) {
            return;
        }

        let xhr = new XMLHttpRequest();

        xhr.onload = function () {
            if (xhr.status == 200) {
                appointments = $.parseJSON(xhr.responseText);

                if ((appointments.validation || 0) != 0) {
                    showAlert(appointments.validation);;
                    return;
                }

                if ((appointments.length || 0) == 0) {
                    return;
                }

                fillToothByToothScreen(appointments[0]);
            }
        }

        xhr.open('GET', '/appointments/id=' + id.toString());
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();
    }

    for (j = 1; j <= 2; j++) {
	if (j == 1) {
        for (i = 8; i >= 1; i--) {
            html =  '<div class="wrapper-block tooth-row">' +
                        '<div class="wrapper-inline tooth" name="tooth-' + j.toString() + i.toString() + '" id="tooth-' + j.toString() + i.toString() + '">' +
                            '<div class="wrapper-inline topic-title-edit"> ' + j.toString() + i.toString() + ' </div>' +
                            '<input class="input-edit input-text-tooth" type="text" name="input-tooth-' + j.toString() + i.toString() + '" id="input-tooth-' + j.toString() + i.toString() + '"size="49" maxlength="49">' +
                        '</div>' + 
                        '<div class="wrapper-inline tooth" name="tooth-' + (j + 2).toString() + i.toString() + '" id="tooth-' + (j + 2).toString() + i.toString() + '">' +
                            '<div class="wrapper-inline topic-title-edit"> ' + (j + 2).toString() + i.toString() + ' </div>' +
                            '<input class="input-edit input-text-tooth" type="text" name="input-tooth-' + (j + 2).toString() + i.toString() + '" id="input-tooth-' + (j + 2).toString() + i.toString() + '" size="49" maxlength="49">' +
                        '</div>' +					
                    '</div>';
    
            $('.content-description-tooth-by-tooth').append(html);
}
	} else {
        for (i = 1; i <= 8; i++) {
            html =  '<div class="wrapper-block tooth-row">' +
                        '<div class="wrapper-inline tooth" name="tooth-' + j.toString() + i.toString() + '" id="tooth-' + j.toString() + i.toString() + '">' +
                            '<div class="wrapper-inline topic-title-edit"> ' + j.toString() + i.toString() + ' </div>' +
                            '<input class="input-edit input-text-tooth" type="text" name="input-tooth-' + j.toString() + i.toString() + '" id="input-tooth-' + j.toString() + i.toString() + '"size="49" maxlength="49">' +
                        '</div>' + 
                        '<div class="wrapper-inline tooth" name="tooth-' + (j + 2).toString() + i.toString() + '" id="tooth-' + (j + 2).toString() + i.toString() + '">' +
                            '<div class="wrapper-inline topic-title-edit"> ' + (j + 2).toString() + i.toString() + ' </div>' +
                            '<input class="input-edit input-text-tooth" type="text" name="input-tooth-' + (j + 2).toString() + i.toString() + '" id="input-tooth-' + (j + 2).toString() + i.toString() + '" size="49" maxlength="49">' +
                        '</div>' +					
                    '</div>';
    
            $('.content-description-tooth-by-tooth').append(html);
	}

        }
    }

    fillScreen();
});
