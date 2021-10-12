
// CARGAMOS TABLA DEPOSITOS
$(document).ready(function() {

    $.ajax({
    url: "http://26.100.251.19/api/depositos/",
    type: "GET",
    headers: {Authorization:"Basic bWFyaWFjaGF5bGU6bWFyaWExMjM0"},
    statusCode: {
        200: function (data) {

            let tabla_depositos = $('#tablaDepositos').DataTable({
                "language": datetable_languaje,
                pageLength: 7,
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

    datos.forEach(deposito => {
    let botones = '';
    botones += "<td><div class=\"table-data-feature\">"
    botones += "<button class=\"item \" id=\"btn_delete_deposito\" data-toggle=\"modal\" data-placement=\"top\" title=\"Modificar\"><i class=\"zmdi zmdi-edit\"></i></button>\<button class=\"item\" data-toggle=\"modal\" onclick=\confirmar_eliminacion_deposito('"+ deposito.id + "', '" + deposito.nombre + "')\" data-placement=\"top\" title=\"Eliminar\"><i class=\"zmdi zmdi-delete\"></i></button></div></td>";

   
       tabla.row.add([deposito.nombre, deposito.descripcion, deposito.domicilio , deposito.barrio, deposito.localidad, deposito.encargado, botones]).draw();
   });

}

//CARGAR ENCARGADO
$.ajax({
    url: "http://26.100.251.19/api/encargados/", 
    type: "GET",
    headers: {Authorization: "Basic bWFyaWFjaGF5bGU6bWFyaWExMjM0"},
    statusCode: {
        200: function (data) {
           
            cargarSelectE(data);
        },
        401: function (data) {
            console.log("error")
        },
        500: function (data) {
            console.log("error")
        }
    }
});

function cargarSelectE(data) {
    data.forEach(function (element) {
    let miSelect = document.getElementById("selectEncargado");
    let opt = document.createElement("option");

    opt.appendChild(document.createTextNode(element.descripcion));
    opt.value = element.id;

    miSelect.appendChild(opt);
})
}

//CARGAR LOCALIDAD

$.ajax({
    url: "http://26.100.251.19/api/localidades/", 
    type: "GET",
    headers: {Authorization: "Basic bWFyaWFjaGF5bGU6bWFyaWExMjM0"},
    statusCode: {
        200: function (data) {
           
            cargarSelectL(data);
        },
        401: function (data) {
            console.log("error")
        },
        500: function (data) {
            console.log("error")
        }
    }
});

function cargarSelectL(data) {
    data.forEach(function (element) {
    let miSelect = document.getElementById("selectLocalidad");
    let opt = document.createElement("option");

    opt.appendChild(document.createTextNode(element.descripcion));
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
