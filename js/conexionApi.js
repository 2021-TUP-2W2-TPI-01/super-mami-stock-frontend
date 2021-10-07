
$(document).ready(function() {
    $('#tablaUsuarios').DataTable({
        orderCellstop: true,
        fixedHeader: true
    });
});


// CARGAMOS TABLA USUARIOS
$(document).ready(function() {
    $.ajax({
    url: "http://26.100.251.19/api/usuarios/",
    type: "GET",
    headers: {Authorization:"Basic bWF0aWVyb2pvOm1hdGlhc2Vyb2pvMTIz"},
    statusCode: {
        200: function (data) {
            creartabla(data, $("#tablaUsuarios"));
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
    var html = "<thead>";
        html += "<tr>";
        html += "<th>Username</th>"
        html += "<th>Nombre</th>"
        html += "<th>apellido</th>"
        html += "<th>email</th>"
        html += "<th>Rol</th>"
        html += "</tr>"
        html += "</thead>"
        html += "<tbody>"
    for(var i=0; i < datos.length; i++){
        
            html += "<tr>";
            html += "<td>" + datos[i].usuario + "</td>";
            html += "<td>" + datos[i].nombre + "</td>";
            html += "<td>" + datos[i].apellido + "</td>";
            html += "<td>" + datos[i].email + "</td>";
            html += "<td>" + datos[i].rol + "</td>";
            html += "<td><div class=\"table-data-feature\">"
            html += "<button class=\"item \" data-toggle=\"modal\" data-placement=\"top\" title=\"Edit\"><i class=\"zmdi zmdi-edit\"></i></button>\<button class=\"item\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Delete\"><i class=\"zmdi zmdi-delete\"></i></button></div></td>";
            html += "</tr>";
            html += "<tr class=\"spacer\"></tr>";
            
            
    }
    html += "</tbody>";
    tabla.append(html);
}

// CARGAMOS SELECT CON TIPO ROLES

$.ajax({
    url: "http://26.100.251.19/api/tipos-rol/", 
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
    let miSelect = document.getElementById("selectTipoRol");
    let opt = document.createElement("option");

    opt.appendChild(document.createTextNode(element.descripcion));
    opt.value = element.id;

    miSelect.appendChild(opt);
})
}