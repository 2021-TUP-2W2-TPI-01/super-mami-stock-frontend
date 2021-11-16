import { GET,POST } from "./api.js";

var tabla_pedidos = null;
var tabla_detalle_pedidos = null;
var detalle_pedido_actual = null;
var editable = true;

$(document).ready(function(){

    cargar_tabla();

    $('#tabla_pedidos tbody').on( 'click', 'td', function () {
       
        let rowIdx = tabla_pedidos.cell( this ).index().row;
        let colIdx = tabla_pedidos.cell(this).index().column;  

        let id_pedido = tabla_pedidos.rows( rowIdx ).data()[0][0] ;
    

        if (colIdx == 5) {
            show_detalle(id_pedido);
        }
    
    } );  

    toggle_detalle_tabla(false);

    $('#btnRegresar').click(function(){
        toggle_detalle_tabla(false);
    });

});

$( document ).ajaxStart(function() {
    $('#loading').show();
});

$( document ).ajaxComplete(function( event,request, settings ) {
    $('#loading').hide();
});

$('#loading').hide();


function incializar_tabla_pedidos(){
    tabla_pedidos  = $('#tabla_pedidos').DataTable({
        "language": datetable_languaje,
        pageLength: 7,
        columnDefs: [
            {
                'targets': 5,  
                'searchable': false,
                'orderable': false      
            },
            {
                'targets': 0,  
                'visible': false      
            }
        ],
        rowCallback: function( row, data, iDisplayIndex ) {
            if ( data[3] == "Pendiente" )
            {
                $(row).find('td:eq(2)').css('color','#ffc107');
            }
            if (data[3] == "Procesado" || data[3] == "Procesado con modificaciones")
            {
                $(row).find('td:eq(2)').css('color','#28a745');
            }
            if (data[3] == "Rechazado")
            {
                $(row).find('td:eq(2)').css('color','#dc3545');
            }
        },
    
    });
}

async function cargar_tabla() {
    
    if (tabla_pedidos == null) {
        incializar_tabla_pedidos();
    }

    const datos = await GET('/pedidos/');

    if (datos.success) {
        llenar_tabla(datos.data, tabla_pedidos);
    }
    else {
        console.error(`Error: ${datos.data}. Status: ${datos.statusCode}`);
    }

    
    
}




function llenar_tabla(datos, tabla){

    // Se limpia la tabla
    tabla.clear().draw();

    datos.forEach(pedido => {
        //let botones = '';

        let ver_detalle_boton = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="Ver detalle"><i class="fas fa-eye"></i></button></div></td>';
        
        tabla.row.add([pedido.id, pedido.fecha, pedido.numero_remito_asociado, pedido.tipo_estado, pedido.proveedor, ver_detalle_boton]).draw();
   
        
    });

}

async function show_detalle(id_pedido) {

    $('#btnRechazarPedido').off('click');
    $('#btnConfirmarPedido').off('click');
    $('#btnModificadoPedido').off('click');

    let path = `/pedido/${id_pedido}/`;

    const response = await GET(path);

    let nroRemito;

    if (response.success) {
        
        $('#txtPedido').text(response.data.numero_remito_asociado);
        $('#txtEstado').text(response.data.tipo_estado);
        $('#txtFecha').text(response.data.fecha);
        $('#txtProveedor').text(response.data.proveedor);

        if (response.data.tipo_estado == 'Procesado' || response.data.tipo_estado == 'Procesado con modificaciones' ) {
            $('#txtFHProcesado').text(moment(response.data.fh_procesado).format('DD/MM/YYYY - HH:mm') + "HS");
            $('#txtUsuarioProceso').text(response.data.usuario_proceso);

            $('#lblObservacion').text(response.data.observaciones);
            $('#seccionObservaciones').show();

            editable = false;

            $('#txtEstado').css("color", "#28a745")
        }
        else if (response.data.tipo_estado == 'Rechazado') {
            $('#txtFHProcesado').text(moment(response.data.fh_procesado).format('DD/MM/YYYY - HH:mm') + "HS");
            $('#txtUsuarioProceso').text(response.data.usuario_proceso);

            $('#lblObservacion').text(response.data.observaciones);
            $('#seccionObservaciones').show();

            editable = false;

            $('#txtEstado').css("color", "#dc3545")
        }
        else {
            $('#txtFHProcesado').text('-');
            $('#txtUsuarioProceso').text('SIN PROCESAR');
            
            $('#seccionObservaciones').hide();
            editable = true;

            $('#txtEstado').css("color", "#ffc107")
        }
        

        nroRemito = response.data.numero_remito_asociado;

        if (tabla_detalle_pedidos == null) {
            incializar_tabla_detalle();
        }

        cargar_tabla_detalle(response.data.detalles_pedido);
        


        toggle_detalle_tabla(true);
        
        if (response.data.tipo_estado != 'Pendiente') {
            $('#btnRechazarPedido').hide();
            $('#btnConfirmarPedido').hide();
            $('#btnModificadoPedido').hide();
        } 
        else {
            $('#btnRechazarPedido').show();
            $('#btnConfirmarPedido').show();
            $('#btnModificadoPedido').hide();
        }
    }

    $('#btnRechazarPedido').click(function(){
        confirmarRechazarPedido(id_pedido, nroRemito)
    });
    
    $('#btnConfirmarPedido').click(function(){
        confirmarAceptarPedido(id_pedido, nroRemito);
    });

    $('#btnModificadoPedido').click(function(){
        confirmarModificarPedido(id_pedido, nroRemito);
    });
}

