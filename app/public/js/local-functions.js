var pageLoadClear = function(document, container, content){
	document.empty();
    document.off();
    container.load(content);
}

var isJSON = function(variable) {
    try {
        JSON.parse(variable);
        return true;
    } catch (e) {
        return false;
    }
}

var showAlert = function(validation) {

    var buildShowAlert = function(erros) {
        let htmlErrors =    '<div class="alert alert-danger alert-dismissable modal-dialog center-block" id="alert" name="alert">' +
                                '<strong>Atenção!</strong>' + 
                                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                                '<ul>'  +
                                    erros +
                                '</ul>' +
                            '</div>';  
                            
        $('#content-deshboard-1').append(htmlErrors);
    }

    if (typeof validation != 'undefined') {

        if(validation.length > 0){
            let erros = '';
    
            for(var i = 0; i < validation.length; i++) {
                erros = erros + '<li>' +
                                    validation[i].msg  +
                                '</li>';
            }

            buildShowAlert(erros);
        } else {
            buildShowAlert(isJSON(validation) ? validation: JSON.stringify(validation)); 
        }
    }        
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}