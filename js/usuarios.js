import {GET, DELETE, POST, PUT} from './api.js';

var tabla_usuarios;

// CARGAMOS TABLA USUARIOS
$(document).ready(function() {

    cargarSelectTipoRoles();
    cargar_tabla();
    

    $("#btn_alta_usuario").click(function () {
        
        let usuario = $("#usuario").val();
        let password = $("#password").val();
        let apellido = $("#apellido").val();
        let nombre = $("#nombre").val();
        let email = $("#email").val();
        let tipo_rol = $("#selectTipoRol").val();

        alta_usuario(nombre, apellido, usuario, password, email, tipo_rol);
    });

    $('#popup_alta_usuario').on('hidden.bs.modal', function (e) {
        limpiarFormularioAlta();
    });
    
})

async function cargar_tabla() {
    
    tabla_usuarios  = $('#tabla_usuarios').DataTable({
        "language": datetable_languaje,
        pageLength: 7,
        columnDefs: [{
            'targets': 5,
            'searchable':false,
            'orderable':false,
                        
        }],
                     
    });
    const datos = await GET('/usuarios/');

    if (datos.success) {
        llenar_tabla(datos.data, tabla_usuarios);
    }

    
    
}

function llenar_tabla(datos, tabla){

    // Se limpia la tabla
    tabla.clear().draw();

    datos.forEach(usuario => {
        let botones = '';

        botones += "<td><div class=\"table-data-feature\">"
        // Por cada usuario, a los botones de borrar y editar, se le asigna un id dinamico segun el id del usuario
        botones += "<button class=\"item\" id=\"btn_modif_usuario_" + usuario.id + "\" data-toggle=\"modal\" data-placement=\"top\" title=\"Modificar\"><i class=\"zmdi zmdi-edit\"></i></button>\<button id=\"btn_elim_usuario_" + usuario.id + "\" class=\"item\" data-toggle=\"modal\"  idata-placement=\"top\" title=\"Eliminar\"><i class=\"zmdi zmdi-delete\"></i></button></div></td>";
        
        tabla.row.add([usuario.usuario, usuario.nombre, usuario.apellido, usuario.email, usuario.rol, botones]).draw();
   
        // Con el id dinamico anteriormente asignado, seteo el on click para la eliminación y la edición
        $(`#btn_modif_usuario_${usuario.id}`).click(function (){
            modal_modificacion_usuario(usuario.id);
        });
    
        $(`#btn_elim_usuario_${usuario.id}`).click(function (){
            confirmar_eliminacion_usuario(usuario.id, usuario.usuario);
        });
    });

}

// CARGAMOS SELECT CON TIPO ROLES

async function cargarSelectTipoRoles() {

    const response = await GET('/tipos-rol/');

    if (response.success) {

        response.data.forEach(function (element) {

            // Select tipos roles pop up alta usuario
            let miSelect = document.getElementById("selectTipoRol");
            let opt = document.createElement("option");
    
            opt.appendChild(document.createTextNode(element.descripcion));
            opt.value = element.id;
    
            miSelect.appendChild(opt);

            // Select tipos roles pop up modif usuario
            let cmbTipoRolModific = document.getElementById("cmbTipoRol_Modificar");
            let optModif = document.createElement("option");

            optModif.appendChild(document.createTextNode(element.descripcion));
            optModif.value = element.id;

            cmbTipoRolModific.appendChild(optModif);
        })
    }

    
}

// DAR DE BAJA USUARIO

function confirmar_eliminacion_usuario(id, usuario) {

    $('#btn_baja_usuario').off('click');
    
    $("#mensaje_confirm_delete").text("Seguro que desea dar de baja el usuario " + usuario + "?");

    $("#btn_baja_usuario").click(function (){
        eliminar_usuario(id);
    });

    $("#popup_baja_usuario").modal("show");
}


async function eliminar_usuario(id) {
    
    let path = `/usuario/${id}/`;

    const response = await DELETE(path);

    if (response.success) {

        swal({
            title: "Información",
            text: "Usuario dado de baja con éxito",
            icon: "success",
          });

        const response_usuarios = await GET('/usuarios/');

        if (response_usuarios.success) {
            llenar_tabla(response_usuarios.data, tabla_usuarios);
        }
          
    }
    else {
        swal({
            title: "Información",
            text: "No fué posible dar de baja el usuario",
            icon: "error",
          });
    }

    $("#popup_baja_usuario").modal("hide");
}

