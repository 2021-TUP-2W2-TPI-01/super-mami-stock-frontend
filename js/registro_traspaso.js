import { GET,POST } from "./api.js";

var tabla_traspasos = null;
var tabla_detalle_traspasos = null;
var detalle_traspaso_actual = null;
var editable = true;

$(document).ready(function(){

    cargar_tabla();

    $('#tabla_traspasos tbody').on( 'click', 'td', function () {
       
        let rowIdx = tabla_traspasos.cell( this ).index().row;
        let colIdx = tabla_traspasos.cell(this).index().column;  

        let id_traspaso = tabla_traspasos.rows( rowIdx ).data()[0][0] ;
    

        if (colIdx == 5) {
            show_detalle(id_traspaso);
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


function incializar_tabla_traspasos(){
    tabla_traspasos  = $('#tabla_traspasos').DataTable({
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
                     
    });
}

async function cargar_tabla() {
    
    if (tabla_traspasos == null) {
        incializar_tabla_traspasos();
    }

    const datos = await GET('/traspasos/');

    if (datos.success) {
        llenar_tabla(datos.data, tabla_traspasos);
    }
    else {
        console.error(`Error: ${datos.data}. Status: ${datos.statusCode}`);
    }

    
    
}




function llenar_tabla(datos, tabla){

    // Se limpia la tabla
    tabla.clear().draw();

    datos.forEach(traspaso => {
        //let botones = '';

        let ver_detalle_boton = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="Edit"><i class="fas fa-eye"></i></button></div></td>';
        
        tabla.row.add([traspaso.id, traspaso.fh_generacion, traspaso.deposito_origen, traspaso.deposito_destino, traspaso.tipo_estado, ver_detalle_boton]).draw();
   

    });

}

async function show_detalle(id_traspaso) {

    $('#btnRechazarTraspaso').off('click');
    $('#btnConfirmarTraspaso').off('click');
    $('#btnModificadoTraspaso').off('click');

    let path = `/traspaso/${id_traspaso}/`;

    const response = await GET(path);

   // let nroRemito;

    if (response.success) {
        
       // $('#txtPedido').text(response.data.numero_remito_asociado);
       $('#txtDepDestino').text(response.data.deposito_destino);
       $('#txtDepOrigen').text(response.data.deposito_origen);
        $('#txtEstado').text(response.data.tipo_estado);
        $('#txtFecha').text(response.data.fh_generacion);
        $('#txtUsuario').text(response.data.usuario_genero);

        if (response.data.tipo_estado != 'Pendiente') {
            $('#txtFHProcesado').text(moment(response.data.fh_procesado).format('DD/MM/YYYY - HH:mm') + "HS");/////////generacion
            $('#txtUsuarioGenero').text(response.data.usuario_proceso);//////genero

            $('#lblObservacion').text(response.data.observaciones);
            $('#seccionObservaciones').show();

           editable = false;
        }
        else {
            $('#txtFHProcesado').text('-');
            $('#txtUsuarioGenero').text('SIN PROCESAR');

            $('#seccionObservaciones').hide();
            editable = true;
        }
        

       // nroRemito = response.data.numero_remito_asociado;

        if (tabla_detalle_traspasos == null) {
            incializar_tabla_detalle();
        }

        cargar_tabla_detalle(response.data.detalle_traspaso);
        


        toggle_detalle_tabla(true);
        
        if (response.data.tipo_estado != 'Pendiente') {
            $('#btnRechazarTraspaso').hide();
            $('#btnConfirmarTraspaso').hide();
            $('#btnModificadoTraspaso').hide();
        } 
        else {
            $('#btnRechazarTraspaso').show();
            $('#btnConfirmarTraspaso').show();
            $('#btnModificadoTraspaso').hide();
        }
    }

    $('#btnRechazarTraspaso').click(function(){
        confirmarRechazarTraspaso(id_traspaso) //nroRemito
    });
    
    $('#btnConfirmarTraspaso').click(function(){
        confirmarAceptarTraspaso(id_traspaso);
    });

    $('#btnModificadoTraspaso').click(function(){
        confirmarModificarTraspaso(id_traspaso);
    });
}

function confirmarModificarTraspaso(id_traspaso) { //nroRemito
    $('#btn_confirmar_modificar_traspaso').off('click');

    $('#popup_modificar_traspaso').modal('show');

    $('#mensaje_confirm_modificar').text(`¿Desea confirmar el traspaso modificado?`);

    $('#btn_confirmar_modificar_traspaso').click(function(){
        modificarTraspaso(id_traspaso);
    });
}


async function modificarTraspaso(id_traspaso) {

    let path = `/traspaso/procesar/modificado/${id_traspaso}/`;//////////////////////////

    let observacion = $('#txtObservacionModificado').val();

    let bodyRequest = {
        "observaciones" : observacion,
        "detalle_traspaso" : JSON.stringify(detalle_traspaso_actual)///////////////////////////////////s
    }

    const response = await POST(path, bodyRequest);
    
    if (response.success) {
        
        
        swal({
            title: "Información",
            text: "Traspaso confirmado con modificaciones con éxito",
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

    $('#popup_modificar_traspaso').modal('hide');

}

async function aceptarTraspaso(id_traspaso) {
    
    let path = `/traspaso/procesar/confirmado/${id_traspaso}/`;

    let bodyRequest = {}

    const response = await POST(path, bodyRequest);
    
    if (response.success) {

        swal({
            title: "Información",
            text: "Traspaso confirmado con éxito",
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

    $('#popup_aceptar_traspaso').modal('hide');
}


function confirmarAceptarTraspaso(id_traspaso) {
    $('#btn_confirmar_aceptar_traspaso').off('click');

    $('#popup_aceptar_traspaso').modal('show');

    $('#mensaje_confirm_aceptar').text(`¿Desea confirmar el traspaso?`); // con el remito N° ${nro_remito}?

    $('#btn_confirmar_aceptar_traspaso').click(function(){
        aceptarTraspaso(id_traspaso);
    });
}


function confirmarRechazarTraspaso(id_traspaso) {
    $('#btn_confirmar_rechazo_traspaso').off('click');

    $('#popup_rechazo_traspaso').modal('show');

    $('#mensaje_confirm_rechazo').text(`¿Desea rechazar el traspaso?`);// con el remito N° ${nro_remito}

    $('#btn_confirmar_rechazo_traspaso').click(function(){
        rechazarTraspaso(id_traspaso);
    });
}


async function rechazarTraspaso(id_traspaso) {
    let path = `/traspaso/procesar/rechazado/${id_traspaso}/`;

    let observacion = $('#txtObservacion').val();

    let bodyRequest = {
        "observaciones" : observacion
    }

    const response = await POST(path, bodyRequest);
    
    if (response.success) {

        swal({
            title: "Información",
            text: "Traspaso rechazado con éxito",
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

    $('#popup_rechazo_traspaso').modal('hide');

}

function incializar_tabla_detalle() {

    tabla_detalle_traspasos = $('#tabla_detalle_traspaso').DataTable({
        "language": datetable_languaje,
        pageLength: 7,
        pageLength: 250,
        info: false,
        scrollY: 240,
        paging: false,
        columnDefs: [
            {
                'targets': [0],  
                'visible': false      
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


    $('#tabla_detalle_traspaso tbody').on( 'click', 'td', function () {
       
        let rowIdx = tabla_detalle_traspasos.cell( this ).index().row;
        let colIdx = tabla_detalle_traspasos.cell(this).index().column;  

        let id_articulo = tabla_detalle_traspasos.rows( rowIdx ).data()[0][0] ;
        let articulo= tabla_detalle_traspasos.rows( rowIdx ).data()[0][1] ;
        let cantidad = tabla_detalle_traspasos.rows( rowIdx ).data()[0][2] ;
        

        if (colIdx == 3 && editable) {
            modificar_cantidad(id_articulo,  articulo, cantidad);
        }
    
    } );  
}


function modificar_cantidad(id_articulo, articulo, cantidad) {

    $('#btnGuardarCantidadIngresada').off('click');

    $('#cantidad_cargar').val(cantidad);

    $('#articuloModificar').text(articulo);

    $('#modalCantidad').modal('show');

    $('#btnGuardarCantidadIngresada').click(function(){

        let cantidad_modificada = $('#cantidad_cargar').val();

        guardarCantidad(id_articulo, cantidad_modificada);

    });

}

function guardarCantidad(id_articulo, cantidad) {

    console.log(cantidad);
    
    for (var i = 0; i < detalle_traspaso_actual.length ; i++) {
        if (detalle_traspaso_actual[i].id_articulo == id_articulo) {
            
            detalle_traspaso_actual[i].cantidad = parseInt(cantidad);
        }
    }

    cargar_tabla_detalle(detalle_traspaso_actual);

    $('#modalCantidad').modal('hide');

    toggle_modificado_confirmado(true);
}

function cargar_tabla_detalle(detalles) {

    detalle_traspaso_actual = detalles;

    tabla_detalle_traspasos.clear().draw();

    detalles.forEach(detalle_traspaso => { //////////////////////////////////////////detalle

        let edit_button = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="Edit"><i class="zmdi zmdi-edit"></i></button></div></td>';

        if (!editable) {
            edit_button = ''
        }

        tabla_detalle_traspasos.row.add([detalle_traspaso.id_articulo, detalle_traspaso.articulo, detalle_traspaso.cantidad, edit_button]).draw();

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
        adjust(tabla_detalle_traspasos);
    }
    else {
        $('#seccion_detalle').hide();
        $('#seccion_tabla').show();
        adjust(tabla_traspasos);

        if (reload) {
            cargar_tabla();
        }
    }
   

}


function toggle_modificado_confirmado(modificado) {

    if (modificado) {
        $('#btnModificadoTraspaso').show();
        $('#btnConfirmarTraspaso').hide();
    }
    else {
        $('#btnModificadoTraspaso').hide();
        $('#btnConfirmarTraspaso').show();
    }
}