function confirmarModificarPedido(id_pedido, nro_remito) {
    $('#btn_confirmar_modificar_pedido').off('click');

    $('#popup_modificar_pedido').modal('show');

    $('#mensaje_confirm_modificar').text(`¿Desea confirmar el pedido modificado con el remito N° ${nro_remito}?`);

    $('#btn_confirmar_modificar_pedido').click(function(){
        if ($('#txtObservacionModificado').val().trim() == ''){
            swal({
                title: "Error!",
                text: "La observación es obligatoria",
                icon: "error",
            });
            return;
        }
        modificarPedido(id_pedido);
    });
}


async function modificarPedido(id_pedido) {

    let path = `/pedido_modificado/${id_pedido}/`;

    let observacion = $('#txtObservacionModificado').val();

    let bodyRequest = {
        "observaciones" : observacion,
        "detalles_pedido" : JSON.stringify(detalle_pedido_actual)
    }

    const response = await POST(path, bodyRequest);
    
    if (response.success) {

        swal({
            title: "Información",
            text: "Pedido confirmado con modificaciones con éxito",
            icon: "success",
        });

        toggle_detalle_tabla(false, true);
    }
    else {
        swal({
            title: "Información",
            text: `${response.data}`,
            icon: "error",
        });
    }

    $('#popup_modificar_pedido').modal('hide');

}

async function aceptarPedido(id_pedido) {
    
    let path = `/pedido_confirmado/${id_pedido}/`;

    let bodyRequest = {}

    const response = await POST(path, bodyRequest);
    
    if (response.success) {

        swal({
            title: "Información",
            text: "Pedido confirmado con éxito",
            icon: "success",
        });

        toggle_detalle_tabla(false, true);
    }
    else {
        swal({
            title: "Información",
            text: `${response.data}`,
            icon: "error",
        });
    }

    $('#popup_aceptar_pedido').modal('hide');
}


function confirmarAceptarPedido(id_pedido, nro_remito) {
    $('#btn_confirmar_aceptar_pedido').off('click');

    $('#popup_aceptar_pedido').modal('show');

    $('#mensaje_confirm_aceptar').text(`¿Desea confirmar el pedido con el remito N° ${nro_remito}?`);

    $('#btn_confirmar_aceptar_pedido').click(function(){
        aceptarPedido(id_pedido);
    });
}


function confirmarRechazarPedido(id_pedido, nro_remito) {
    $('#btn_confirmar_rechazo_pedido').off('click');

    $('#popup_rechazo_pedido').modal('show');

    $('#mensaje_confirm_rechazo').text(`¿Desea rechazar el pedido con el remito N° ${nro_remito}?`);

    $('#btn_confirmar_rechazo_pedido').click(function(){
        if ($('#txtObservacion').val().trim() == ''){
            swal({
                title: "Error!",
                text: "La observación es obligatoria",
                icon: "error",
            });
            return;
        }
        rechazarPedido(id_pedido);
    });
}


