// CARGAMOS TABLA USUARIOS
$(document).ready(function() {

    $.ajax({
    url: "http://26.100.251.19/api/usuarios/",
    type: "GET",
    headers: {Authorization:"Basic bWF0aWVyb2pvOm1hdGlhc2Vyb2pvMTIz"},
    statusCode: {
        200: function (data) {

            let tabla_usuarios = $('#tablaUsuarios').DataTable({
                "language": {
                    "lengthMenu": "",
                    "zeroRecords": "No hay datos - Disculpe",
                    "info": "Mostrando pag. _PAGE_ de _PAGES_",
                    "infoEmpty": "No hay datos",
                    "infoFiltered": "(Filtrado de _MAX_ total registros)"
                },
                pageLength: 7,
                columnDefs: [{
                    'targets': 5,
                    'searchable':false,
                    'orderable':false,
                    
                }],
                     
            });

            creartabla(data, tabla_usuarios);
        },
        401: function (data) {
            console.log("error")
        },
        500: function (data) {
            console.log("error")
        }
    }
    });
})

function creartabla(datos, tabla){

    datos.forEach(usuario => {
        let botones = '';
        botones += "<td><div class=\"table-data-feature\">"
        botones += "<button class=\"item\" id=\"btn_delete_usuario\" data-toggle=\"modal\" data-placement=\"top\" title=\"Modificar\"><i class=\"zmdi zmdi-edit\"></i></button>\<button class=\"item\" data-toggle=\"modal\" onclick=\"confirmar_eliminacion_usuario('"+ usuario.id + "', '" + usuario.nombre + "')\" idata-placement=\"top\" title=\"Eliminar\"><i class=\"zmdi zmdi-delete\"></i></button></div></td>";
       tabla.row.add([usuario.usuario, usuario.nombre, usuario.apellido, usuario.email, usuario.rol, botones]).draw();
   });

}

// CARGAMOS SELECT CON TIPO ROLES

$.ajax({
    url: "http://26.100.251.19/api/tipos-rol/", 
    type: "GET",
    headers: {Authorization: "Basic bWF0aWVyb2pvOm1hdGlhc2Vyb2pvMTIz"},
    statusCode: {
        200: function (data) {

            cargarSelect(data);
        },
        401: function (data) {
            console.log("error")
        },
        500: function (data) {
            console.log("error")
        }
    }
});

function cargarSelect(data) {
    data.forEach(function (element) {
    let miSelect = document.getElementById("selectTipoRol");
    let opt = document.createElement("option");

    opt.appendChild(document.createTextNode(element.descripcion));
    opt.value = element.id;

    miSelect.appendChild(opt);
})
}

// DAR DE BAJA USUARIO

function confirmar_eliminacion_usuario(id, nombre) {
    
    $("#mensaje_confirm_delete").text("Seguro que desea dar de baja el usuario " + nombre + "?");

    $("#btn_baja_usuario").attr("onclick", "eliminar_usuario(" + id + ")");

    $("#popup_baja_usuario").modal("show")
}


function eliminar_usuario(id) {
    console.log(id);
}
