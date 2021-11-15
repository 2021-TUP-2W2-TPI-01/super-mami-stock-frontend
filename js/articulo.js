import {GET, DELETE, POST, PUT} from './api.js';

var tabla_articulos;

$( document ).ajaxStart(function() {
    $('#loading').show();
});

$( document ).ajaxComplete(function( event,request, settings ) {
    $('#loading').hide();
});

$('#loading').hide();

// CARGAMOS TABLA ARTICULOS
$(document).ready(function() {

    cargarSelectMarcas();
    cargarSelectCategorias();
    cargarSelectUnidadMedida();

    cargar_tabla();
    

    $("#btn_alta_articulo").click(function () {
        
        let nombre = $("#txtNombreArticulo").val();
        let descripcion = $("#txtDescripcion").val();
        let precio = $("#txtPrecio").val();        
        let marca = $("#cmbMarca").val();
        let categoria = $("#cmbCategoria").val();
        let unidadMedida = $("#cmbUnidadMedida").val();
        let cantidadMedida = $("#txtCantidadMedida").val();

        alta_articulo(nombre, descripcion, precio, marca, categoria, unidadMedida,cantidadMedida );
        
    });

    $('#popup_alta_articulo').on('hidden.bs.modal', function (e) {
        limpiarFormularioAlta();
    });


    $('#tabla_articulos tbody').on( 'click', 'td', function () {
       
        let rowIdx = tabla_articulos.cell( this ).index().row;
        let colIdx = tabla_articulos.cell(this).index().column;  

        let id_articulo = tabla_articulos.rows( rowIdx ).data()[0][0] ;
        let nombre = tabla_articulos.rows( rowIdx ).data()[0][1] ;
    

        if (colIdx == 8) {
            modal_modificacion_articulo(id_articulo);
        }
        else if (colIdx == 9) {
            confirmar_eliminacion_articulo(id_articulo, nombre);
        }
    
    } );  
    
})

async function cargar_tabla() {
    
    tabla_articulos  = $('#tabla_articulos').DataTable({
        "language": datetable_languaje,
        pageLength: 7,
        columnDefs: [
            {
                'targets': [8,9],
                'searchable':false,
                'orderable':false,
                            
            },
            {
                'targets': 0,  
                'visible': false      
            }
    ],
    rowCallback: function( row, data, iDisplayIndex ) {

        // Alineación a la derecha valores numericos
        $(row).find('td:eq(2)').addClass('text-right');
        $(row).find('td:eq(6)').addClass('text-right');
    },
                     
    });
    const datos = await GET('/articulos/');

    if (datos.success) {
        llenar_tabla(datos.data, tabla_articulos)       
    }
    else {
        console.error(`Error: ${datos.data}. Status: ${datos.statusCode}`);
    }

    
}

function llenar_tabla(datos, tabla){

    // Se limpia la tabla
    tabla.clear().draw();

    datos.forEach(articulo => {
        //let botones = '';

        let edit_button = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="Editar"><i class="zmdi zmdi-edit"></i></button></div></td>';
        let delete_button = '<td><div class="table-data-feature"><button class="item" data-toggle="tooltip" data-placement="top" title="Eliminar"><i class="zmdi zmdi-delete"></i></button></div></td>';
        
        //botones += "<td><div class=\"table-data-feature\">"
        // Por cada deposito, a los botones de borrar y editar, se le asigna un id dinamico segun el id del deposito
        //botones += "<button class=\"item\" id=\"btn_modif_deposito_" + deposito.id + "\" data-toggle=\"modal\" data-placement=\"top\" title=\"Modificar\"><i class=\"zmdi zmdi-edit\"></i></button>\<button id=\"btn_elim_deposito_" + deposito.id + "\" class=\"item\" data-toggle=\"modal\"  idata-placement=\"top\" title=\"Eliminar\"><i class=\"zmdi zmdi-delete\"></i></button></div></td>";
        
        tabla.row.add([articulo.id,articulo.nombre, articulo.descripcion 
            , `$${articulo.precio_unitario}`, articulo.marca, articulo.categoria, articulo.unidad_medida,
            articulo.cantidad_medida, edit_button,delete_button]).draw();
   
        
        
        // Con el id dinamico anteriormente asignado, seteo el on click para la eliminación y la edición
        //$(`#btn_modif_deposito_${deposito.id}`).click(function (){
        //    modal_modificacion_deposito(deposito.id);
        //});
    
        //$(`#btn_elim_deposito_${deposito.id}`).click(function (){
        //    confirmar_eliminacion_deposito(deposito.id, deposito.nombre);
        //});
    });

}
// S
// CARGAMOS SELECT CON MARCAS