async function rechazarPedido(id_pedido) {
    let path = `/pedido_rechazado/${id_pedido}/`;

    let observacion = $('#txtObservacion').val();

    let bodyRequest = {
        "observaciones" : observacion
    }

    const response = await POST(path, bodyRequest);
    
    if (response.success) {

        swal({
            title: "Información",
            text: "Pedido rechazado con éxito",
            icon: "success",
        });

        toggle_detalle_tabla(false, true);
    }
    else {
        swal({
            title: "Información",
            text: `${response.data}`,
            icon: "error",
        });
    }

    $('#popup_rechazo_pedido').modal('hide');

}

function incializar_tabla_detalle() {

    tabla_detalle_pedidos = $('#tabla_detalle_pedido').DataTable({
        "language": datetable_languaje,
        pageLength: 7,
        pageLength: 250,
        info: false,
        scrollY: 240,
        paging: false,
        columnDefs: [
            {
                'targets': [0,1],  
                'visible': false      
            },{
                'targets': 4,  
                'searchable': false,
                'orderable': false      
            }
    ],
    preDrawCallback: function (settings) {
        var api = new $.fn.dataTable.Api(settings);
        var pagination = $(this)
            .closest('.dataTables_wrapper')
            .find('.dataTables_paginate');

            pagination.hide();

    }
                     
    });


    $('#tabla_detalle_pedido tbody').on( 'click', 'td', function () {
       
        let rowIdx = tabla_detalle_pedidos.cell( this ).index().row;
        let colIdx = tabla_detalle_pedidos.cell(this).index().column;  

        let id_articulo = tabla_detalle_pedidos.rows( rowIdx ).data()[0][1] ;
        let cantidad = tabla_detalle_pedidos.rows( rowIdx ).data()[0][3] ;
        let nombre = tabla_detalle_pedidos.rows( rowIdx ).data()[0][2] ;

        if (colIdx == 4 && editable) {
            modificar_cantidad(id_articulo, cantidad, nombre);
        }
    
    } );  
}


function modificar_cantidad(id_articulo, cantidad, nombre) {

    $('#btnGuardarCantidadIngresada').off('click');

    $('#cantidad_cargar').val(cantidad);

    $('#articuloModificar').text(nombre);

    $('#modalCantidad').modal('show');

    $('#btnGuardarCantidadIngresada').click(function(){

        let cantidad_modificada = $('#cantidad_cargar').val();

        guardarCantidad(id_articulo, cantidad_modificada);

    });

}

function guardarCantidad(id_articulo, cantidad) {

    console.log(cantidad);
    
    for (var i = 0; i < detalle_pedido_actual.length ; i++) {
        if (detalle_pedido_actual[i].id_articulo == id_articulo) {
            
            detalle_pedido_actual[i].cantidad = parseInt(cantidad);
        }
    }

    cargar_tabla_detalle(detalle_pedido_actual);

    $('#modalCantidad').modal('hide');

    toggle_modificado_confirmado(true);
}

function cargar_tabla_detalle(detalles) {

    detalle_pedido_actual = detalles;

    tabla_detalle_pedidos.clear().draw();

    detalles.forEach(detalle => {

        let edit_button = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="Edit"><i class="zmdi zmdi-edit"></i></button></div></td>';

        if (!editable) {
            edit_button = ''
        }

        tabla_detalle_pedidos.row.add([detalle.id, detalle.id_articulo, detalle.nombre, detalle.cantidad, edit_button]).draw();

    });

    
}

function adjust(controlname)
{
  controlname.columns.adjust();
}


function toggle_detalle_tabla(ver_detalle, reload=false){

    if (ver_detalle) {

        toggle_modificado_confirmado(false);
        
        $('#seccion_detalle').show();
        $('#seccion_tabla').hide();
        adjust(tabla_detalle_pedidos);
    }
    else {
        $('#seccion_detalle').hide();
        $('#seccion_tabla').show();
        adjust(tabla_pedidos);

        if (reload) {
            cargar_tabla();
        }
    }
   

}


function toggle_modificado_confirmado(modificado) {

    if (modificado) {
        $('#btnModificadoPedido').show();
        $('#btnConfirmarPedido').hide();
    }
    else {
        $('#btnModificadoPedido').hide();
        $('#btnConfirmarPedido').show();
    }
}