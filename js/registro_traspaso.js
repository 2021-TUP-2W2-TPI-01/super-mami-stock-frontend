import { GET, DELETE, POST, PUT } from './api.js';

var tabla_traspasos;

// CARGAMOS TABLA TRASPASOS
$(document).ready(function () {

    cargar_tablaG();

    $('#tabla_traspasos tbody').on('click', 'td', function () {

        let rowIdx = tabla_traspasos.cell(this).index().row;
        let colIdx = tabla_traspasos.cell(this).index().column;

        let id = tabla_traspasos.rows(rowIdx).data()[0][0];
        //  let username = tabla_usuarios.rows( rowIdx ).data()[0][1] ;


        if (colIdx == 5) {
            modal_detalle_traspaso(id);
        }

    });

    $('#popup_detalle_traspaso').on('hidden.bs.modal', function (e) {
        limpiarFormularioAlta();
    });


})

function llenar_tablaG(datos, tabla) {

    // Se limpia la tabla
    tabla.clear().draw();

    datos.forEach(traspaso => {
        //let edit_button = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="Edit"><i class="zmdi zmdi-edit"></i></button></div></td>';

        let detalles_button = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="More"><i class="zmdi zmdi-more"></i></button></div></td>';

        tabla.row.add([traspaso.id, traspaso.fh_generacion, traspaso.deposito_origen, traspaso.deposito_destino, traspaso.tipo_estado, detalles_button]).draw();


    });

}

async function cargar_tablaG() {

    tabla_traspasos = $('#tabla_traspasos').DataTable({
        "language": datetable_languaje,
        pageLength: 5,
        columnDefs: [
            {
                'targets': [5],
                'searchable': false,
                'orderable': false,

            },
            {
                'targets': 0,
                'visible': false
            }
        ],

    });
    const datos = await GET('/traspasos/');

    if (datos.success) {
        llenar_tablaG(datos.data, tabla_traspasos);
    }
}

function modal_detalle_traspaso(id) {

    $('#btn_aceptar_traspaso').off('click');

    $("#btn_aceptar_traspaso").click(function () {
        modal_detalle_traspaso(id);
    });


    $("#popup_detalle_traspaso").modal("show");

}

//HASTA ACA TABLA GENERAL

//TABLA DE DETALLE TRASPASO

$(document).ready(function () {

    llenar_campos();
})

function llenar_campos(datos, form) {



    datos.forEach(traspaso => {
        form.add([traspaso.id, traspaso.fh_generacion, traspaso.deposito_origen, traspaso.deposito_destino, traspaso.tipo_estado, traspaso.usuario_genero]).draw();
    })
}

var tabla_traspaso;

// CARGAMOS TABLA TRASPASO
$(document).ready(function () {

    cargar_tabla();
    confirmar_traspaso();
    llenar_campos();
    //  $('#popup_detalle_traspaso').modal('hidden.bs.modal');

    $('#tabla_traspaso tbody').on('click', 'td', function () {

        let rowIdx = tabla_traspaso.cell(this).index().row;
        let colIdx = tabla_traspaso.cell(this).index().column;

        let id = tabla_traspaso.rows(rowIdx).data()[0][0];
        // let nombre = tabla_traspaso.rows( rowIdx ).data()[0][1] ;


        if (colIdx == 3) {
            modal_modificacion_traspaso(id);
        }
        else if (colIdx == 4) {
            confirmar_eliminacion_traspaso(id);
        }



    });

})

async function cargar_tabla() {

    tabla_traspaso = $('#tabla_traspaso').DataTable({
        "language": datetable_languaje,
        pageLength: 4,
        columnDefs: [
            {
                'targets': [3, 4],
                'searchable': false,
                'orderable': false,

            },
            {
                'targets': 0,
                'visible': false
            }
        ],

    });

    let path = `/traspaso/${id}/`;


    const datos = await GET(path);

    if (datos.success) {
        llenar_tabla(datos.data, tabla_traspaso);
    }



}