async function cargarSelectMarcas() {

    const response = await GET('/marcas/');

    if (response.success) {

        response.data.forEach(function (element) {

            // Select marcas pop up alta articulo
            let miSelect = document.getElementById("cmbMarca");
            let opt = document.createElement("option");
    
            opt.appendChild(document.createTextNode(element.descripcion));
            opt.value = element.id;
    
            miSelect.appendChild(opt);

            // Select marcas pop up modif articulo
            let cmbLocalidadModific = document.getElementById("cmbMarca_Modificar");
            let optModif = document.createElement("option");

            optModif.appendChild(document.createTextNode(element.descripcion));
            optModif.value = element.id;

            cmbLocalidadModific.appendChild(optModif);
        })
    }
    else {
        console.error(`Error: ${response.data}. Status: ${response.statusCode}`);
    }

}

// CARGAMOS SELECT CON CATEGORIAS

async function cargarSelectCategorias() {

    const response = await GET('/categorias/');

    if (response.success) {

        response.data.forEach(function (element) {

            // Select categorias pop up alta articulo
            let miSelect = document.getElementById("cmbCategoria");
            let opt = document.createElement("option");
    
            opt.appendChild(document.createTextNode(element.descripcion));
            opt.value = element.id;
    
            miSelect.appendChild(opt);

            // Select categorias pop up modif articulo
            let cmbEncargadoModific = document.getElementById("cmbCategoria_Modificar");
            let optModif = document.createElement("option");

            optModif.appendChild(document.createTextNode(element.descripcion));
            optModif.value = element.id;

            cmbEncargadoModific.appendChild(optModif);
        })
    }
    else {
        console.error(`Error: ${response.data}. Status: ${response.statusCode}`);
    }

    
}

// CARGAMOS SELECT CON UNIDADES MEDIDA

async function cargarSelectUnidadMedida() {

    const response = await GET('/unidades_medida/');

    if (response.success) {

        response.data.forEach(function (element) {

            // Select unidades medida pop up alta articulo
            let miSelect = document.getElementById("cmbUnidadMedida");
            let opt = document.createElement("option");
    
            opt.appendChild(document.createTextNode(element.descripcion));
            opt.value = element.id;
    
            miSelect.appendChild(opt);

            // Select unidades medida pop up modif articulo
            let cmbEncargadoModific = document.getElementById("cmbUnidadMedida_Modificar");
            let optModif = document.createElement("option");

            optModif.appendChild(document.createTextNode(element.descripcion));
            optModif.value = element.id;

            cmbEncargadoModific.appendChild(optModif);
        })
    }
    else {
        console.error(`Error: ${response.data}. Status: ${response.statusCode}`);
    }

    
}


// DAR DE BAJA ARTICULO

function confirmar_eliminacion_articulo(id, nombre) {

    $('#btn_baja_articulo').off('click');
    
    $("#mensaje_confirm_delete").text("Seguro que desea dar de baja el articulo " + nombre + "?");

    $("#btn_baja_articulo").click(function (){
        eliminar_articulo(id);
    });

    $("#popup_baja_articulo").modal("show");
}


async function eliminar_articulo(id) {
    
    let path = `/articulo/${id}/`;

    const response = await DELETE(path);

    if (response.success) {

        swal({
            title: "Información",
            text: "Articulo dado de baja con éxito",
            icon: "success",
          });

        const response_articulos = await GET('/articulos/');

        if (response_articulos.success) {
            llenar_tabla(response_articulos.data, tabla_articulos);
        }
        else {
            console.error(`Error: ${response_articulos.data}. Status: ${response_articulos.statusCode}`);
        }
          
    }
    else {
        swal({
            title: "Información",
            text: "No fué posible dar de baja el articulo",
            icon: "error",
          });
    }

    $("#popup_baja_articulo").modal("hide");
}

// ALTA ARTICULO   

