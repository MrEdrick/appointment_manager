var appointments;

var cpfInput = $("#cpf");
var rgInput = $("#rg");
var numberCardInput = $("#number-card");

patientFilesDocuments = [];

listAgrrements = function () {
    let xhr = new XMLHttpRequest();

    var processRequest = function () {
        if (xhr.readyState == 4) {
		$('#list-agreements').find('option').remove();

            var agreements = $.parseJSON(xhr.responseText);

            for (i = 0; i < agreements.length; i++) {
                $('#list-agreements').append('<option value=' + agreements[i].ID_AGREEMENT + '>' + agreements[i].DESCRIPTION + '</option>');
            }

        }
    }

    xhr.onreadystatechange = processRequest;
    xhr.open('GET', '/agreements');
    xhr.send();
}

listRooms = function () {
    let xhr = new XMLHttpRequest();

    var processRequest = function () {
        if (xhr.readyState == 4) {
            var rooms = $.parseJSON(xhr.responseText);
		  $('#list-rooms').find('option').remove();

            for (i = 0; i < rooms.length; i++) {
                $('#list-rooms').append('<option value=' + rooms[i].ID_ROOM + '>' + rooms[i].DESCRIPTION + '</option>');
            }

        }
    }

    xhr.onreadystatechange = processRequest;
    xhr.open('GET', '/rooms');
    xhr.send();
}

listDoctors = function () {
    let xhr = new XMLHttpRequest();

    var processRequest = function () {
        if (xhr.readyState == 4) {
            var doctors = $.parseJSON(xhr.responseText);
		  $('#list-doctors').find('option').remove();

            for (i = 0; i < doctors.length; i++) {
                $('#list-doctors').append('<option value=' + doctors[i].ID_DOCTOR + '>' + doctors[i].NAME + '</option>');
            }

        }
    }

    xhr.onreadystatechange = processRequest;
    xhr.open('GET', '/doctors');
    xhr.send();
}

listAppointmentStatus = function () {
    let xhr = new XMLHttpRequest();

    var processRequest = function () {
        if (xhr.readyState == 4) {
            var appointmentStatus = $.parseJSON(xhr.responseText);
		  $('#list-appointment-status').find('option').remove();

            for (i = 0; i < appointmentStatus.length; i++) {
                $('#list-appointment-status').append('<option value=' + appointmentStatus[i].ID_APPOINTMENT_STATUS + '>' + appointmentStatus[i].DESCRIPTION + '</option>');
            }

        }
    }

    xhr.onreadystatechange = processRequest;
    xhr.open('GET', '/appointmentstatus');
    xhr.send();
}

listStates = function () {
    let xhr = new XMLHttpRequest();

    var processRequest = function () {
        if (xhr.readyState == 4) {
            var states = $.parseJSON(xhr.responseText);
		  $('#list-states').find('option').remove();
            $('#list-states').append('<option value="0">UF</option>')
            for (i = 0; i < states.length; i++) {
                $('#list-states').append('<option value=' + states[i].ID_STATE + '>' + states[i].UF + '</option>');
            }

        }
    }

    xhr.onreadystatechange = processRequest;
    xhr.open('GET', '/states');
    xhr.send();
}

listCitys = function (idState) {
    let xhr = new XMLHttpRequest();

    var processRequest = function () {
        if (xhr.readyState == 4) {
            $('#list-citys').empty();
            $('#list-citys').find('option').remove();
            var citys = $.parseJSON(xhr.responseText);

            for (i = 0; i < citys.length; i++) {
                $('#list-citys').append('<option value=' + citys[i].ID_CITY + '>' + citys[i].CITY + '</option>');
            }

        }
    }

    xhr.onreadystatechange = processRequest;
    if (idState != null) {
        xhr.open('GET', '/citys/' + idState);
    } else {
        xhr.open('GET', '/citys/' + $('#list-states').val());
    }
    xhr.send();
}


