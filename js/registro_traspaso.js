import { GET, DELETE, POST, PUT } from './api.js';

var tabla_traspasos;

// CARGAMOS TABLA TRASPASOS
$(document).ready(function () {

    cargar_tablaG();


    $('#tabla_traspasos tbody').on('click', 'td', function () {

        let rowIdx = tabla_traspasos.cell(this).index().row;
        let colIdx = tabla_traspasos.cell(this).index().column;

        let id = tabla_traspasos.rows(rowIdx).data()[0][0];
       


        if (colIdx == 5) {
            modal_detalle_traspaso(id);
        }

    });

    $('#popup_detalle_traspaso').on('hidden.bs.modal', function (e) {
        limpiarFormularioAlta();
    });


})
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

function llenar_tablaG(datos, tabla) {

    // Se limpia la tabla
    tabla.clear().draw();

    datos.forEach(traspaso => {
        //let edit_button = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="Edit"><i class="zmdi zmdi-edit"></i></button></div></td>';

        let detalles_button = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="More"><i class="zmdi zmdi-more"></i></button></div></td>';

        tabla.row.add([traspaso.id, traspaso.fh_generacion, traspaso.deposito_origen, traspaso.deposito_destino, traspaso.tipo_estado, detalles_button]).draw();


    });

}

//HASTA ACA TABLA GENERAL, HATAS ACA FUNCIONA

//ACA ME TRAE EL POP UP DE DETALLE
function modal_detalle_traspaso(id) {


    $("#btn_aceptar_traspaso").click(function () {
        detalle_traspaso(id);
    });


    $("#popup_detalle_traspaso").modal("show");

}



var tabla_traspaso;
$(document).ready(function () {

    cargar_tabla();
    
    detalle_traspaso(id);


    $('#tabla_traspaso tbody').on('click', 'td', function () {

        let rowIdx = tabla_traspaso.cell(this).index().row;
        let colIdx = tabla_traspaso.cell(this).index().column;
    
        let id = tabla_traspaso.rows(rowIdx).data()[0][0];
       // let  = tabla_traspaso.rows( rowIdx ).data()[0][1] ;
    
    
        if (colIdx == 3) {
            modal_modificacion_traspaso(id);
        }
        else if (colIdx == 4) {
            confirmar_eliminacion_traspaso(id);
        }
    
    });
})

async function detalle_traspaso(id) {
    let path = `/traspaso/{id}/`;



    let bodyRequest = {
        'fecha': fh_generacion,
        'estado': tipo_estado,
        'origen': deposito_origen,
        'destino': deposito_destino,
        'usuario': usuario_genero,
        'tabla_traspaso': llenar_tabla(id)
    }
    const response = await GET(path, bodyRequest)

    if (response.success) {
        swal({
            title: "Información",
            text: "Modificación exitosa",
            icon: "success",
        });
    }
}
   

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


    if (datos.success) {
        cargarDetallesTraspaso(datos.data, tabla);
    }
}

async function llenar_tabla(datos, tabla) {
    
    tabla.clear().draw();
  
         datos.data.detalle_traspaso.forEach(function () {
            let edit_button = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="Edit"><i class="zmdi zmdi-edit"></i></button></div></td>';
            let delete_button = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="Delete"><i class="zmdi zmdi-delete"></i></button></div></td>';
           
    tabla.row.add([data.detalle_traspaso.id, data.detalle_traspaso.articulo, data.detalle_traspaso.cantidad, edit_button, delete_button]).draw();
    
            
        })
    
}


/*
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



// Modificar traspaso

async function modal_modificacion_traspaso(id) {

    let path = `/traspaso/${id}/`;

   
    const response = await GET(path);

    if (response.success) {

        $('#btnConfirmarModificacionTraspaso').off('click');


        console.log(response);

        $('#txtArticulo_Modificar').val(response.data.detalle_traspaso.articulo);
        $('#txtCantidad_Modificar').val(response.data.detalle_trasapaso.cantidad);
        
        $('#btnConfirmarModificacionTraspaso').click(function() {
            modificar_traspaso(id);
        });

        $('#popup_modif_traspaso').modal('show');

    }

}


async function modificar_traspaso(id) {

    let path = `/traspaso/${id}/`;

    let articulo = $('#txtArticulo_Modificar').val();
    let cantidad = $('#txtCantidad_Modificar').val();
   
    if (articulo == '' || cantidad == '') {

        swal({
            title: "Información",
            text: "Debe completar todos los campos",
            icon: "error",
          });

        return;
    }

    let bodyRequest = {
        'articulo' : articulo,
        'cantidad' : cantidad
    }

    const response = await PUT(path, bodyRequest);

    if (response.success) {
        swal({
            title: "Información",
            text: "Modificación exitosa",
            icon: "success",
          });

        const response_traspaso = await GET(`/traspaso/${id}/`);

        if (response_traspaso.success) {
            llenar_tabla(response_traspaso.data, tabla_traspaso);

        }

        $('#popup_modif_traspaso').modal('hide');
    }
    else {
        swal({
            title: "Información",
            text: 'No se pudo cargar la modificacion',
            icon: "error",
          });
    }
}

