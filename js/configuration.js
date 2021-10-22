var datetable_languaje =  {
    "lengthMenu": "",//Mostrando _MENU_ resultados por página",
    "zeroRecords": "No hay resultados",
    "info": "(Total _MAX_ reg.)   Página _PAGE_ de _PAGES_",
    "infoEmpty": "No hay resultados",
    "infoFiltered": "(filtrando _TOTAL_ de _MAX_ registros)",
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

function setColorScaleRuler(percent, row , menor_a_mayor=true) {
    let data = percent.replace("%","");

    if (menor_a_mayor) {
        if (parseInt(data) > 70 ) {
            row.css('color','#28a745');
        }
        else if  (parseInt(data) > 35) {
            row.css('color','#ffc107');
        }
        else {
            row.css('color','#dc3545');
        }
    }
    else {
        if (parseInt(data) > 70 ) {
            row.css('color','#dc3545');
        }
        else if  (parseInt(data) > 35) {
            row.css('color','#ffc107');
        }
        else {
            row.css('color','#28a745');
        }
    }
}

function generateReportHeader(nombreReporte, filtros, xlsx)
{
    var sheet = xlsx.xl.worksheets['sheet1.xml'];

    
    var downrows = Object.entries(filtros).length +3;
    var clRow = $('row', sheet);
    //update Row
    clRow.each(function () {
        var attr = $(this).attr('r');
        var ind = parseInt(attr);
        ind = ind + downrows;
        $(this).attr("r",ind);
    });


    // Update  row > c
    $('row c ', sheet).each(function () {
        var attr = $(this).attr('r');
        var pre = attr.substring(0, 1);
        var ind = parseInt(attr.substring(1, attr.length));
        ind = ind + downrows;
        $(this).attr("r", pre + ind);
    });



    function Addrow(index,data) {
        msg='<row r="'+index+'">'
        for(i=0;i<data.length;i++){
            var key=data[i].k;
            var value=data[i].v;
            msg += '<c t="inlineStr" r="' + key + index + '" s="2">';
            msg += '<is>';
            msg +=  '<t>'+value+'</t>';
            msg+=  '</is>';
            msg+='</c>';
        }
        msg += '</row>';
        return msg;
    }

    // Aplica estilo Bold y alineado a la izquierda a la primera fila de la columna "A"
    // Esta celda sería para el encabezado
    
    $('row:eq(0) c[r^="A"]', sheet).attr( 's', '2' ); 


    
    var _filtros = "";
    var _heightRow = 0;

    _filtros += Addrow(1, [{ k: 'A', v: `${nombreReporte}` }]);

    var _row = 3;

    // Recorro los filtros que hay y los añado
    for (var [key, value] of Object.entries(filtros)) 
    {
        _filtros += Addrow(_row, [{ k: 'A', v: `${key}:` },{k: 'B', v:`${value}`}]);
        _row++;
    }
    sheet.childNodes[0].childNodes[1].innerHTML = _filtros + sheet.childNodes[0].childNodes[1].innerHTML;
    $(`c[r=A${_row+1}] t`, sheet).text("");


    // Aplico el ajuste de tamaño a la primer columna
    $('col', sheet).each(function(index) {
        if (index == 0) {

            $(this).attr('width', 25);

        }
    });
}

var locale_daterangepicker = {
    "format": "MM/DD/YYYY",
    "separator": " - ",
    "applyLabel": "Aceptar",
    "cancelLabel": "Cancelar",
    "fromLabel": "Desde",
    "toLabel": "Hasta",
    "customRangeLabel": "Personalizado",
    "weekLabel": "W",
    "daysOfWeek": [
        "Do",
        "Lu",
        "Ma",
        "Mi",
        "Ju",
        "Vi",
        "Sa"
    ],
    "monthNames": [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Deciembre"
    ],
    "firstDay": 1
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