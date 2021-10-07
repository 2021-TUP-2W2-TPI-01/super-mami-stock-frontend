
$(document).ready(function() {
    $.ajax({
    url: "http://26.100.251.19/api/usuarios/",
    type: "GET",
    headers: {Authorization:"Basic bWF0aWVyb2pvOm1hdGlhc2Vyb2pvMTIz"},
    statusCode: {
        200: function (data) {
            creartabla(data, $("#cuerpoTabla"));
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
    
    for(var i=0; i < datos.length; i++){
        var html = "<tr>";
            html += "<td>" + datos[i].username + "</td>";
            html += "<td>" + datos[i].first_name + "</td>";
            html += "<td>" + datos[i].last_name + "</td>";
            html += "<td>" + datos[i].email + "</td>";
            html += "<td> Admin </td>";
            html += "<td><div class=\"table-data-feature\">"
            html += "<button class=\"item \" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Edit\"><i class=\"zmdi zmdi-edit\"></i></button>\<button class=\"item\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Delete\"><i class=\"zmdi zmdi-delete\"></i></button></div></td>";
            tabla.append(html);
    }
}
