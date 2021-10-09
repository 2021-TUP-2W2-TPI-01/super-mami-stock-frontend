function cargarInfoUsuario() {
    $('.lblUsuario').text(`${user_info_nombre()} ${user_info_apellido()}`);
    $('#lblEmail').text(`${user_info_email()}`);
}

function cargarEventosGenerales() {
    
    $('#btnLogout').click(function() {
        logoutSession();
    });
}

function configPermisosUsuario() {
    
    if (user_info_tipo_rol() == 'Gerente Regional') {

        $('#item-existencias').hide();
        $('#item-informes-stockvencim').hide();
        $('#item-informes-movdep').hide();
        $('#item-usuarios').hide();
    }
    else if (user_info_tipo_rol() == 'Encargado de Depósito') {
        $('#item-articulos').hide();
        $('#item-depositos').hide();
        $('#item-informes-stockdep').hide();
        $('#item-informes-movpordep').hide();
        $('#item-usuarios').hide();
    }
    else if (user_info_tipo_rol() == 'Operario') {
        $('#item-articulos').hide();
        $('#item-depositos').hide();
        $('#item-existencias-recpedidos').hide();
        $('#item-existencias-gentraspaso').hide();
        $('#item-existencias-rectraspasos').hide();
        $('#item-informes-movdep').hide();
        $('#item-informes-stockdep').hide();
        $('#item-informes-movpordep').hide();
        $('#item-usuarios').hide();
    }
}

$(document).ready(function() {
    cargarInfoUsuario();
    cargarEventosGenerales();
    configPermisosUsuario();
});