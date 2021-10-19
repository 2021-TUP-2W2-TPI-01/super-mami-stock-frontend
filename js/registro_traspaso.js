import { GET, DELETE, POST, PUT } from './api.js';

var tabla_traspasos;
var tabla_traspaso;

// CARGAMOS TABLA TRASPASOS
$(document).ready(function () {

    cargar_tablaG();

    $('#section_detalles_traspaso').hide();
    $('#btn_lista_traspasos').click(function () {
        $('#section_detalles_traspaso').hide();
        $('#section_traspasos').show();
        
    })

    $('#tabla_traspasos tbody').on( 'click', 'td', function () {
        
        $('#section_detalles_traspaso').show();
        $('#section_traspasos').hide();
        let rowIdx = tabla_traspasos.cell(this).index().row;
        let colIdx = tabla_traspasos.cell(this).index().column;  
    
        let id_traspaso = tabla_traspasos.rows(rowIdx).data()[0][0] ;
    
    
        if (colIdx == 5) {
            section_detalle_traspaso(id_traspaso);
        }
    
    });  
    $('#tabla_traspaso tbody').on('click', 'td', function () {

        let rowIdx = tabla_traspaso.cell(this).index().row;
        let colIdx = tabla_traspaso.cell(this).index().column;
    
        let id = tabla_traspaso.rows(rowIdx).data()[0][0];
    
    
        if (colIdx == 3) {
            modal_modificacion_traspaso(id);

        }
    });

    
})
async function cargar_tablaG() {

    tabla_traspasos = $('#tabla_traspasos').DataTable({
        "language": datetable_languaje,
        pageLength: 5,
        columnDefs: [
            {
                'targets': 5,
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

        let detalles_button = '<td id="btn_section_detalle"><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="More"><i class="zmdi zmdi-more"></i></button></div></td>';

        tabla.row.add([traspaso.id, traspaso.fh_generacion, traspaso.deposito_origen, traspaso.deposito_destino, traspaso.tipo_estado, detalles_button]).draw();


    });

}

//HASTA ACA TABLA GENERAL, HATAS ACA FUNCIONA

async function section_detalle_traspaso(id) {

    let path = `/traspaso/${id}/`;

    const response = await GET(path);

    if(response.success) {

        $("#popup_detalle_traspaso").modal("show");

        $('#btn_aceptar_traspaso').off('click');

        $('#txtFecha_traspaso').val(response.data.fh_generacion);
        $('#txtEstado_traspaso').val(response.data.tipo_estado);
        $('#txtOrigen_traspaso').val(response.data.deposito_origen);
        $('#txtDestino_traspaso').val(response.data.deposito_destino);
        $('#txtUsuario_traspaso').val(response.data.usuario_genero);

        cargar_tabla_traspaso(id)
    }
}


async function cargar_tabla_traspaso(id) {

    tabla_traspaso = $('#tabla_traspaso').DataTable({
        "language": datetable_languaje,
        pageLength: 4,
        columnDefs: [
            {
                'targets': 3,
                'width': '10px',
                'searchable': false,
                'orderable': false,
            },
            {
                'targets': 4,
                'width': '10px',
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
        llenar_tabla_traspaso(datos.data, tabla_traspaso)
    }
}

function llenar_tabla_traspaso(datos, tabla) {
    
    tabla.clear().draw();
  
    datos.detalle_traspaso.forEach(detalle => {

            let edit_button = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="Edit"><i class="zmdi zmdi-edit"></i></button></div></td>';

           
            tabla_traspaso.row.add([detalle.id_articulo, detalle.articulo, detalle.cantidad, edit_button]).draw();
    
    })
}
    

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

    }

    $('#popup_modif_traspaso').modal('show');

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