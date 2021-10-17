import { GET, DELETE, POST, PUT } from './api.js';
var tabla_stock_origen;
var tabla_stock_destino;
let id_articulo = ''
let nombre_articulo = ''
let cantidad_stock = ''
let articulos = []
let articulos_enviados = []
$(document).ready(function () {
    loadcmb();
    loadtableArticulosStock();
    $("#cantidad_cargar").inputFilter(function (value) {
        return /^\d*$/.test(value);    // Allow digits only, using a RegExp
    });
})
async function loadcmb() {
    var cmbDestino = $("#cmbDepositoDestino")
    var cmbOrigen = $("#cmbDepositoOrigen")
    var str = ''
    const [datosDestino, datoOrigen] = await Promise.all([GET('/depositos/'), GET('/deposito/deposito_usuario/')]);
    if (datosDestino.success) {
        cmbDestino.html('')
        datosDestino.data.forEach(deposito => {
            if (deposito.nombre != datoOrigen.data.nombre)
                str += '<option value=' + deposito.id + '>' + deposito.nombre + '</option>';
        });
        cmbDestino.html(str)
    }
    if (datoOrigen.success) {
        cmbOrigen.html('');
        var deposito = datoOrigen.data
        str = '<option value=' + deposito.id + '>' + deposito.nombre + '</option>';
        cmbOrigen.html(str)
    }
}
async function loadtableArticulosStock() {
    render_tabla();
    tabla_stock_origen.clear().draw();
    const [datosDestino, datoOrigen] = await Promise.all([GET('/existencias/'), GET('/existencias/')]);
    let pasar_button = ''
    if (datosDestino.success) {
        articulos = datosDestino.data
        articulos.forEach(articulos => {
            pasar_button = '<td><div id="valor_articulo" class="table-data-feature"> <button class="item fa fa-forward text-success" data-placement="top"> </button></div></td>';
            tabla_stock_origen.row.add([articulos.id_articulo, articulos.nombre_articulo, articulos.cantidad, pasar_button]).draw()
        });
    }
    if (datoOrigen.success) {
        articulos_enviados = datoOrigen.data
        articulos_enviados.forEach(articulo_enviado => {
            articulo_enviado.cantidad = 0
            pasar_button = '<td><div id="valor_articulo" class="table-data-feature"> <button class="item fa fa-backward text-danger" data-placement="top"> </button></div></td>';
            tabla_stock_destino.row.add([articulo_enviado.id_articulo, articulo_enviado.nombre_articulo, articulo_enviado.cantidad, pasar_button]).draw()
        });
    }

}
function render_tabla() {
    tabla_stock_origen = $('#tabla_articulo').DataTable({
        paging: false, info: false,
        language: datetable_languaje,
        autoWidth: true,
        pageLength: 10,
        scrollY: 200,
        paging: false,
        columnDefs: [
            {
                'targets': [1, 3],
                'searchable': false,
                'orderable': false,

            },
            {
                'targets': 0,
                'visible': false
            }
        ],
        preDrawCallback: function (settings) {
            var api = new $.fn.dataTable.Api(settings);
            var pagination = $(this)
                .closest('.dataTables_wrapper')
                .find('.dataTables_paginate');

            if (api.page.info().pages <= 1) {
                pagination.hide();
            }
            else {
                pagination.show();
            }

        }
    });
    tabla_stock_destino = $('#tabla_carrito').DataTable({
        paging: false, info: false,
        language: datetable_languaje,
        autoWidth: true,
        pageLength: 10,
        scrollY: 200,
        paging: false,
        columnDefs: [
            {
                'targets': [1, 3],
                'searchable': false,
                'orderable': false,

            },
            {
                'targets': 0,
                'visible': false
            }
        ],
        preDrawCallback: function (settings) {
            var api = new $.fn.dataTable.Api(settings);
            var pagination = $(this)
                .closest('.dataTables_wrapper')
                .find('.dataTables_paginate');

            if (api.page.info().pages <= 1) {
                pagination.hide();
            }
            else {
                pagination.show();
            }

        }
    });
}
$('#tabla_articulo tbody').on('click', 'td', function () {
    let rowIdx = tabla_stock_origen.cell(this).index().row;
    let colIdx = tabla_stock_origen.cell(this).index().column;
    if (colIdx == 3) {
        id_articulo = tabla_stock_origen.rows(rowIdx).data()[0][0];
        nombre_articulo = tabla_stock_origen.rows(rowIdx).data()[0][1];
        cantidad_stock = tabla_stock_origen.rows(rowIdx).data()[0][2];
        var modal = $("#modalCantidadCarga")
        modal.find('.modal-title').html('Cantidad de <u>' + nombre_articulo + '</u> a cargar')
        modal.find('#cantidad_cargar').val(cantidad_stock)
        $('#modalCantidadCarga').modal('show')
    }
});
$("#btnGuardarCantidadIngresada").on('click', function () {
    var desicion_datos = validarInputCantidadIngresada()
    if (desicion_datos.desicion == true) {
        cargarTablaDestino(id_articulo, desicion_datos.cantidad_stock_ingresada);
    }
});
(function ($) {
    $.fn.inputFilter = function (inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    };
}(jQuery));
function validarInputCantidadIngresada() {
    let cantidad_stock_ingresada = $('#cantidad_cargar').val()
    if (cantidad_stock_ingresada == 0) {
        swal({
            title: "Alerta!",
            text: "Ingrese una cantidad mayor a 0!",
            icon: "warning",
        });
        return { 'desicion': false, 'cantidad_stock_ingresada': '' };
    }
    if (cantidad_stock_ingresada > cantidad_stock) {
        swal({
            title: "Alerta!",
            text: "Ingrese una cantidad menor al stock vigente " + cantidad_stock,
            icon: "warning",
        });
        return { 'desicion': false, 'cantidad_stock_ingresada': '' };
    }
    if (isNaN(cantidad_stock_ingresada)) {
        swal({
            title: "Alerta!",
            text: "Ingrese una cantidad correcta!",
            icon: "warning",
        });
        return { 'desicion': false, 'cantidad_stock_ingresada': '' };
    }
    return { 'desicion': true, 'cantidad_stock_ingresada': cantidad_stock_ingresada };
}
function cargarTablaDestino(id_articulo, cantidad_ingresada) {
    let pasar_button = ''
    articulos.forEach(articulo => {
        if (articulo.id_articulo == id_articulo) {
            articulo.cantidad = articulo.cantidad - cantidad_ingresada
            cantidad_stock = articulo.cantidad
        }
    });
    tabla_stock_origen.clear().draw();
    articulos.forEach(articulo => {
        pasar_button = '<td><div id="valor_articulo" class="table-data-feature"> <button class="item fa fa-forward text-success" data-placement="top"> </button></div></td>';
        tabla_stock_origen.row.add([articulo.id_articulo, articulo.nombre_articulo, articulo.cantidad, pasar_button]).draw()
    });
    articulos_enviados.forEach(articulo_enviado => {
        if (articulo_enviado.id_articulo == id_articulo) {
            articulo_enviado.cantidad = Number(Number(articulo_enviado.cantidad) + Number(cantidad_ingresada))
        }
    });
    tabla_stock_destino.clear().draw();
    articulos_enviados.forEach(articulo_enviado => {
        pasar_button = '<td><div id="valor_articulo" class="table-data-feature"> <button class="item fa fa-backward text-danger" data-placement="top"> </button></div></td>';
        tabla_stock_destino.row.add([articulo_enviado.id_articulo, articulo_enviado.nombre_articulo, articulo_enviado.cantidad, pasar_button]).draw()
    });
}
$('#tabla_carrito tbody').on('click', 'td', function () {
    let rowIdx = tabla_stock_destino.cell(this).index().row;
    let colIdx = tabla_stock_destino.cell(this).index().column;
    if (colIdx == 3) {
        id_articulo = tabla_stock_destino.rows(rowIdx).data()[0][0];
        cantidad_stock = tabla_stock_destino.rows(rowIdx).data()[0][2];
        descargarTablaDestino(id_articulo, cantidad_stock)
    }
});
//feo se puede reutilizar con cargarTablaDestino, estaba apurado
function descargarTablaDestino(id_articulo, cantidad_stock) {
    let pasar_button = ''
    articulos.forEach(articulo => {
        if (articulo.id_articulo == id_articulo) {
            articulo.cantidad = articulo.cantidad + cantidad_stock
            cantidad_stock = articulo.cantidad
        }
    });
    tabla_stock_origen.clear().draw();
    articulos.forEach(articulo => {
        pasar_button = '<td><div id="valor_articulo" class="table-data-feature"> <button class="item fa fa-forward text-success" data-placement="top"> </button></div></td>';
        tabla_stock_origen.row.add([articulo.id_articulo, articulo.nombre_articulo, articulo.cantidad, pasar_button]).draw()
    });

    articulos_enviados.forEach(articulo_enviado => {
        if (articulo_enviado.id_articulo == id_articulo) {
            articulo_enviado.cantidad = Number(Number(articulo_enviado.cantidad) - Number(cantidad_stock))
        }
    });
    tabla_stock_destino.clear().draw();
    articulos_enviados.forEach(articulo_enviado => {
        pasar_button = '<td><div id="valor_articulo" class="table-data-feature"> <button class="item fa fa-backward text-danger" data-placement="top"> </button></div></td>';
        tabla_stock_destino.row.add([articulo_enviado.id_articulo, articulo_enviado.nombre_articulo, articulo_enviado.cantidad, pasar_button]).draw()
    });
}
$("#btnPopUpTraspasoConfirmacion").on('click', function () {
    var boolean_encontro_1 = false
    articulos_enviados.forEach(articulos_enviados => {
        if (articulos_enviados.cantidad != 0)
            boolean_encontro_1 = true
    });
    if (boolean_encontro_1) {
        var str_detalle = ''
        articulos_enviados.forEach(articulo_enviado => {
            str_detalle += '</b><br> ARTICULO: <b>' + articulo_enviado.nombre_articulo + " </b> CANTIDAD PEDIDA: <b>" + articulo_enviado.cantidad
        });
        $('#lblDetallesTraspaso').html('Detalle de traspaso: ' + str_detalle)
        $('#modalGenerarTraspaso').modal('show')
    }else{
        swal({
            title: "Error!",
            text: "No existen traspasos existentes.",
            icon: "error",
        });
    }
})
$("#btnConfirmTraspaso").on('click', function () {

})
async function generarTraspaso(){
    var cmbDestino = $("#cmbDepositoDestino").val()
    var cmbOrigen = $("#cmbDepositoOrigen").val()

    

    let bodyRequest = {
        'id_deposito_origen' : '30',
        'id_deposito_destino': cmbDestino,
        'detalle_traspaso' : detalle,
    }
    const response = await POST('/traspaso/', bodyRequest);

    if (response.success) {
        swal({
            title: "Información",
            text: "Depósito dado de alta con éxito",
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
            text: "El depósito cargado ya existe",
            icon: "error",
          });
    }
}
