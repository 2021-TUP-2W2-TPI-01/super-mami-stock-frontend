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
    let [datosDestino, datoOrigen] = await Promise.all([GET('/depositos/'), GET('/deposito/deposito_usuario/')]);
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
    const datos = await GET('/existencias/');
    let pasar_button = ''
    if (datos.success) {
        articulos = datos.data
        articulos.forEach(articulos => {
            pasar_button = '<td><div id="valor_articulo" class="table-data-feature"> <button class="item fa fa-forward text-success" data-placement="top"> </button></div></td>';
            tabla_stock_origen.row.add([articulos.id_articulo, articulos.nombre_articulo, articulos.cantidad, pasar_button]).draw()
        });
        // datos.data.forEach(articulo => {
        //     pasar_button = '<td><div id="valor_articulo" class="table-data-feature"> <button class="item fa fa-forward text-success" data-placement="top"> </button></div></td>';
        //     tabla_stock_origen.row.add([articulo.id_articulo,articulo.nombre_articulo,articulo.cantidad,pasar_button]).draw()
        // });
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
            text: "Ingrese una cantidad menor al stock vigente ",
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
async function cargarTablaDestino(id_articulo, cantidad_ingresada) {
    let pasar_button = ''
    articulos.forEach(articulo => {
        if (articulo.id_articulo == id_articulo){
            articulo.cantidad = articulo.cantidad - cantidad_ingresada
            cantidad_stock = articulo.cantidad
        }
    });
    tabla_stock_origen.clear().draw();
    articulos.forEach(articulo => {
        pasar_button = '<td><div id="valor_articulo" class="table-data-feature"> <button class="item fa fa-forward text-success" data-placement="top"> </button></div></td>';
        tabla_stock_origen.row.add([articulo.id_articulo, articulo.nombre_articulo, articulo.cantidad, pasar_button]).draw()
    });

    articulos.forEach(articulo => {
        if (articulo.id_articulo == id_articulo){
            if(articulos_enviados.length == 0){
                articulo.cantidad = cantidad_ingresada
                articulos_enviados.push(articulo)
            }else{
                    articulos_enviados.forEach(articulo_enviado => {
                        if(articulo_enviado.id_articulo != id_articulo){
                            articulo.cantidad = cantidad_ingresada
                            articulos_enviados.push(articulo)
                            alert('hola1')
                        }else{
                            alert('hola2')
                            articulo_enviado.cantidad = (articulo.cantidad+cantidad_ingresada)
                        }
                    });
                }
        }
    });
    tabla_stock_destino.clear().draw();
    articulos_enviados.forEach(articulo_enviado => {
        pasar_button = '<td><div id="valor_articulo" class="table-data-feature"> <button class="item fa fa-backward text-danger" data-placement="top"> </button></div></td>';
        tabla_stock_destino.row.add([articulo_enviado.id_articulo, articulo_enviado.nombre_articulo, articulo_enviado.cantidad, pasar_button]).draw()
    });
}
