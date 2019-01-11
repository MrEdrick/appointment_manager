var cpfInput = $("#cpf");
var rgInput = $("#rg");
var numberCardInput = $("#number-card");

$(document).ready(function ($) {

    var searchPatient = function (field, value) {
        if ((field == '') || (field == undefined)) {
            return;
        }

        if ((value == 0) || (value == undefined)) {
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

                if ((patient.length || 0) == 0) {
                    return;
                }

                fillPatientScreen(patient[0]);
                fillToothByToothScreen(patient[0]);
                fillAnamneseScreen(patient[0]);
                fillPatientFiles(patient[0]);
            }
        }

        xhr.open('GET', '/patients/' + field + '=' + value.toString());
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();
    }


    cpfInput.keyup(function (e) {
        if (cpfInput.val().replace(/[^0-9]/g, '').length == 11) {
            searchPatient('cpf', cpfInput.val().replace(/[^0-9]/g, ''));
        }
    });

    rgInput.keyup(function (e) {
        if (rgInput.val().replace(/[^0-9]/g, '').length = 9) {
            searchPatient('rg', rgInput.val().replace(/[^0-9]/g, ''));
        }
    });

    numberCardInput.keypress(function (e) {
        if (e.which == 13) {
            searchPatient('numberCard', $("#numberCard").val().replace(/[^0-9]/g, ''));
        }
    });

    $("#birth-date").mask("99/99/9999", { placeholde: "dd/mm/aaaa" });
    $("#cpf").mask("999.999.999-99");
    $("#rg").mask("99.999.999-9");
    $("#address-code").mask("99999-999");
    $("#phone").mask("(99)9999-9999", { placeholder: "(  )    -    " });
    $("#cell-phone").mask("(99)9999-99999", { placeholder: "(  )    -     " });

    $("#date-hour-appointment").mask("99/99/9999 99:99", { placeholde: "dd/mm/aaaa hh:mm" });
});