fillRoomScreen = function (appointments) {
    $('#list-rooms option')
    .removeAttr('selected')
    .filter('[value=' + String(appointments.ID_ROOM) + ']')
    .prop('selected', true)
}

fillAgreementScreen = function (appointments) {
    $('#list-agreements option')
    .removeAttr('selected')
    .filter('[value=' + String(appointments.ID_AGREEMENT) + ']')
    .prop('selected', true)
}

fillDoctorScreen = function (appointments) {
    $('#list-doctors option')
    .removeAttr('selected')
    .filter('[value=' + String(appointments.ID_DOCTOR) + ']')
    .prop('selected', true)
}

fillAppointmentstatusScreen = function (appointments) {
    $('#list-appointment-status option')
    .removeAttr('selected')
    .filter('[value=' + String(appointments.ID_APPOINTMENT_STATUS) + ']')
    .prop('selected', true)
}

fillPatientScreen = function (patients) {
    $('#id-patient').val(patients.ID_PATIENT_MAIN);
    $('#cpf').val(patients.CPF);
    $('#rg').val(patients.RG);
    $('#number-card').val(patients.NUMBER_CARD);
    $('#patient-name').val(patients.PATIENT_NAME);
    $('#profission').val(patients.PROFISSION);
    $('#email').val(patients.EMAIL);
    $('#address-code').val(patients.ADDRESS_CODE);
    $('#address').val(patients.ADDRESS);
    $('#address-number').val(patients.ADDRESS_NUMBER);
    $('#address-complement').val(patients.ADDRESS_COMPLEMENT);
    $('#district').val(patients.DISTRICT);

    $.when(listStates()).then(
        $('#list-states').val(patients.ID_STATE).prop('selected', true),
    );

    $.when(listCitys(patients.ID_STATE)).then(
        $('#list-citys').val(patients.ID_CITY).prop('selected', true)
    )

    $('#birth-date').val(moment(patients.DATE_BIRTH).format('DD/MM/YYYY'));
    $('#phone').val(patients.PHONE);
    $('#cell-phone').val(patients.CELL_PHONE);
    $('#procedure').val(patients.DESCRIPTION_PROCEDURE);
    $('#procedure-detailing').val(patients.DETAILING_PROCEDURE);
    $('#date-hour-appointment').val(moment(patients.DATE_HOUR_APPOINTMENT).format('DD/MM/YYYY HH:mm'));
}

fillPatientFiles = function (patient) {
    let xhr = new XMLHttpRequest();

    let processRequest = function () {
        if (xhr.readyState == 4) {

            let response = $.parseJSON(xhr.responseText);

            for (i = 0; i < response.length; i++) {
                let formData = new FormData;

                formData.append('type', 'update');
                formData.append('idPatientFile', response[i].ID_PATIENT_FILE);
                formData.append('file', '');
                formData.append('idPatient', response[i].ID_PATIENT);
                formData.append('description', response[i].DESCRIPTION);
                formData.append('descriptionUnique', response[i].DESCRIPTION_UNIQUE);
                formData.append('dateHourPatientFile', moment(response[i].DATE_HOUR_PATIENT_FILE).format('DD/MM/YYYY HH:mm'));
                formData.append('dateHourInsertion', moment(response[i].DATE_HOUR_INSERTION).format('DD/MM/YYYY HH:mm'));
                formData.append('state', 'saved');

                patientFilesDocuments.push(formData);
            }

            listCardsPatientsFiles();
        }
    }

    xhr.onreadystatechange = processRequest;
    xhr.open('GET', '/patientsFiles/idPatient=' + patient.ID_PATIENT_MAIN.toString());
    xhr.send();
}

