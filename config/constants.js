var constants = {
    appointmentStatus = {'aguardando'  : 0, 
                         'atendimento' : 1,
                         'cancelado'   : 2,
                         'marcado'     : 3}
}
                         
module.exports = function(){
    return constants;
}