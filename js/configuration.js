var datetable_languaje =  {
    "lengthMenu": "",//Mostrando _MENU_ resultados por página",
    "zeroRecords": "No hay resultados",
    "info": "(Total _MAX_ reg.)   Página _PAGE_ de _PAGES_",
    "infoEmpty": "No hay resultados",
    "infoFiltered": "(filtrando de _MAX_ registros)",
    "loadingRecords": "Cargando...",
    "processing":     "Procesando...",
    "search":         "Buscar:",
    "paginate": {
        "first":      "Prim.",
        "last":       "Últ.",
        "next":       ">",
        "previous":   "<"
    },

    "aria": {
        "sortAscending":  ": orden ascendente",
        "sortDescending": ": orden descendente"
    },
    select: {
        rows: {
            _: "%d reg. seleccionados",
            0: "",
            1: "1 reg. seleccionado"
        }
    }
}

function cargarInfoUsuario() {
    $('.lblUsuario').text(`${user_info_nombre()} ${user_info_apellido()}`);
    $('#lblEmail').text(`${user_info_email()}`);
    $('#lblRol').text(`${user_info_tipo_rol()}`);
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