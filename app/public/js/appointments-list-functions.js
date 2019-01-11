var xhr = new XMLHttpRequest();
var page = 0;
var htmlList = '';
var jQuery;
var idAppointmentRow = 0;
response = undefined;

var showListLandscape = function (response) {
	if (response == undefined) {
		return;
	}

	for (i = 0; i < response.length; i++) {
		htmlList = "<div class='list-row' id='row-" + response[i].ID_APPOINTMENT.toString() + "' name='row-" + response[i].ID_APPOINTMENT.toString() + "'>" +

			"<div class='wrapper-inline-block wrapper-img-square-medium'  name='patient-photo' id='patient-photo'>" + "</div>" +

			"<div class='wrapper-inline-block personal-informations-row-col-1'>" +
			"<div class='wrapper-block'>" +
			"<label class='label-title-row'>Paciente &nbsp;</label>" +
			"<label class='wrapper-inline-block label-value-row'>" + response[i].PATIENT_NAME + "</label>" +
			"</div>" +

			"<div class='wrapper-block'>" +
			"<label class='label-title-row'>Data da Consulta &nbsp;</label>" +
			"<label class='label-value-row'>" + $.format.date(response[i].DATE_HOUR_APPOINTMENT, 'dd/MM/yyyy') + "</label>" +
			"</div>" +

			"<div class='wrapper-block'>" +
			"<label class='label-title-row'>Status &nbsp</label>" +
			"<label class='label-value-row'>" + response[i].APPOINTMENT_STATUS + "</label>" +
			"</div>" +

			"<div class='wrapper-block'>" +
			"<label class='label-title-row'>Dentista &nbsp</label>" +
			"<label class='label-value-row'>" + response[i].DOCTOR_NAME + "</label>" +
			"</div>" +
			"</div>" +

			"<div class='wrapper-inline-block personal-informations-row-col-2'>" +

			"<div class='wrapper-block'>" +
			"<label class='label-title-row'>Convênio &nbsp</label>" +
			"<label class='label-value-row'>" + response[i].AGREEMENT_DESCRIPTION + "</label>" +
			"</div>" +

			"<div class='wrapper-block'>" +
			"<label class='label-title-row'>Sala &nbsp</label>" +
			"<label class='label-value-row'>" + response[i].ROOM_DESCRIPTION + "</label>" +
			"</div>" +

			"<div class='wrapper-block'>" +
			"<label class='label-title-row'>E-mail &nbsp</label>" +
			"<label class='label-value-row'>" + response[i].EMAIL + "</label>" +
			"</div>" +

			"<div class='wrapper-block'>" +
			"<label class='label-title-row'>Tel./Cel. &nbsp</label>" +
			"<label class='label-value-row'>" + response[i].PHONE + (response[i].PHONE ? " / " : "") + response[i].CELL_PHONE + "</label>" +
			"</div>" +
			"</div>" +

			"<div class='wrapper-crud-edit-delete-row' id='wrapper-crud-edit-delete-row-" + response[i].ID_APPOINTMENT.toString() + "'>" +
			"<div class='wrapper-square-small-edit-row edit' name='edit_" + response[i].ID_APPOINTMENT.toString() + "' id='edit_" + response[i].ID_APPOINTMENT.toString() + "'>" +
			"<i class='fa fa-pencil' aria-hidden='true'></i>" +
			"</div>" +

			"<div class='wrapper-square-small-delete-row delete' name='delete_" + response[i].ID_APPOINTMENT.toString() + "' id='delete_" + response[i].ID_APPOINTMENT.toString() + "'>" +
			"<i class='fa fa-minus' aria-hidden='true'></i>" +
			"</div>" +
			"</div>";

		$('#content-list').append(htmlList);
	}

	htmlList = "<div class='foot' id='foot' name='rowfoot'>" +
					"<div class='wrapper-block wrapper-square-small-next name='next' id='next'>" +
						"<i class='fa fa-chevron-right' aria-hidden='true'></i>" +
					"</div>" +

					"<div class='wrapper-block wrapper-square-small-previous name='previous' id='previous'>" +
						"<i class='fa fa-chevron-left' aria-hidden='true'></i>" +
					"</div>" +
				"</div>";

	$('#content-list').append(htmlList);
}