async function alta_articulo (nombre, descripcion, precio_unitario, marca , categoria , unidad_medida , cantidad_medida ) {
    


    if(marca == 0 || nombre=="" || precio_unitario=="" || categoria==0 || unidad_medida==0 || cantidad_medida=="" ) {
        swal({
            title: "Información",
            text: "Todos los campos son obligatorios, excepto 'Descripcion'",
            icon: "error",
          });
          
        return;
    }
    if(isNaN(precio_unitario)|| precio_unitario <= 0 ){
        swal({
            title: "Valor incorrecto",
            text: "El campo 'Precio' debe llevar un valor numerico correcto",
            icon: "error",
          });
          
        return;
    }
    if(isNaN(cantidad_medida) || cantidad_medida <= 0){
        swal({
            title: "Valor incorrecto",
            text: "El campo 'Cantidad Medida' debe llevar un valor numerico correcto",
            icon: "error",
          });
          
        return;
    }

    let bodyRequest = {
        'nombre' : nombre,
        'descripcion': descripcion,
        'precio_unitario' : precio_unitario,
        'id_marca' : marca,//id
        'id_categoria' : categoria,//id
        'id_unidad_medida' : unidad_medida, //id
        'cantidad_medida' : cantidad_medida 
        
    }

    const response = await POST('/articulo/', bodyRequest);

    if (response.success) {
        swal({
            title: "Información",
            text: "Articulo dado de alta con éxito",
            icon: "success",
          });
          const response_articulos = await GET('/articulos/');

          if (response_articulos.success) {
              llenar_tabla(response_articulos.data, tabla_articulos);
              
          }
          else {
                console.error(`Error: ${response_articulos.data}. Status: ${response_articulos.statusCode}`);
          }

          $('#popup_alta_articulo').modal('hide');

    }
    else {
        
        swal({
            title: "Información",
            text: `${response.data}`,
            icon: "error",
          });
    }
}

// Modificacion articulo

async function modal_modificacion_articulo(id) {
    
    let path = `/articulo/${id}/`;

    // acá iria el reemplazo del get articulo
    const response = await GET(path);

    if (response.success) {

        $('#btnConfirmarModificacion').off('click');
       

        $('#txtNombreArticulo_Modificar').val(response.data.nombre);
        $('#txtDescripcion_Modificar').val(response.data.descripcion);
        $('#txtPrecio_Modificar').val(response.data.precio_unitario);  
        $('#cmbMarca_Modificar').val(response.data.id_marca);//idmarca
        $('#cmbCategoria_Modificar').val(response.data.id_categoria);//idcategoria
        $('#cmbUnidadMedida_Modificar').val(response.data.id_unidad_medida);//idunidad
        $('#txtCantidadMedida_Modificar').val(response.data.cantidad_medida); 

        
        $('#btnConfirmarModificacion').click(function() {
            modificar_articulo(id);
        });

        $('#popup_modif_articulo').modal('show');

    }
    else {
        console.error(`Error: ${response.data}. Status: ${response.statusCode}`);
    }
    
}

async function modificar_articulo(id) {

    let path = `/articulo/${id}/`;
    
    let nombre = $('#txtNombreArticulo_Modificar').val();
    let descripcion = $('#txtDescripcion_Modificar').val();
    let precio_unitario = $('#txtPrecio_Modificar').val();
    let marca = $('#cmbMarca_Modificar').val();
    let categoria = $('#cmbCategoria_Modificar').val();
    let unidad_medida = $('#cmbUnidadMedida_Modificar').val();
    let cantidad_medida = $('#txtCantidadMedida_Modificar').val();

    if( precio_unitario==""  || cantidad_medida=="" ) {
        swal({
            title: "Información",
            text: "Los campos 'Precio Unitario' y 'Cantidad Medida' son obligatorios",
            icon: "error",
          });
          
        return;
    }
    if(isNaN(precio_unitario || precio_unitario <= 0)){
        swal({
            title: "Valor incorrecto",
            text: "El campo 'Precio' debe llevar un valor numerico correcto",
            icon: "error",
          });
          
        return;
    }
    if(isNaN(cantidad_medida) || cantidad_medida <= 0){
        swal({
            title: "Valor incorrecto",
            text: "El campo 'Cantidad Medida' debe llevar un valor numerico correcto",
            icon: "error",
          });
          
        return;
    }

    let bodyRequest = {
        'nombre' : nombre,
        'descripcion': descripcion,
        'precio_unitario' : precio_unitario,
        'id_marca' : marca,//id
        'id_categoria' : categoria,//id
        'id_unidad_medida' : unidad_medida, //id
        'cantidad_medida' : cantidad_medida 
        
    }

    const response = await PUT(path, bodyRequest);

    if (response.success) {
        swal({
            title: "Información",
            text: "Modificación exitosa",
            icon: "success",
          });

        const response_articulos = await GET('/articulos/');

        if (response_articulos.success) {
            llenar_tabla(response_articulos.data, tabla_articulos);
            
        }
        else {
            console.error(`Error: ${response_articulos.data}. Status: ${response_articulos.statusCode}`);
        }

        $('#popup_modif_articulo').modal('hide');
    }
    else {
        swal({
            title: "Información",
            text: `${response.data}`,
            icon: "error",
          });
    }
}



function limpiarFormularioAlta() {
    $('#txtNombreArticulo').val('');
    $('#txtDescripcion').val('');
    $('#txtPrecio').val('');    
    $('#cmbMarca').val(0);
    $('#cmbCategoria').val(0);
    $('#cmbUnidadMedida').val(0);
    $('#txtCantidadMedida').val('');
}