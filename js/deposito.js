
// CARGAMOS TABLA DEPOSITOS
$(document).ready(function() {

    $.ajax({
    url: "http://26.100.251.19/api/depositos/",
    type: "GET",
    headers: {Authorization:"Basic bWF0aWVyb2pvOm1hdGlhc2Vyb2pvMTIz"},
    statusCode: {
        200: function (data) {

            let tabla_depositos = $('#tablaDepositos').DataTable({
                "language": {
                    "lengthMenu": "",
                    "zeroRecords": "No hay datos - disculpe",
                    "info": "Mostrando pag. _PAGE_ de _PAGES_",
                    "infoEmpty": "No hay datos",
                    "infoFiltered": "(Filtrado de _MAX_ total registros)"
                },
                pageLength: 5,
                columnDefs: [{
                    'targets': 5,
                    'searchable':false,
                    'orderable':false,
                }],
            });

            creartabla(data, tabla_depositos);
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

    let botones = '';
    botones += "<td><div class=\"table-data-feature\">"
    botones += "<button class=\"item \" id=\"btn_delete_deposito\" data-toggle=\"modal\" data-placement=\"top\" title=\"Edit\"><i class=\"zmdi zmdi-edit\"></i></button>\<button class=\"item\" data-toggle=\"modal\" onclick=\confirmar_eliminacion_deposito('"+ deposito.id + "', '" + deposito.nombre + "')\" data-placement=\"top\" title=\"Delete\"><i class=\"zmdi zmdi-delete\"></i></button></div></td>";

   datos.forEach(deposito => {
       tabla.row.add([deposito.nombre, deposito.descripcion, deposito.encargado, deposito.domicilio , deposito.barrio, botones]).draw();
   });

}

//CARGAR ENCARGADO
$.ajax({
    url: "http://26.100.251.19/api/encargados/", 
    type: "GET",
    headers: {Authorization: "Basic bWF0aWVyb2pvOm1hdGlhc2Vyb2pvMTIz"},
    statusCode: {
        200: function (data) {
            console.log(data);
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
    let miSelect = document.getElementById("selectEncargado");
    let opt = document.createElement("option");

    opt.appendChild(document.createTextNode(element.nombre));
    opt.value = element.id;

    miSelect.appendChild(opt);
})
}


// DAR DE BAJA DEPOSITO

function confirmar_eliminacion_deposito(id, nombre) {
    
    $("#mensaje_confirm_delete").text("Seguro que desea dar de baja el deposito " + nombre + "?");

    $("#btn_baja_deposito").attr("onclick", "eliminar_deposito(" + id + ")");

    $("#popup_baja_deposito").modal("show")
}


function eliminar_deposito(id) {
    console.log(id);
}
