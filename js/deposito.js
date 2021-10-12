import {GET, DELETE, POST, PUT} from './api.js';

var tabla_depositos;

// CARGAMOS TABLA DEPOSITOS
$(document).ready(function() {

    cargarSelectEncargado();
    cargarSelectLocalidad();
    cargar_tabla();
    

    $("#btn_alta_deposito").click(function () {
        
        let nombre = $("#nombre").val();
        let descripcion = $("#descripcion").val();
        let domicilio = $("#domicilio").val();
        let barrio = $("#barrio").val();
        let localidad = $("#SelectLocalidad").val();
        let encargado = $("#SelectEncargado").val();

        alta_deposito(nombre, descripcion, domicilio, barrio, localidad, encargado);
    });

    $('#popup_alta_deposito').on('hidden.bs.modal', function (e) {
        limpiarFormularioAlta();
    });
    
})

async function cargar_tabla() {
    
    tabla_depositos  = $('#tabla_depositos').DataTable({
        "language": datetable_languaje,
        pageLength: 7,
        columnDefs: [{
            'targets': 5,
            'searchable':false,
            'orderable':false,
                        
        }],
                     
    });
    const datos = await GET('/depositos/');

    if (datos.success) {
        llenar_tabla(datos.data, tabla_depositos);
    }

    
    
}

function llenar_tabla(datos, tabla){

    // Se limpia la tabla
    tabla.clear().draw();

    datos.forEach(deposito => {
        let botones = '';

        botones += "<td><div class=\"table-data-feature\">"
        // Por cada deposito, a los botones de borrar y editar, se le asigna un id dinamico segun el id del deposito
        botones += "<button class=\"item\" id=\"btn_modif_deposito_" + deposito.id + "\" data-toggle=\"modal\" data-placement=\"top\" title=\"Modificar\"><i class=\"zmdi zmdi-edit\"></i></button>\<button id=\"btn_elim_deposito_" + deposito.id + "\" class=\"item\" data-toggle=\"modal\"  idata-placement=\"top\" title=\"Eliminar\"><i class=\"zmdi zmdi-delete\"></i></button></div></td>";
        
        tabla.row.add([deposito.nombre, deposito.descripcion, deposito.domicilio, deposito.barrio, deposito.localidad, deposito.encargado, botones]).draw();
   
        // Con el id dinamico anteriormente asignado, seteo el on click para la eliminación y la edición
        $(`#btn_modif_deposito_${deposito.id}`).click(function (){
            modal_modificacion_deposito(deposito.id);
        });
    
        $(`#btn_elim_deposito_${deposito.id}`).click(function (){
            confirmar_eliminacion_deposito(deposito.id, deposito.nombre);
        });
    });

}
S
// CARGAMOS SELECT CON LOCALIDADES

async function cargarSelectLocalidad() {

    const response = await GET('/localidades/');

    if (response.success) {

        response.data.forEach(function (element) {

            // Select tipos roles pop up alta deposito
            let miSelect = document.getElementById("selectLocalidad");
            let opt = document.createElement("option");
    
            opt.appendChild(document.createTextNode(element.descripcion));
            opt.value = element.id;
    
            miSelect.appendChild(opt);

            // Select tipos roles pop up modif deposito
            let cmbLocalidadModific = document.getElementById("cmbLocalidad_Modificar");
            let optModif = document.createElement("option");

            optModif.appendChild(document.createTextNode(element.descripcion));
            optModif.value = element.id;

            cmbLocalidadModific.appendChild(optModif);
        })
    }

    
}


// CARGAMOS SELECT CON ENCARGADOS

async function cargarSelectEncargado() {

    const response = await GET('/encargados/');

    if (response.success) {

        response.data.forEach(function (element) {

            // Select tipos roles pop up alta deposito
            let miSelect = document.getElementById("selectEncargado");
            let opt = document.createElement("option");
    
            opt.appendChild(document.createTextNode(element.descripcion));
            opt.value = element.id;
    
            miSelect.appendChild(opt);

            // Select tipos roles pop up modif deposito
            let cmbEncargadoModific = document.getElementById("cmbEncargado_Modificar");
            let optModif = document.createElement("option");

            optModif.appendChild(document.createTextNode(element.descripcion));
            optModif.value = element.id;

            cmbEncargadoModific.appendChild(optModif);
        })
    }

    
}
// DAR DE BAJA DEPOSITO

function confirmar_eliminacion_deposito(id, nombre) {

    $('#btn_baja_deposito').off('click');
    
    $("#mensaje_confirm_delete").text("Seguro que desea dar de baja el deposito " + nombre + "?");

    $("#btn_baja_deposito").click(function (){
        eliminar_deposito(id);
    });

    $("#popup_baja_deposito").modal("show");
}


async function eliminar_deposito(id) {
    
    let path = `/deposito/${id}/`;

    const response = await DELETE(path);

    if (response.success) {

        swal({
            title: "Información",
            text: "Deposito dado de baja con éxito",
            icon: "success",
          });

        const response_depositos = await GET('/depositos/');

        if (response_depositos.success) {
            llenar_tabla(response_depositos.data, tabla_depositos);
        }
          
    }
    else {
        swal({
            title: "Información",
            text: "No fué posible dar de baja el deposito",
            icon: "error",
          });
    }

    $("#popup_baja_deposito").modal("hide");
}

// ALTA DEPOPSITO   

async function alta_deposito (nombre, descripcion, domicilio, barrio, localidad, encargado) {
    
    if(descripcion.trim() == '' || nombre == '' || encargado == 0) {
        swal({
            title: "Información",
            text: "Los campos nombre, descripcion y encargado son obligatorios",
            icon: "error",
          });
          
        return;
    }

    let bodyRequest = {
        'nombre' : nombre,
        'descripcion': descripcion,
        'domicilio' : domicilio,
        'barrio' : barrio,
        'id_localidad' : localidad,//id
        'id_encargado' : encargado //id
    }

    const response = await POST('/deposito/', bodyRequest);

    if (response.success) {
        swal({
            title: "Información",
            text: "Deposito creado correctamente!",
            icon: "success",
          });
          const response_depositos = await GET('/depositos/');

          if (response_depositos.success) {
              llenar_tabla(response_depositos.data, tabla_depositos);
              
          }

          $('#popup_alta_deposito').modal('hide');

    }
    else {
        swal({
            title: "Información",
            text: "Los datos ingresados corresponden a un deposito ya existente",
            icon: "error",
          });
    }
}


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

    if (nombre == '' || descripcion == '' || domicilio == '' || barrio == '' || localidad == 0|| encargado == 0) {
        
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
            text: "Deposito modificado con éxito",
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
            text: 'No fué posible actualizar deposito',
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