var showListPortrait = function (response) {
	if (response == undefined) {
		return;
	}

	for (i = 0; i < response.length; i++) {
		htmlList = "<div class='list-row' id='row-" + response[i].ID_APPOINTMENT.toString() + "' name='row-" + response[i].ID_APPOINTMENT.toString() + "'>" +

			"<div class='img-square-small-list'  name='patient-photo' id='patient-photo'>" + "</div>" +

			"<div class='label-value' id='label-value-patient-name'>" + response[i].PATIENT_NAME + "&nbsp</div>" +

			"<div class='label-value' id='label-value-date-hour-appointment'>" + $.format.date(response[i].DATE_HOUR_APPOINTMENT, 'dd/MM/yyyy') + "&nbsp</div>" +

			"<div class='label-value' id='label-value-appointment-status'>" + response[i].APPOINTMENT_STATUS + "&nbsp</div>" +

			"<div class='label-value' id='label-value-phone'>" + response[i].PHONE + (response[i].PHONE ? " / " : "") + response[i].CELL_PHONE + "&nbsp</div>" +
			
			"<div class='label-value' id='label-value-email'>" + response[i].EMAIL + "&nbsp</div>" +

			"<div class='label-value' id='label-value-doctor-name'>" + response[i].DOCTOR_NAME + "&nbsp</div>" +

			"<div class='label-value' id='label-value-agreement-description'>" + response[i].AGREEMENT_DESCRIPTION + "&nbsp</div>" +

			"<div class='label-value' id='label-value-room-description'>" + response[i].ROOM_DESCRIPTION + "&nbsp</div>" +

			"</div>";

		$('#content-list').append(htmlList);
	}

	$('#content-list').append(htmlList);
}

xhr.onload = function () {

	if (xhr.status == 200) {
		$('#content-list').children().remove();
		response = $.parseJSON(xhr.responseText);

		if ((response.validation || 0) != 0) {
			showAlert(jQuery, response.validation);
			searchGetAll();
			return;
		}

		if (isEmpty(response)) {
			searchGetAll();
		}

		if (window.matchMedia('(max-width: 500px)').matches || window.matchMedia('(orientation: portrait)').matches) {
			showListPortrait(response);
		}

		if (window.matchMedia('(min-width: 500px)').matches && window.matchMedia('(orientation: landscape)').matches) {
			showListLandscape(response);
		}
	}
}

searchGetAll = function () {
	xhr.open('GET', '/appointments/' + page);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.send();
}


searchGetWithFilters = function () {

	var searchAppointments = {
		'type': 'searchList',
		'cpf': $("#cpf").val().replace(/[^0-9]/g, ''),
		'rg': $("#rg").val().replace(/[^0-9]/g, ''),
		'cardNumber': $("#number-card").val(),
		'namePatient': $("#name").val(),
		'idAppointmentStatus': $("#list-appointment-status").val(),
		'cro': $("#cro").val().replace(/[^0-9]/g, ''),
		'nameDoctor': $("#nameDoctor").val(),
		'date': $("#date").val().replace(/[a-zA-Z]+/g, ''),
		'idAgreement': $("#list-agreements").val(),
	}

	xhr.open('POST', '/appointments');
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.send(JSON.stringify(searchAppointments));
}

listAppointmentStatus = function () {
	let xhr = new XMLHttpRequest();

	var processRequest = function () {
		if (xhr.readyState == 4) {
			var appointmentStatus = $.parseJSON(xhr.responseText);

			$('#list-appointment-status').append('<option class="placeholder-option" value="0">status...</option>');

			for (i = 0; i < appointmentStatus.length; i++) {
				$('#list-appointment-status').append('<option value=' + appointmentStatus[i].ID_APPOINTMENT_STATUS + '>' + appointmentStatus[i].DESCRIPTION + '</option>');
			}

		}
	}

	xhr.onreadystatechange = processRequest;
	xhr.open('GET', '/appointmentStatus');
	xhr.send();
}

listAgreements = function () {
	let xhr = new XMLHttpRequest();

	var processRequest = function () {
		if (xhr.readyState == 4) {
			var agreements = $.parseJSON(xhr.responseText);

			$('#list-agreements').append('<option class="placeholder-option" value="0">convênios...</option>');

			for (i = 0; i < agreements.length; i++) {
				$('#list-agreements').append('<option value=' + agreements[i].ID_AGREEMENT + '>' + agreements[i].DESCRIPTION + '</option>');
			}

		}
	}

	xhr.onreadystatechange = processRequest;
	xhr.open('GET', '/agreements');
	xhr.send();
}