// ALTA USUARIO

async function alta_usuario (nombre, apellido, usuario, password, email,tipo_rol) {
    
    if(usuario.trim() == '' || password == '' || tipo_rol == 0) {
        swal({
            title: "Información",
            text: "Los campos usuario, password y tipo rol son obligatorios",
            icon: "error",
          });
          
        return;
    }

    let bodyRequest = {
        'username' : usuario,
        'password': password,
        'email' : email,
        'last_name' : apellido,
        'first_name' : nombre,
        'id_tipo_rol' : tipo_rol
    }

    const response = await POST('/usuario/', bodyRequest);

    if (response.success) {
        swal({
            title: "Información",
            text: "Usuario creado correctamente!",
            icon: "success",
          });
          const response_usuarios = await GET('/usuarios/');

          if (response_usuarios.success) {
              llenar_tabla(response_usuarios.data, tabla_usuarios);
              
          }

          $('#popup_alta_usuario').modal('hide');

    }
    else {
        swal({
            title: "Información",
            text: "Los datos ingresados corresponden a un usuario ya existente",
            icon: "error",
          });
    }
}


// Modificacion usuario

async function modal_modificacion_usuario(id) {
    
    let path = `/usuario/${id}/`;

    // acá iria el reemplazo del get usuario
    const response = await GET(path);

    if (response.success) {

        $('#btnConfirmarModificacion').off('click');
        $('#chkbRestablecerPassword').off('click');

        console.log(response);

        $('#txtNombre_Modificar').val(response.data.nombre);
        $('#txtApellido_Modificar').val(response.data.apellido);
        $('#txtUsername_Modificar').val(response.data.usuario);
        $('#txtEmail_Modificar').val(response.data.email);
        $('#txtPassword_Modificar').attr('disabled', true);
        $('#txtPassword_Modificar').val('********');
        $('#chkbRestablecerPassword').prop('checked', false);
        $('#cmbTipoRol_Modificar').val(response.data.id_tipo_rol);
        

        
        $('#btnConfirmarModificacion').click(function() {
            modificar_usuario(id);
        });

        $('#chkbRestablecerPassword').click(function() {

            if ($('#chkbRestablecerPassword').is(':checked')) {

                $('#txtPassword_Modificar').val('');
                $('#txtPassword_Modificar').removeAttr('disabled');
            }
            else {
                $('#txtPassword_Modificar').val('********');
                $('#txtPassword_Modificar').attr('disabled', true);
            }
            
        });

        $('#popup_modif_usuario').modal('show');

    }
    
}


async function modificar_usuario(id) {

    let path = `/usuario/${id}/`;
    
    let nombre = $('#txtNombre_Modificar').val();
    let apellido = $('#txtApellido_Modificar').val();
    let password = $('#txtPassword_Modificar').val();
    let tipoRol = $('#cmbTipoRol_Modificar').val();

    let changePassword = $('#chkbRestablecerPassword').is(':checked') ? 1 : 0;

    if (nombre == '' || apellido == '' || password == '' || tipoRol == 0) {
        
        swal({
            title: "Información",
            text: "Debe completar todos los campos",
            icon: "error",
          });

        return;
    }

    let bodyRequest = {
        'nombre' : nombre,
        'apellido' : apellido,
        'password' : password,
        'id_tipo_rol' : tipoRol,
        'cambio_password' : changePassword
    }


    const response = await PUT(path, bodyRequest);

    if (response.success) {
        swal({
            title: "Información",
            text: "Usuario modificado con éxito",
            icon: "success",
          });

        const response_usuarios = await GET('/usuarios/');

        if (response_usuarios.success) {
            llenar_tabla(response_usuarios.data, tabla_usuarios);
            
        }

        $('#popup_modif_usuario').modal('hide');
    }
    else {
        swal({
            title: "Información",
            text: 'No fué posible actualizar usuario',
            icon: "error",
          });
    }
}



function limpiarFormularioAlta() {
    $('#nombre').val('');
    $('#apellido').val('');
    $('#usuario').val('');
    $('#email').val('');
    $('#password').val('');
    $('#selectTipoRol').val(0);
}