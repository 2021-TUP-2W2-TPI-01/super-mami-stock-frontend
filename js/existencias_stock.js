import { GET } from "./api.js";

var tabla_existencias;

$( document ).ajaxStart(function() {
    $('#loading').show();
});

$( document ).ajaxComplete(function( event,request, settings ) {
    $('#loading').hide();
});

$('#loading').hide();

$(document).ready(function() {
    cargar_tabla();
});


async function cargar_tabla() {
    
    tabla_existencias  = $('#tabla_existencias').DataTable({
        "language": datetable_languaje,
        pageLength: 7,
        columnDefs: [
            {
                'targets': 0,  
                'visible': false      
            }
    ],
                     
    });
    const datos = await GET('/existencias/');

    if (datos.success) {
        llenar_tabla(datos.data, tabla_existencias);
    }
    else {
        console.error(`Error: ${datos.data}. Status: ${datos.statusCode}`);
    }

    
    
}


function llenar_tabla(datos, tabla){

    // Se limpia la tabla
    tabla.clear().draw();

    datos.forEach(existencia => {
        tabla.row.add([existencia.id_articulo, existencia.nombre_articulo, existencia.cantidad, existencia.stock_minimo, existencia.stock_maximo]).draw();
    });

}