function llenar_tabla(datos, tabla) {

    datos.forEach(detalle_traspaso => {
        //let botones = '';

        let edit_button = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="Edit"><i class="zmdi zmdi-edit"></i></button></div></td>';
        let delete_button = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="Delete"><i class="zmdi zmdi-delete"></i></button></div></td>';

        //botones += "<td><div class=\"table-data-feature\">"
        // Por cada deposito, a los botones de borrar y editar, se le asigna un id dinamico segun el id del deposito
        //botones += "<button class=\"item\" id=\"btn_modif_deposito_" + deposito.id + "\" data-toggle=\"modal\" data-placement=\"top\" title=\"Modificar\"><i class=\"zmdi zmdi-edit\"></i></button>\<button id=\"btn_elim_deposito_" + deposito.id + "\" class=\"item\" data-toggle=\"modal\"  idata-placement=\"top\" title=\"Eliminar\"><i class=\"zmdi zmdi-delete\"></i></button></div></td>";
        tabla.row.add([detalle_traspaso.id, detalle_traspaso.articulo, detalle_traspaso.cantidad, edit_button, delete_button]).draw();


    })

}


/*
// CONFIRMAR TRASPASO
function confirmar_detalle_traspaso(id) {
 
    $('#btn_aceptar_traspaso').off('click');
 
    $("#btn_aceptar_traspaso").click(function (){
        confirmar_detalle_traspaso(id);
    });
 
 //  $("#popup_detalle_traspaso").modal("show");
}
*/
// ELIMINAR TRASPASO

function confirmar_eliminacion_traspaso(id) {

    $('#btn_eliminar_traspaso').off('click');

    $("#mensaje_confirm_delete").text("Seguro que desea dar de baja el traspaso " + id + "?");

    $("#btn_eliminar_traspaso").click(function () {
        eliminar_traspaso(id);
    });

    $("#popup_eliminar_traspaso").modal("show");
}


async function eliminar_traspaso(id) {

    let path = `/traspaso/${id}/`;

    const response = await DELETE(path);

    if (response.success) {

        swal({
            title: "Información",
            text: "Traspaso dado de baja con éxito",
            icon: "success",
        });

        const response_traspasos = await GET('/traspasos/');

        if (response_traspasos.success) {
            llenar_tabla(response_traspasos.data, tabla_traspaso);
        }

    }
    else {
        swal({
            title: "Información",
            text: "No fué posible dar de baja el traspaso",
            icon: "error",
        });
    }

    $("#popup_eliminar_traspaso").modal("hide");
}

/*

// Modificacion deposito

async function modal_modificacion_deposito(id) {

    let path = `/deposito/${id}/`;

    // acá iria el reemplazo del get deposito
    const response = await GET(path);

    if (response.success) {

        $('#btnConfirmarModificacion').off('click');


        console.log(response);

        $('#txtNombre_Modificar').val(response.data.nombre);
        $('#txtDescripcion_Modificar').val(response.data.descripcion);
        $('#txtDomicilio_Modificar').val(response.data.domicilio);
        $('#txtBarrio_Modificar').val(response.data.barrio);
        $('#cmbLocalidad_Modificar').val(response.data.id_localidad);//idlocalidad
        $('#cmbEncargado_Modificar').val(response.data.id_encargado);//idencargado



        $('#btnConfirmarModificacion').click(function() {
            modificar_deposito(id);
        });

        $('#popup_modif_deposito').modal('show');

    }

}


async function modificar_deposito(id) {

    let path = `/deposito/${id}/`;

    let nombre = $('#txtNombre_Modificar').val();
    let descripcion = $('#txtDescripcion_Modificar').val();
    let domicilio = $('#txtDomicilio_Modificar').val();
    let barrio = $('#txtBarrio_Modificar').val();
    let localidad = $('#cmbLocalidad_Modificar').val();
    let encargado = $('#cmbEncargado_Modificar').val();

    if (nombre == '' || encargado == 0) {

        swal({
            title: "Información",
            text: "Debe completar todos los campos",
            icon: "error",
          });

        return;
    }

    let bodyRequest = {
        'nombre' : nombre,
        'descripcion' : descripcion,
        'domicilio' : domicilio,
        'barrio' : barrio,
        'id_localidad': localidad,//id
        'id_encargado' : encargado//id

    }


    const response = await PUT(path, bodyRequest);

    if (response.success) {
        swal({
            title: "Información",
            text: "Modificación exitosa",
            icon: "success",
          });

        const response_depositos = await GET('/depositos/');

        if (response_depositos.success) {
            llenar_tabla(response_depositos.data, tabla_depositos);

        }

        $('#popup_modif_deposito').modal('hide');
    }
    else {
        swal({
            title: "Información",
            text: 'El nombre de depósito cargado ya existe',
            icon: "error",
          });
    }
}



function limpiarFormularioAlta() {
    $('#nombre').val('');
    $('#descripcion').val('');
    $('#domicilio').val('');
    $('#barrio').val('');
    $('#SelectLocalidad').val(0);
    $('#SelectEncargado').val(0);
}
*/