fillToothByToothScreen = function (toothByTooth) {
    if ((toothByTooth.ID_PATIENT || -1) <= 0) {
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

fillAnamneseScreen = function (answersAnamnesesQuestions) {
    if ((answersAnamnesesQuestions.ID_PATIENT || -1) <= 0) {
        return;
    };

    let findAnamneseQuestion = function (answerToggle, answerDescript, idAnamneseQuestion, callback) {
        let xhrQuestions = new XMLHttpRequest();

        let processRequestQuestion = function () {
            if (xhrQuestions.readyState == 4) {
                let questionsAnamneses = $.parseJSON(xhrQuestions.responseText);

                $('#switch-' + (questionsAnamneses[0].ID_QUESTION_TOGGLE || 0).toString()).prop('checked', (answerToggle == 'T' ? true : false));

                if (answerToggle == 'T') {
                    $('#question-descript-' + (questionsAnamneses[0].ID_QUESTION_DESCRIPT || 0).toString()).prop('readonly', false);
                }

                $('#question-descript-' + (questionsAnamneses[0].ID_QUESTION_DESCRIPT || 0).toString()).val(answerDescript);

                callback();
            }
        }

        xhrQuestions.onreadystatechange = processRequestQuestion;
        xhrQuestions.open('GET', '/anamnesesQuestions/' + idAnamneseQuestion.toString());
        xhrQuestions.send();
    }

    let xhrAnswersAnamneses = new XMLHttpRequest();

    let processRequest = function () {
        if (xhrAnswersAnamneses.readyState == 4) {
            let answersAnamneses = $.parseJSON(xhrAnswersAnamneses.responseText);
            let i = 0;

            let loop = function () {
                if (i < answersAnamneses.length) {
                    findAnamneseQuestion(answersAnamneses[i].ANSWER_TOGGLE, answersAnamneses[i].ANSWER_DESCRIPT, answersAnamneses[i].ID_ANAMNESE_QUESTION, function () {
                        i++;
                        loop();
                    });
                }
            }

            loop();
        }
    }

    xhrAnswersAnamneses.onreadystatechange = processRequest;
    xhrAnswersAnamneses.open('POST', '/answersAnamnesesQuestions');
    xhrAnswersAnamneses.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhrAnswersAnamneses.send(JSON.stringify({ 'type': 'searchList', 'idPatient': answersAnamnesesQuestions.ID_PATIENT_MAIN.toString() }));
}

var removeDocumentsNotSaved = function () {
    let xhr = new XMLHttpRequest();

    for (i = 0; i < patientFilesDocuments.length; i++) {
        if ((patientFilesDocuments[i].get('state') == 'inserted') ||
            (patientFilesDocuments[i].get('state') == 'nosaved')) {
            xhr.open('DELETE', './app/public/uploads/' + patientFilesDocuments[i].get('descriptionUnique'));
            xhr.send();
        }
    }
}

$(window).unload(
    function() {
        removeDocumentsNotSaved();
    }
);

$(document).ready(function ($) {

    $(window).resize(function(event){
        if (PhaserInput.KeyboardOpen == true) {
            return;
        }
    });
	let flapHtml = '';
	let menuHtml = '';

	if (window.matchMedia('(max-width: 500px)').matches || window.matchMedia('(orientation: portrait)').matches) {
			menuHtml =	'<li id="cancel">' +
							'<span>' +
								'<i class="fa fa-times" aria-hidden="true"></i>' +
							'</span>' +
						'</li>' +

						'<li id="save">' +
							'<span>' +
								'<i class="fa fa-check" aria-hidden="true"></i>' +
							'</span>' +
						'</li>' +

                        '<li id="personal-datas">' +
							'<span>' +
								'<i class="fa fa-user" aria-hidden="true"></i>' +
							'</span>' +
                        '</li>'+						

						'<li id="anamnese">' +
							'<span>' +
								'<i class="fa fa-clipboard" aria-hidden="true"></i>' +
							'</span>' +
                        '</li>' +  
                        
						'<li id="description-tooth-by-tooth">' +
							'<span>' +
								'<i class="fa fa-file-text-o" aria-hidden="true"></i>' +
							'</span>' +
						'</li>' +                      
						
                        '<li id="patient-files">' +
                            '<span>' +
                                '<i class="fa fa-paperclip" aria-hidden="true"></i>' +
                            '</span>' +
                        '</li>';

			$('.menu-deshboard').find('nav').find('ul').empty();
			$('.menu-deshboard').find('nav').find('ul').append(menuHtml);
	}

	if (window.matchMedia('(min-width: 500px)').matches && window.matchMedia('(orientation: landscape)').matches) {
		flapHtml =  '<div class="wrapper-flap">' +

		                '<div class="flap-bt" name="personal-datas" id="personal-datas">' +
			                'dados pessoais' +
		                '</div>' +

		                '<div class="flap-bt" name="anamnese" id="anamnese">' +
			                'anamnese' +
		                '</div>' +

		                '<div class="flap-bt" name="description-tooth-by-tooth" id="description-tooth-by-tooth">' +
			                'descrição dentária' +
		                '</div>' +

		                '<div class="flap-bt" name="patient-files" id="patient-files">' +
			                'documentos' +
		                '</div>' +

		                '<div class="wrapper-crud-save-cancel">' +
			                '<div class="wrapper-square-small-save" name="save" id="save">' +
				                '<i class="fa fa-check" aria-hidden="true"></i>' +
			                '</div>' +

			                '<div class="wrapper-square-small-cancel" name="cancel" id="cancel">' +
				                '<i class="fa fa-times" aria-hidden="true"></i>' +
			                '</div>' +
		                '</div>' +
                    '</div>'; 
                    
        $('.content-deshboard-1').prepend(flapHtml);
	}


    var content1 = $(this).find('#content-1');
    var content2 = $(this).find('#content-2');
    var content3 = $(this).find('#content-3');
    var content4 = $(this).find('#content-4');

    var fillAppointment = function (appointment, callback) {
        appointment = {
            type: '',
            idAppointment: $('#edit-id').val(),
            descriptionProcedure: $('#procedure').val(),
            detailingProcedure: $('#procedure-detailing').val(),
            dateHourAppointment: $('#date-hour-appointment').val(),
            patient: {
                idPatient: $('#id-patient').val(),
                patientName: $('#patient-name').val(),
                rg: $('#rg').val().replace(/[^0-9]/g, ''),
                cpf: $('#cpf').val().replace(/[^0-9]/g, ''),
                photo: '',
                numberCard: $('#number-card').val(),
                profission: $('#profission').val(),
                email: $('#email').val(),
                addressCode: $('#address-code').val().replace(/[^0-9]/g, ''),
                address: $('#address').val(),
                addressNumber: $('#addres-number').val(),
                addressComplement: $('#address-complement').val(),
                district: $('#district').val(),
                idCity: $('#list-citys').val(),
                dateBirth: $('#birth-date').val(),
                phone: $('#phone').val(),
                cellPhone: $('#cell-phone').val(),
                toothByTooth: [],
                anamneseAnswer: [],
                patientFiles: []
            },
            appointmentStatus: {
                idAppointmentStatus: $('#list-appointment-status').val(),
                description: $('#list-appointment-status').find('option:selected').text()
            },
            doctor: {
                idDoctor: $('#list-doctors').val(),
                doctorName: $('#list-doctors').find('option:selected').text(),
            },
            agreement: {
                idAgreement: $('#list-agreements').val(),
                description: $('#list-agreements').find('option:selected').text()
            },
            room: {
                idRoom: $('#list-rooms').val(),
                description: $('#list-rooms').find('option:selected').text()
            }
        }

        for (i = 0; i <= patientFilesDocuments.length - 1; i++) {
            appointment.patient.patientFiles.push(
                {
                    'idPatientFile': patientFilesDocuments[i].get('idPatientFile'),
                    'description': patientFilesDocuments[i].get('description'),
                    'descriptionUnique': patientFilesDocuments[i].get('descriptionUnique'),
                    'dateHourPatientFile': patientFilesDocuments[i].get('dateHourPatientFile'),
                    'dateHourInsertion': patientFilesDocuments[i].get('dateHourInsertion'),
                    'state': patientFilesDocuments[i].get('state')
                });
        }

        let numberTooth;
        for (j = 1; j <= 2; j++) {
            for (i = 8; i >= 1; i--) {
                if ($('#input-tooth-' + j.toString() + i.toString()).val() == '') {
                    continue;
                } else {
                    numberTooth = j.toString() + i.toString();
                    appointment.patient.toothByTooth.push({ 'numberTooth': numberTooth, 'description': $('#input-tooth-' + j.toString() + i.toString()).val() });
                }

                if ($('#input-tooth-' + (j + 2).toString() + i.toString()).val() == '') {
                    continue;
                } else {
                    numberTooth = (j + 2).toString() + i.toString();
                    appointment.patient.toothByTooth.push({ 'numberTooth': numberTooth, 'description': $('#input-tooth-' + (j + 2).toString() + i.toString()).val() });
                }
            }
        }

        let xhrAnamneseQuestions = new XMLHttpRequest();
        let answerDescript;
        let answerToggle;

        let processRequest = function () {
            if (xhrAnamneseQuestions.readyState == 4) {
                let anamneseQuestions = $.parseJSON(xhrAnamneseQuestions.responseText);

                for (i = 0; i < anamneseQuestions.length; i++) {
                    answerDescript = '';
                    answerToggle = '';

                    if ((anamneseQuestions[i].ID_QUESTION_DESCRIPT || 0) != 0) {
                        answerDescript = $('#question-descript-' + (anamneseQuestions[i].ID_QUESTION_DESCRIPT || 0).toString()).val();
                    }


                    if ((anamneseQuestions[i].ID_QUESTION_TOGGLE || 0) != 0) {
                        answerToggle = $('#switch-' + (anamneseQuestions[i].ID_QUESTION_TOGGLE || 0).toString()).prop('checked') == true ? 'T' : 'F';
                    }

                    appointment.patient.anamneseAnswer.push({
                        idAnamneseQuestion: anamneseQuestions[i].ID_ANAMNESE_QUESTION,
                        answerDescript: (answerDescript = '' ? null : answerDescript),
                        answerToggle: (answerToggle = '' ? null : answerToggle)
                    });
                }

                callback(appointment);
            }
        }

        xhrAnamneseQuestions.onreadystatechange = processRequest;
        xhrAnamneseQuestions.open('GET', '/anamnesesQuestions');
        xhrAnamneseQuestions.send();
    }

    var fillScreen = function (id) {
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

                fillPatientScreen(appointments[0]);
                fillDoctorScreen(appointments[0]);
                fillAgreementScreen(appointments[0]);
                fillRoomScreen(appointments[0]);
                fillAppointmentstatusScreen(appointments[0]);
                fillToothByToothScreen(appointments[0]);
                fillAnamneseScreen(appointments[0]);
                fillPatientFiles(appointments[0]);
            }
        }

        xhr.open('GET', '/appointments/id=' + id.toString());
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();
    }

    var appointmentInsertUpdate = function (type) {
        let appointment;

        fillAppointment(appointment, function (appointmentFilled) {
            appointmentFilled['type'] = type;

            let xhr = new XMLHttpRequest();

            xhr.onload = function () {
                if (xhr.status == 200) {
                    let response = $.parseJSON(xhr.responseText);

                    if ((response.validation || 0) != 0) {
                        showAlert(response.validation);
                    } else {
                        let xhrDelete = new XMLHttpRequest();

                        for (i = 0; i < patientFilesDocuments.length; i++) {
                            if (patientFilesDocuments[i].get('state') == 'deleted') {
                                xhrDelete.open('DELETE', './app/public/uploads/' + patientFilesDocuments[i].get('descriptionUnique'));
                                xhrDelete.send();
                            }
                        }

                        pageLoadClear($(document), $('#content-deshboard-1'), './app/html/list-appointments.ejs');
                    }

                } else {
                    let response = $.parseJSON(xhr.responseText);
                    showAlert(response.validation);
                }
            }

            xhr.open('POST', '/appointments');
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            xhr.send(JSON.stringify(appointmentFilled));
        });
    }

    var searchPatient = function (field, value) {
        if ((field == '') || (field == undefined)) {
            return;
        }

        if ((values == 0) || (value == undefined)) {
            return;
        }

        let xhr = new XMLHttpRequest();

        xhr.onload = function () {
            if (xhr.status == 200) {
                let patient = $.parseJSON(xhr.responseText);

                if ((patient.validation || 0) != 0) {
                    showAlert(patient.validation);;
                    return;
                }

                if (patient.length == 0) {
                    return;
                }

                fillPatientScreen(patient[0]);
            }
        }

        xhr.open('GET', '/patients/' + field + '=' + value.toString());
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();
    }


    $('#save').click(function () {
        if (($('#edit-id').val() || 0) == 0) {
            appointmentInsertUpdate('insert');
        } else {
            appointmentInsertUpdate('update');
        };

    });

    $('#cancel').click(function () {
        removeDocumentsNotSaved();
        pageLoadClear($(document), $('#content-deshboard-1'), './app/html/list-appointments.ejs');
    });

    content1.load('./app/html/personal-datas.html');
    content2.load('./app/html/anamnese.html');
    content3.load('./app/html/description-tooth-by-tooth.html');
    content4.load('./app/html/list-patient-files.html');

    content1.css('display', 'block');
    content2.css('display', 'none');
    content3.css('display', 'none');
    content4.css('display', 'none');

    $('#personal-datas').click(function () {
        content1.css('display', 'block');
        content2.css('display', 'none');
        content3.css('display', 'none');
        content4.css('display', 'none');
    });

    $('#anamnese').click(function () {
        content1.css('display', 'none');
        content2.css('display', 'block');
        content3.css('display', 'none');
        content4.css('display', 'none');
    });

    $('#description-tooth-by-tooth').click(function () {
        content1.css('display', 'none');
        content2.css('display', 'none');
        content3.css('display', 'block');
        content4.css('display', 'none');
    });

    $('#patient-files').click(function () {
        content1.css('display', 'none');
        content2.css('display', 'none');
        content3.css('display', 'none');
        content4.css('display', 'block');
    });

    $.when(listStates(), listCitys(), listDoctors(), listAgrrements(), listRooms(), listAppointmentStatus()).then(
        fillScreen($('#edit-id').val())
    );
});