var changeOrientation = function (window) {
	let html = '';
	let menuHtml = '';

	$('.content-deshboard-1').find('.search').remove();
	$('.content-deshboard-1').find('.content-list').remove();

	if (window.matchMedia('(max-width: 500px)').matches || window.matchMedia('(orientation: portrait)').matches) {
		html = '<div class="search">' +
					'<div class="wrapper-form-search">' +
						'<form id="form-search" name="form-search">' + 
							'<input class="input-filter input-text-small" type="text" name="cpf" id="cpf" placeholder="cpf..." maxlength="11">' +
							'<input class="input-filter input-text-small" type="text" name="rg" id="rg" placeholder="rg..." maxlength="10">' +
							'<input class="input-filter input-text-small" type="text" name="number-card" id="number-card" placeholder="nº cartão..." maxlength="10">' +
							'<input class="input-filter input-text-large" type="text" name="name" id="name" placeholder="nome..." maxlength="40">' +

							'<input class="input-filter input-text-small" type="text" name="cro" id="cro" placeholder="cro..." maxlength="11">' +
							'<select class="input-filter select-filter select-text-medium" type="text" name="list-agreements" id="list-agreements">' +
							'</select>' +
							'<input class="input-filter input-text-large" type="text" name="nameDoctor" id="nameDoctor" placeholder="dentista..." maxlength="50">' + 
		  
							'<input class="input-filter input-text-small" type="text" name="date" id="date" placeholder="dd/mm/aaaa" maxlength="11">' + 
							'<select class="input-filter select-filter select-text-small" type="text" name="list-appointment-status" id="list-appointment-status">' +
							'</select>' +
						'</form>' +
					'</div>' +
				'</div>' +
	
			'<div class="content-list" id="content-list">' +
			'</div>';

			menuHtml =					
						'<li id="cancel">' +
							'<span>' +
								'<i class="fa fa-times" aria-hidden="true"></i>' +
							'</span>' +
						'</li>' +

						'<li id="new">' +
							'<span>' +
								'<i class="fa fa-plus" aria-hidden="true"></i>' +
							'</span>' +
						'</li>' +

						'<li id="delete">' +
							'<span>' +
								'<i class="fa fa-minus" aria-hidden="true"></i>' +
							'</span>' +
						'</li>' +

						'<li id="edit">' +
							'<span>' +
								'<i class="fa fa-pencil" aria-hidden="true"></i>' +
							'</span>' +
						'</li>' +						

						'<li id="search">' +
							'<span>' +
								'<i class="fa fa-search" aria-hidden="true"></i>' +
							'</span>' +
						'</li>';

			$('.menu-deshboard').find('nav').find('ul').empty();
			$('.menu-deshboard').find('nav').find('ul').append(menuHtml);
	}

	if (window.matchMedia('(min-width: 500px)').matches && window.matchMedia('(orientation: landscape)').matches) {
		html = '<div class="search">' +
					'<div class="wrapper-form-search">' +
						'<form id="form-search" name="form-search">' + 
							'<input class="input-filter input-text-small" type="text" name="cpf" id="cpf" placeholder="cpf..." maxlength="11">' +
							'<input class="input-filter input-text-small" type="text" name="rg" id="rg" placeholder="rg..." maxlength="10">' +
							'<input class="input-filter input-text-small" type="text" name="number-card" id="number-card" placeholder="nº cartão..." maxlength="10">' +
							'<input class="input-filter input-text-large" type="text" name="name" id="name" placeholder="nome..." maxlength="40">' +
							'<input class="input-filter input-text-small" type="text" name="date" id="date" placeholder="dd/mm/aaaa" maxlength="11">' + 
	
							'<select class="input-filter select-text-medium" type="text" name="list-agreements" id="list-agreements">' +
							'</select>' +
		
							'<select class="input-filter select-text-medium" type="text" name="list-appointment-status" id="list-appointment-status">' +
							'</select>' +
	
							'<input class="input-filter input-text-small" type="text" name="cro" id="cro" placeholder="cro..." maxlength="11">' +
							'<input class="input-filter input-text-large" type="text" name="nameDoctor" id="nameDoctor" placeholder="dentista..." maxlength="50">' + 
		  
						'</form>' +
					'</div>' +
	
					'<div class="wrapper-crud-new-cancel">' +
						'<div class="wrapper-square-small-new" name="new" id="new">' +
							'<i class="fa fa-plus" aria-hidden="true"></i>' +
						'</div>' + 
	
						'<div class="wrapper-square-small-cancel" name="cancel" id="cancel">' +
							'<i class="fa fa-times" aria-hidden="true"></i>' +
						'</div>' +
					'</div>' +
				'</div>' +
	
				'<div class="content-list" id="content-list">' +
				'</div>';

				menuHtml = '<li id="home">' +
								'<span>' +
									'<i class="fa fa-home" aria-hidden="true"></i>' +
								'</span>' +
							'</li>' +
							'<li id="appointments">' +
								'<span>' +
									'<i class="fa fa-stethoscope" aria-hidden="true"></i>' +
								'</span>' +
							'</li>';

				$('.menu-deshboard').find('nav').find('ul').empty();
				$('.menu-deshboard').find('nav').find('ul').append(menuHtml);
	}
	
	$('.content-deshboard-1').append(html);

}

window.onresize  = function() {
	if (PhaserInput.KeyboardOpen == true) {
		return;
	}
	changeOrientation(window);
	searchGetAll();
};


