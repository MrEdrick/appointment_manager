$(document).ready(function ($) {
    var fillAnamneseScreen = function (answersAnamneses) {
        if ((answersAnamneses.ID_PATIENT_MAIN || -1) < 0) {
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
                
                let loop = function() {
                    if (i < answersAnamneses.length) {
                        findAnamneseQuestion(answersAnamneses[i].ANSWER_TOGGLE, answersAnamneses[i].ANSWER_DESCRIPT, answersAnamneses[i].ID_ANAMNESE_QUESTION, function() {
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
        xhrAnswersAnamneses.send(JSON.stringify({ 'type': 'searchList', 'idPatient': answersAnamneses.ID_PATIENT_MAIN.toString() }));
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

                fillAnamneseScreen(appointments[0]);
            }
        }

        xhr.open('GET', '/appointments/id=' + id.toString());
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();
    }

    var appendAnamneseQuestionsDescript = function (idQuestionDescript, idQuestionToggle, idAnamneseQuestion, callback) {
        let anamneseQuestionsDescript;
        let xhr = new XMLHttpRequest();
        let html = '';
        let i = 0;

        if ((idQuestionDescript || 0) == 0) {
            callback();
            return;
        }

        let loop = function () {
            if (i == 0) {
                append(function () {
                    i++;
                    loop();
                });
            } else {
                if (i < anamneseQuestionsDescript.length) {
                    append(function () {
                        i++;
                        loop();
                    });
                } else {
                    callback();
                }
            }
        }

        let append = function (callbackAppend) {
            if (anamneseQuestionsDescript[i].HAVE_LONG_ANSWER != 'T') {
                html = '<div class="' + ((idQuestionToggle || 0) == 0 ? '' : 'wrapper-input-anamnese') + '" id="div-question-descript-' + anamneseQuestionsDescript[i].ID_QUESTION_DESCRIPT.toString() + '" name="div-question-descript-' + anamneseQuestionsDescript[i].ID_QUESTION_DESCRIPT.toString() + '">' +
                            '<input class="input-edit-anamnese input-text-full-large-edit input-text-extra-large-edit" type="text" name="question-descript-' + anamneseQuestionsDescript[i].ID_QUESTION_DESCRIPT.toString() + '" id="question-descript-' + anamneseQuestionsDescript[i].ID_QUESTION_DESCRIPT.toString() + '" placeholder="' + anamneseQuestionsDescript[i].DESCRIPTION + '" maxlength="100" ' + ((idQuestionToggle || 0) == 0 ? '' : 'readonly="true"') + '>' +
                        '</div>';
            } else {
                html = '<div class="' + ((idQuestionToggle || 0) == 0 ? '' : 'wrapper-input-anamnese') + '" id="div-question-descript-' + anamneseQuestionsDescript[i].ID_QUESTION_DESCRIPT.toString() + '" id="div-question-descript-' + anamneseQuestionsDescript[i].ID_QUESTION_DESCRIPT.toString() + '" name="div-question-descript-' + anamneseQuestionsDescript[i].ID_QUESTION_DESCRIPT.toString() + '">' +
                            '<textarea class="input-textarea-edit input-textarea input-text-full-large-edit input-text-extra-large-edit" name="question-descript-' + anamneseQuestionsDescript[i].ID_QUESTION_DESCRIPT.toString() + '" id="question-descript-' + anamneseQuestionsDescript[i].ID_QUESTION_DESCRIPT.toString() + '" placeholder="' + anamneseQuestionsDescript[i].DESCRIPTION + '" rows="13" cols="105" maxlength="1200"></textarea>' +
                        '</div>';
            }

            $('#anamnese-question-' + idAnamneseQuestion.toString()).append(html);

            callbackAppend();
        }


        xhr.onload = function () {
            if (xhr.status == 200) {
                anamneseQuestionsDescript = $.parseJSON(xhr.responseText);

                if ((anamneseQuestionsDescript.validation || 0) != 0) {
                    showAlert(anamneseQuestionsDescript.validation);
                    return;
                }

                if (anamneseQuestionsDescript.length == 0) {
                    return;
                }

                loop();

            }
        }

        xhr.open('GET', '/questionsDescripts/' + idQuestionDescript.toString());
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();
    };

    var appendAnamneseQuestionsToggle = function (idQuestionToggle, idQuestionDescript, idAnamneseQuestion, callback) {
        let anamneseQuestionsToggle;
        let xhr = new XMLHttpRequest();
        let html = '';
        let i = 0;

        if ((idQuestionToggle || 0) == 0) {
            callback();
            return;
        }

        let loop = function () {
            if (i == 0) {
                append(function () {
                    i++;
                    loop();
                });
            } else {
                if (i < anamneseQuestionsToggle.length) {
                    append(function () {
                        i++;
                        loop();
                    });
                } else {
                    callback();
                }
            }
        }

        let append = function (callbackAppend) {
            if ((idQuestionDescript || 0) != 0) {
                html =  '<div class="wrapper-switch switch-with-question">' +
                            '<label class="switch-yes-no">' +
                                '<input type="checkbox" class="switch-input" name="switch-' + anamneseQuestionsToggle[i].ID_QUESTION_TOGGLE.toString() + '" id="switch-' + anamneseQuestionsToggle[i].ID_QUESTION_TOGGLE.toString() + '">' +
                                '<span class="yes-no"></span>' +
                            '</label>' +
                        '</div>'; 

                $('#anamnese-question-' + idAnamneseQuestion.toString()).append(html);
            } else {
                html =  '<label class="wrapper-inline-block switch-yes-no">' +
                            '<input type="checkbox"  name="switch-' + anamneseQuestionsToggle[i].ID_QUESTION_TOGGLE.toString() + '" id="switch-' + anamneseQuestionsToggle[i].ID_QUESTION_TOGGLE.toString() + '">'  + 
                            '<span class="yes-no" style="margin-right: 2px;" name="span-' + anamneseQuestionsToggle[i].ID_QUESTION_TOGGLE.toString() + '" id="span-' + anamneseQuestionsToggle[i].ID_QUESTION_TOGGLE.toString() + '"></span>' +
                        '</label>';

                $('#anamnese-question-' + idAnamneseQuestion.toString()).removeClass();
                $('#anamnese-question-' + idAnamneseQuestion.toString()).addClass('wrapper-inline-block');
                $('#anamnese-question-' + idAnamneseQuestion.toString()).addClass('wrapper-question');
                $('#anamnese-question-' + idAnamneseQuestion.toString()).addClass('switch-question');
                $('#anamnese-question-' + idAnamneseQuestion.toString()).append(html);

            }  


            callbackAppend();
        }


        xhr.onload = function () {
            if (xhr.status == 200) {
                anamneseQuestionsToggle = $.parseJSON(xhr.responseText);

                if ((anamneseQuestionsToggle.validation || 0) != 0) {
                    showAlert(anamneseQuestionsToggle.validation);
                    return;
                }

                if (anamneseQuestionsToggle.length == 0) {
                    return;
                }

                loop();
            }
        }

        xhr.open('GET', '/questionsToggles/' + idQuestionToggle.toString());
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();
    };

    var appendAnamneseQuestions = function (idAnamnese, callback) {
        let anamneseQuestions;
        let xhr = new XMLHttpRequest();
        let html = '';
        let i = 0;

        let idQuestionToggle;
        let idQuestionDescript;
        let idAnamneseQuestion;

        let loop = function () {
            if (i == 0) {
                append(function () {
                    i++;
                    loop();
                });
            } else {
                if (i < anamneseQuestions.length) {
                    append(function () {
                        i++;
                        loop();
                    });
                } else {
                    callback();
                }
            }
        }

        let append = function (callbackAppend) {
            html = '<div class="anamnese-question" id="anamnese-question-' + anamneseQuestions[i].ID_ANAMNESE_QUESTION.toString() + '">' +
                        '<label class="sub-title-label">' + anamneseQuestions[i].DESCRIPTION + '</label>' +
                    '</div>';

            $('#anamnese-' + idAnamnese.toString()).append(html);

            idQuestionToggle = anamneseQuestions[i].ID_QUESTION_TOGGLE;
            idQuestionDescript = anamneseQuestions[i].ID_QUESTION_DESCRIPT;
            idAnamneseQuestion = anamneseQuestions[i].ID_ANAMNESE_QUESTION;


            appendAnamneseQuestionsToggle(idQuestionToggle, idQuestionDescript, idAnamneseQuestion, function () {
                appendAnamneseQuestionsDescript(idQuestionDescript, idQuestionToggle, idAnamneseQuestion, function () {
                    callbackAppend();
                });
            });
        }

        xhr.onload = function () {
            if (xhr.status == 200) {
                anamneseQuestions = $.parseJSON(xhr.responseText);

                if ((anamneseQuestions.validation || 0) != 0) {
                    showAlert(anamneseQuestions.validation);
                    return;
                }

                if (anamneseQuestions.length == 0) {
                    return;
                }


                loop();
            }
        }

        xhr.open('POST', '/anamnesesQuestions');
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify({ 'type': 'searchList', 'idAnamnese': idAnamnese.toString() }));
    };

    var appendAnamnese = function (idRescordAnamnese, callback) {
        let anamneses;
        let xhr = new XMLHttpRequest();
        let html = '';
        let i = 0;

        let loop = function () {
            if (i == 0) {
                append(function () {
                    i++;
                    loop();
                });
            } else {
                if (i < anamneses.length) {
                    append(function () {
                        i++;
                        loop();
                    });
                } else {
                    callback();
                }
            }
        }

        let append = function (callbackAppend) {
            html =  '<label class="topic-title-label">' + anamneses[i].DESCRIPTION +
                    '</label>' +
                    '<div class="anamnese" id="anamnese-' + anamneses[i].ID_ANAMNESE.toString() + '">' +
                    '</div>' +
                '<hr>';

            $('#record-anamnese-' + idRescordAnamnese.toString()).append(html);

            appendAnamneseQuestions(anamneses[i].ID_ANAMNESE, function () {
                callbackAppend();
            });
        }

        xhr.onload = function () {
            if (xhr.status == 200) {
                anamneses = $.parseJSON(xhr.responseText);

                if ((anamneses.validation || 0) != 0) {
                    showAlert(anamneses.validation);
                    return;
                }

                if (anamneses.length == 0) {
                    return;
                }

                loop();
            }
        }


        xhr.open('POST', '/anamneses');
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify({ 'type': 'searchList', 'idRecordAnamnese': idRescordAnamnese.toString() }));
    };

    var appendRecordsAnamnese = function (callback) {
        let recordsAnamneses;
        let xhr = new XMLHttpRequest();
        let html = '';
        let i = 0;

        let loop = function () {
            if (i == 0) {
                append(function () {
                    i++;
                    loop();
                });
            } else {
                if (i < recordsAnamneses.length) {
                    append(function () {
                        i++;
                        loop();
                    });
                } else {
                    fillScreen();
                }
            }     
        }

        let append = function (callbackAppend) {
            html = '<div id="record-anamnese-' + recordsAnamneses[i].ID_RECORD_ANAMNESE.toString() + '">' +
                        '<label class="wrapper-block title-label">' + recordsAnamneses[i].DESCRIPTION + '</label>';
                    '</div>'

            $('.content-anamnese').append(html);

            appendAnamnese(recordsAnamneses[i].ID_RECORD_ANAMNESE, function () {
                callbackAppend();
            });
        }

        xhr.onload = function () {
            if (xhr.status == 200) {
                recordsAnamneses = $.parseJSON(xhr.responseText);

                if ((recordsAnamneses.validation || 0) != 0) {
                    showAlert(recordsAnamneses.validation);
                    return;
                }

                if (recordsAnamneses.length == 0) {
                    return;
                }

                loop();
            }
        }

        xhr.open('GET', '/recordsAnamneses/1');
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();
    };

    appendRecordsAnamnese();
});

$(document).on('click', '.switch-with-question',
    function () {  
        let input = $(this).closest('.anamnese-question').find('.input-filter');

        input.prop('readonly', !$(this).find('.switch-input').prop('checked'));

        if ($(this).find('.switch-input').prop('checked') == false) {
            input.val('');
        }
});
