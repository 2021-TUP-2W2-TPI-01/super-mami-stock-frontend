import { GET, POST } from "./api.js";


var f_movimientos_inicio = moment().format('YYYY-MM-DD');
var f_movimientos_fin = moment().format('YYYY-MM-DD');
var tabla_reporte;


$(document).ready(function (){
    
    innitFiltroFechas();
    innitTablaReporte();
    innitComboEstados();
    innitComboMovimientos();
    getEstados();

    $('#btnVerReporte').click(function() {
        verReporte();
    });

});

async function verReporte() 
{   

    let lstEstados = $('#cmbEstados').val().toString();

    if (lstEstados == null || lstEstados == '') {
        swal({
            title: "Atención",
            text: `Debe seleccionar al menos un estado`,
            icon: "warning",
          });

        return;
    }

    let lstMovimientos = $('#cmbMovimientos').val().toString();

    if (lstMovimientos == null || lstMovimientos == '') {
        swal({
            title: "Atención",
            text: `Debe seleccionar al menos un tipo de movimiento`,
            icon: "warning",
          });

        return;
    }

    
    let bodyRequest = {
        fecha_desde : f_movimientos_inicio,
        fecha_hasta : f_movimientos_fin,
        tipos_estados : lstEstados,
        tipos_movimientos : lstMovimientos
   
    };


    let path = `/reportes/movimientos_deposito/`;

    const response = await POST(path,bodyRequest);

    tabla_reporte.clear().draw();

    if (response.success) {
        if (response.data.length > 0) {
            cargarTablaReporte(response.data);
        }
        else {
            swal({
                title: "Atención",
                text: `No hay resultados para ese criterio de búsqueda`,
                icon: "warning",
              });
        }
    }
    else {
        swal({
            title: "Atención",
            text: `${response.data}`,
            icon: "error",
          });
    }
}


function cargarTablaReporte(data) {

    data.forEach(item => {
        tabla_reporte.row.add([item.fecha_generacion, item.tipo_movimiento, item.estado, item.fh_procesado, item.procesado_por]).draw();
    });

}

function innitComboEstados() {

    $('.select2').select2(
    {
        language: "es",
        allowClear: true,
        closeOnSelect: false,
        minimumResultsForSearch: Infinity
    });   

    $('#cmbEstados').on('select2:select', function (e) {
        let data = e.params.data;
    
        let _seleccion = data.id;
    
        if ($('#cmbEstados').val().toString().includes('todos'))
        {
            $('#cmbEstados').val(null).trigger('change');
            $('#cmbEstados').val(_seleccion).trigger('change');
        }
        
        
    });

}


function innitComboMovimientos() {

    $('.select2').select2(
    {
        language: "es",
        allowClear: true,
        closeOnSelect: false,
        minimumResultsForSearch: Infinity
    });   

    $('#cmbMovimientos').on('select2:select', function (e) {

        let data = e.params.data;
    
        let _seleccion = data.id;
    

        if ($('#cmbMovimientos').val().toString().includes('todos'))
        {
            $('#cmbMovimientos').val(null).trigger('change');
            $('#cmbMovimientos').val(_seleccion).trigger('change');
        }   
    });

}

function innitTablaReporte() {

    tabla_reporte = $('#tabla_resultado_reporte').DataTable({
        "language": datetable_languaje,
        pageLength: 5,
        columnDefs: [
            {
                'targets': 0,  
                'searchable': true,
                'orderable': true      
            },
        ],
        order: [
            [ 0, "asc" ],
            [ 1, "asc" ]
        ],
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text:'<i class="fas fa-file-excel"></i> Exportar',
                className: 'btn btn-success',
                title:`Reporte Movimientos del Deposito ${moment().format('DD-MM-YYYY HH.mm')} HS`,
                customize: function (xlsx)
                {

                    var filtros = {

                        'Fecha de Emisión' : `${moment().format('DD/MM/YYYY HH:mm')} HS`,
                        'Emitido por' : `${user_info_nombre()} ${user_info_apellido()} (${user_info_username()})`,
                        'Rango de fechas' : `${$('#fecha_filtro').val()}`
                    }


                    generateReportHeader('Movimientos del depósito', filtros, xlsx);

                }
            }
        ],
        rowCallback: function( row, data, iDisplayIndex ) {
            setColorScaleRuler(data[3],$(row).find('td:eq(3)'), false);

            // Alineación a la derecha valores numericos
            $(row).find('td:eq(2)').addClass('text-right');
            $(row).find('td:eq(3)').addClass('text-right');
            $(row).find('td:eq(4)').addClass('text-right');
            $(row).find('td:eq(5)').addClass('text-right');
            $(row).find('td:eq(6)').addClass('text-right');
        },
        
    });

}


async function getEstados() {

    let cmbEstados = document.getElementById("cmbEstados");
    
    const response = await GET('/tipos_estados/');

    if (response.success) {

        let optTodos = document.createElement("option");
   
        optTodos.appendChild(document.createTextNode("Todos"));
        optTodos.value = 'todos';

        cmbEstados.appendChild(optTodos);

        response.data.forEach(estado => {

           // Select estados
           let opt = document.createElement("option");
   
           opt.appendChild(document.createTextNode(estado.descripcion));
           opt.value = estado.id;
   
           cmbEstados.appendChild(opt);
        });
        
    }
    else {
        console.error(`Error: ${response.data}`);
    }
}


function innitFiltroFechas() {

    $('#fecha_filtro').daterangepicker({

        startDate: moment(),
        endDate: moment(),
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últ. 7 días': [moment().subtract(6, 'days'), moment()],
            'Últ. 30 días': [moment().subtract(29, 'days'), moment()]
        },
    
        "alwaysShowCalendars": true,
        "showDropdowns": false,
        "minYear": 1901,
        "maxYear": 2999,
        "maxSpan": {
            "days": 31
        },
        "locale": locale_daterangepicker,
        autoUpdateInput: false,
        "maxDate": moment(),
        "buttonClasses": "btn btn-md btn-primary",
        "cancelClass": "btn btn-md btn-default"
    }, function(start, end, label) {
       
        f_movimientos_inicio = start.format('YYYY-MM-DD') ;
        f_movimientos_fin = end.format('YYYY-MM-DD');
    
      
    });
    

    $('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });

    let today = moment().format('DD/MM/YYYY');
    let yesterday = moment().subtract(1,'days').format('DD/MM/YYYY');

    $('input[name="datefilter"]').val(`${today} - ${today}`);
    
    
    
}