$(document).ready(function () {
$(window).resize(function(event){
	if (PhaserInput.KeyboardOpen == true) {
		return;
	}
});
	changeOrientation(window);
	searchGetAll();
});


$(document).ready(function ($) {
	$('#content-deshboard-content-type').val('list');

	$("#date").mask("99/99/9999", { placeholder: "dd/mm/aaaa" });
	$("#cpf").mask("999.999.999-99");
	$("#rg").mask("99.999.999-9");
	$("#cro").mask("99.99.9999", { placeholder: "xx-xx-xxxx" });
	$("#cep").mask("99999-999");
	$("#phone").mask("(99)9999-9999)", { placeholder: "(  )    -    )" });
	$("#cell-phone").mask("(99)9999-99999)", { placeholder: "(  )    -     )" });

	listAppointmentStatus();
	listAgreements();

	searchGetAll();
});

$(document).on('click', '#new', 
	function () {
		$('#list-id').val(0);
		pageLoadClear($(document), $('#content-deshboard-1'), './app/html/edit-appointments.ejs');
	}
);

$(document).on('click', '#cancel', 
	function () {
		location.reload(true);
	}
);

$(document).on('click', '#search', 
	function () {
		$('#content-deshboard-1').find('.search').toggle();
	}
);

$(document).on('change', '#form-search', 
	function () {
		searchGetWithFilters();
	}
);

$(document).on('change', '#list-appointment-status', 
	function () {
		if ($(this).val() > -1) {
			searchGetWithFilters();
		}
	}
);

$(document).on('change', '#list-agreements', 
	function () {
		if ($(this).val() > -1) {
			searchGetWithFilters();
		}
	}
);

$(document).on('mouseover', '.list-row',
	function () {
		let id = $(this).attr('id').substring(-1);
		$('#wrapper-crud-edit-delete-' + id).css('display', 'inline-block');
	}
);

$(document).on('mouseout', '.list-row',
	function () {
		let id = $(this).attr('id').substring(-1);
		$('#wrapper-crud-edit-delete-' + id).css('display', 'none');;
	}
);

$(document).on('click', '#next',
	function () {
		page += 1;
		searchGetAll();
	}
);

$(document).on('click', '#previous',
	function () {
		page -= 1;
		page < 0 ? page = 0 : page;
		searchGetAll();
	}
);

$(document).on('click', '.list-row', 
	function () {
		$('#row-' + idAppointmentRow.toString()).css('background-color', 'rgb(255, 255, 255)');

		if (idAppointmentRow == $(this).attr('id').substring($(this).attr('id').indexOf('-') + 1, $(this).attr('id').length)) {
			idAppointmentRow = 0;
			$('#delete').css('display', 'none');
			$('#edit').css('display', 'none');
			return;	
		}

		$('#delete').css('display', 'inline');
		$('#edit').css('display', 'inline');

		idAppointmentRow = $(this).attr('id').substring($(this).attr('id').indexOf('-') + 1, $(this).attr('id').length);
		$(this).css('background-color', 'rgb(241, 241, 241)');
	}
);

$(document).on('dblclick', '.list-row',
	function () {
		let id = $(this).attr('id').substring($(this).attr('id').indexOf('-') + 1, $(this).attr('id').length);
		pageLoadClear($(document), $('#content-deshboard-1'), './app/html/edit-appointments.ejs/' + id);
	}
);

deleteRow = function (id) {
	jQuery.getScript("../js/jquery-confirm.min.js")
	.done(function () {
		$.confirm({
			title: 'Aviso!',
			theme: 'material',
			content: 'Tem certeza que deseja excluir este registro?',
			buttons: {
				Sim: function () {
					xhr.open('DELETE', '/appointments/' + id);
					xhr.send();
				},
				Nao: function () {

				}
			}
		});
	})
	.fail(function () {
		/* boo, fall back to something else */
	});
}

$(document).on('click', '#edit',
	function () {
		pageLoadClear($(document), $('#content-deshboard-1'), './app/html/edit-appointments.ejs/' + idAppointmentRow.toString());		
	}
);

$(document).on('click', '#delete',
	function () {
		deleteRow(idAppointmentRow.toString());
	}
);

$(document).on('click', '.delete',
	function () {
		let deleteId = $(this).attr('id');
		deleteRow(deleteId.substring(deleteId.lastIndexOf('_') + 1, deleteId.length));
	}
);

$(document).on('click', '.edit',
	function () {
		let id = $(this).attr('id').substring($(this).attr('id').lastIndexOf('_') + 1, $(this).attr('id').length);

		pageLoadClear($(document), $('#content-deshboard-1'), './app/html/edit-appointments.ejs/' + id);
	}
);