$(document).on('change', '#list-states',
    function () {
        listCitys();
    }
);


$(document).on('click', '#paperclipe-patient-file',
    function () {
        $('#input-paperclipe-patient-file').click();
    }
);

$(document).on('change', '#input-paperclipe-patient-file',
    function () {
        var file = $('#input-paperclipe-patient-file')[0].files[0];

        if ((file || 0) != 0) {
            let formData = new FormData;

            formData.append('type', 'upload');
            formData.append('idPatientFile', 0);
            formData.append('file', file);
            formData.append('idPatint', $('#edit-id').val());
            formData.append('description', 'Documento_' + patientFilesDocuments.length);
            formData.append('descriptionUnique', 'patients-documents-' + $.now() + (Math.random() * Math.pow(10, 20)).toString() + '.' + file.name.substring(file.name.indexOf('.') + 1, file.name.length));
            formData.append('dateHourPatientFile', moment($.now()).format('DD/MM/YYYY HH:mm'));
            formData.append('dateHourInsertion', moment($.now()).format('DD/MM/YYYY HH-:mm'));
            formData.append('state', 'inserted');

            patientFilesDocuments.push(formData);

            xhr.onload = function () {
                if (xhr.status == 200) {
                    listCardsPatientsFiles();
                }
            }

            xhr.open('POST', '/patientsFiles');
            xhr.send(patientFilesDocuments[patientFilesDocuments.length - 1]);
        }
    }
);

$(document).on('dblclick', '.img-documents',
    function () {
        $('.img-documents-modal').css('display', "block");
        $('.img-documents-modal-content').attr('src', $(this).attr('src'));
    }
);

$(document).on('click', '.img-documents-modal-close',
    function () {
        $('.img-documents-modal').css('display', "none");
    }
);

