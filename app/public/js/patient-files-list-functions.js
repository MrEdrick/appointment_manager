let xhr = new XMLHttpRequest();
let htmlList = '';
let documentsPath = './app/public/uploads/';

var withoutExtension = function (str) {
	str = (str == undefined) ? '' : str;
	return str.substring(0, str.lastIndexOf('.') - 1);
}

var justId = function (str) {
	str = (str == undefined) ? '' : str;
	str = str.substring(str.lastIndexOf('-') + 1, str.length);
	
	if (str.lastIndexOf('.') > 0) {
		str = str.substring(0, str.lastIndexOf('.') - 1);
	}

	return str;
}

var goThroughArrayToCompare = function (array, paramToCompare, paramOfComparetion, callback) {
	if (paramToCompare != '') {
		for (i = 0; i < array.length; i++) {
			if (justId(array[i].get(paramToCompare)) == justId(paramOfComparetion)) {
				callback(i);
				break;
			}
		}
	}
}

listCardsPatientsFiles = function () {
	$('#content').children().remove();
	$('#content-list-patient-files').html('');

	let fillContent = function (idPatientFile, description, descriptionUnique, dateHourInsertion, dateHourPatientFile) {
		let id = withoutExtension(descriptionUnique);

		let patientFileDescription = $("#input-patient-fiile-description").val();
		let patientFileDate = $("#input-patient-file-date").val().replace(/[a-zA-Z]+/g, '');
		
		if (((patientFileDescription || '') != '') && (description.indexOf(patientFileDescription) == -1)) {
			return;
		}

		if (((patientFileDate || '') != '') && (dateHourPatientFile.substring(0, 10) != patientFileDate)){
			return;
		}

		htmlList = "<div class='list-card' id='" + id + "' name='" + id + "'>" +
			"<div class='wrapper-img-square-extra-large'  name='" + documentsPath + descriptionUnique + "' id='" + documentsPath + descriptionUnique + "'>" +
			"</div>" +

			"<div class='list-card-information'>" +
			//"<div class='wrapper-block'>" +
			//"<label class='label-title-card'>Descrição &nbsp;</label>" +
			"<input class='input-edit-card' value='" + description + "' id=input-document-description-'" + id + "' name='input-document-description-" + id + ">" +
			"</div>" +

			"<div class='wrapper-block'>" +
			//"<label class='label-title-card'>Data da Inserção &nbsp;</label>" +
			"<input class='input-edit-card' value='" + dateHourPatientFile + "' id='input-document-date-" + id + "' name='input-document-date-" + id + "'>" +
			//"</div>" +

			//"<div class='wrapper-block'>" +
			"<label class='label-title-card'>Data de Ins.: &nbsp;</label>" +
			"<label class='label-value-card'>" + dateHourInsertion + "</label>" +
			"</div>" +
			//"</div>" +

			"<div class='wrapper-crud-edit-delete-card' id='wrapper-crud-edit-delete-card-" + id + "'>" +
			"<div class='wrapper-square-small-delete-card delete' name='delete-" + id + "' id='delete-" + id + "'>" +
			"<i class='fa fa-minus' aria-hidden='true'></i>" +
			"</div>" +
			"</div>" +
			"</div>";
		$('#content-list-patient-files').append(htmlList);
	}

	let goThroughArrayToFillContent = function (array) {
		for (i = 0; i < array.length; i++) {
			if ((array[i].get('state') == 'deleted') || 
				(array[i].get('state') == 'nosaved')) {
				continue;
			}

			fillContent(array[i].get('idPatientFile').toString(),
				array[i].get('description'),
				array[i].get('descriptionUnique'),
				array[i].get('dateHourInsertion'),
				array[i].get('dateHourPatientFile'));
		}
	}

	goThroughArrayToFillContent(patientFilesDocuments);
}

xhr.onload = function () {

	if (xhr.status == 200) {
		var response = $.parseJSON(xhr.responseText);
		if ((response.validation || 0) != 0) {
			showAlert(jQuery, response.validation);
			return;
		}

		listCardsPatientsFiles();
	}
}

searchGetAll = function () {
	xhr.open('GET', '/patientsFiles');
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.send();
}

$(document).ready(function ($) {
	$.getScript("../js/jquery.maskedinput.js").done(function () {
		$("#input-patient-file-date").mask("99/99/9999", { placeholde: "dd/mm/aaaa" });
	});
	
	searchGetAll();
});

$(document).on('keyup', '.search-patient-files',
	function () {
		searchGetAll();
	}
);

$(document).on('click', '.delete',
	function () {
		let deleteId = $(this).attr('id');

		$.getScript("../js/jquery-confirm.min.js")
			.done(function () {
				$.confirm({
					title: 'Aviso!',
					theme: 'material',
					content: 'Tem certeza que deseja excluir este registro?',
					buttons: {
						Sim: function () {
							goThroughArrayToCompare(patientFilesDocuments, 'descriptionUnique', deleteId.substring(deleteId.indexOf('-') + 1, deleteId.length), function (index) {
								if (patientFilesDocuments[index].get('state') == 'saved') {
									patientFilesDocuments[index].set('state', 'deleted');
								}

								if (patientFilesDocuments[index].get('state') == 'inserted') {
									patientFilesDocuments[index].set('state', 'nosaved');
								}
								searchGetAll();
							});
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
);

$(document).on('click', '.edit',
	function () {
	}
);

$(document).on('DOMNodeInserted', '.list-card', function () {
	if ($(event.target).attr('class') != 'list-card') {
		return;
	}
	$.getScript("../js/jquery.maskedinput.js").done(function () {
		$("#input-document-date-" + $(this).attr('id')).mask("99/99/9999 99:99", { placeholde: "dd/mm/aaaa hh:mm" });
	});

	let xhrDocumentImage = new XMLHttpRequest();

	let wrapperImage = $(this).find('.wrapper-img-square-extra-large');

	xhrDocumentImage.onload = function () {
		if (xhrDocumentImage.status == 200) {
			wrapperImage.html('');
			wrapperImage.append(xhrDocumentImage.responseText);
		}
	}

	xhrDocumentImage.open('GET', wrapperImage.attr('id'));
	xhrDocumentImage.send();
});

$(document).on('mouseover', '.list-card',
	function () {
		let id = $(this).attr('id');
		$('#wrapper-crud-edit-delete-card-' + id).css('left', $(this).position().left + parseInt($(this).css("margin-left")));
		$('#wrapper-crud-edit-delete-card-' + id).css('top', $(this).position().top + parseInt($(this).css("margin-top")));
		$('#wrapper-crud-edit-delete-card-' + id).css('display', 'inline-block');
	}
);

$(document).on('mouseout', '.list-card',
	function () {
		let id = $(this).attr('id');
		$('#wrapper-crud-edit-delete-card-' + id).css('display', 'none');
	}
);

$(document).on('keyup', '.input-edit-card',
	function () {
		let input = $(this);
		let inputId = input.attr('id');
		let unique = inputId.substring(inputId.lastIndexOf('-') + 1, inputId.length);
		let inputType = inputId.substring(0, inputId.lastIndexOf('-') - 1);

		let arrayValueChanged = function (array) {
			goThroughArrayToCompare(array, 'descriptionUnique', unique,
				function (index) {
					if (inputType == 'input-document-description-patients-document') {
						array[index].set('description', input.val());
					}
			
					if (inputType == 'input-document-date-patients-document') {
						array[index].set('dateHourPatientFile', input.val());
					}
	
					array[index].set('state', 'updated');
				}
			);
		}

		arrayValueChanged(patientFilesDocuments);
	}
);