import { GET, POST } from './api.js';
var list_depos = [];
var articulo_Seleccionado = ''
var $VALORES_LIST = []
var $DEPOSITO_LIST = [] //Se usa para obtener Id solamente
var valores = []
var articulos = []

$(document).ready(function () {
    getArticulos();
    loadCmbCategorias();
    loadDepositos();
    $('#m').hide();
    $('#contentHistorico').hide();

    $('#btnRegresar').click(function(){
        toggleReportsViews(false);
    });
    
    $('.select2bs4_search').select2(
    {
        language: "es"
    });
})


function loadCmbArticulos(articulos) {
    console.log(articulos);
    var cmbArticulos = $("#cmbArticulos")
    var str = '<option value=0>' + "Seleccione un artículo" + '</option>'
    cmbArticulos.html('')
    articulos.forEach(articulo => {
        if (articulo.nombre == articulo_Seleccionado) {
            str += '<option selected value=' + articulo.id + '>' + articulo.nombre + '</option>';
        }
        else {
            str += '<option value=' + articulo.id + '>' + articulo.nombre + '</option>';
        }
       
    });
    cmbArticulos.html(str)
    
    var e = document.getElementById("cmbArticulos");
    var articulo_nombre = e.options[e.selectedIndex].text;
    articulo_Seleccionado = articulo_nombre
}

async function getArticulos() {
    const response = await GET('/articulos/');
    if (response.success) {
        articulos = response.data;

        loadCmbArticulos(articulos);
    }

}

$('#cmbCategorias').on('change', function(){
    if ($('#cmbCategorias').val() != 0) {
        let categoria = $('#cmbCategorias option:selected').text();
        let art_filtrados = articulos.filter(articulo => articulo.categoria == categoria);
        loadCmbArticulos(art_filtrados)
    }
    else {
        getArticulos();
    }
    
});


async function loadCmbCategorias() {
    var cmbCategorias = $("#cmbCategorias")
    var str = '<option value=0>' + "Sin filtrar" + '</option>'
    const response = await GET('/categorias/');
    if (response.success) {
        cmbCategorias.html('')
        response.data.forEach(categoria => {
            str += '<option value=' + categoria.id + '>' + categoria.descripcion + '</option>';
        });
        cmbCategorias.html(str)
    }
    var e = document.getElementById("cmbCategorias");
    var articulo_nombre = e.options[e.selectedIndex].text;
    articulo_Seleccionado = articulo_nombre
}


$("#cmbArticulos").on('change', function () {
    var codigo_art = $("#cmbArticulos").val()
    if (codigo_art == 0) {
        $('#m').hide();
        return;
    }
    var e = document.getElementById("cmbArticulos");
    var articulo_nombre = e.options[e.selectedIndex].text;
    articulo_Seleccionado = articulo_nombre
    
    loadArticulosPerDeposito(codigo_art)
    loadChart();
})


async function loadDepositos() {
    let first = true;
    list_depos = []
    $DEPOSITO_LIST = []
    var str = '<small><h5>Seleccione un depósito</h5><hr>'
    const depositos = await GET('/depositos/');
    if (depositos.success) {
        depositos.data.forEach(deposito => {
            if (first) {
                list_depos.push('Suc: ' + deposito.id)
                str += '<input class="form-check-input" type="radio" id="' + deposito.id + '" checked name="radioDepositos" value="' + deposito.nombre + '">'
                str += 'Suc <b><a class="text-primary">' + deposito.id + '</a> </b>: <b>' + deposito.nombre + "</b><br> ";
                $DEPOSITO_LIST.push(deposito.id)
                first = false;
            }
            else {
                list_depos.push('Suc: ' + deposito.id)
                str += '<input class="form-check-input" type="radio" name="radioDepositos" id="' + deposito.id + '" value="' + deposito.nombre + '">'
                str += 'Suc <b><a class="text-primary">' + deposito.id + '</a> </b>: <b>' + deposito.nombre + "</b><br> ";
                $DEPOSITO_LIST.push(deposito.id)
            }
        });

    }
    str += '</small><hr>'
    str += '<button type="button" class="btn btn-primary float-right" id="btnVerHistorico">Ver histórico</button>';
    $("#depositosNombre").html(str);

    $('#btnVerHistorico').off('click');

    $('#btnVerHistorico').click(function(){
        let deposito = {};
        let articulo = {};

        deposito.id = $("input[name=radioDepositos]:checked").attr('id');
        deposito.name = $("input[name=radioDepositos]:checked").val();
        
        articulo.id = $("#cmbArticulos").val();
        articulo.name = $('#cmbArticulos option:selected').text();

        getHistoricoStock(articulo, deposito);
    });
}

async function getHistoricoStock(articulo, deposito) {
    let path = '/reportes/historico_stock/';
        let bodyRequest = {
            "deposito" : deposito.id,
            "articulo" : articulo.id
        }
        const response = await POST(path, bodyRequest);

        if (response.success) {
            verHistoricoStock(articulo.name, deposito.name, response.data);
        }
        else {
            swal({
                title: "Información",
                text: "No fué posible cargar el histórico",
                icon: "error",
              });
            console.error(`Error : ${response.data}`);
        }
}


async function loadArticulosPerDeposito(codigo_articulo) {
    $VALORES_LIST = []
    valores = []
    var bodyRequest = { 'articulo': codigo_articulo }
    const existenciasDeposito = await POST('/reportes/stock_articulo_depositos/', bodyRequest);
    var j = 0;
    if (existenciasDeposito.success) {
        existenciasDeposito.data.forEach(art_dep => {
            $DEPOSITO_LIST.forEach(element => {
                if (art_dep.IdDeposito == element) {
                    $VALORES_LIST.push({ "deposito": art_dep.IdDeposito, "cantidad": art_dep.Cantidad })
                }
            });
        });

        var j = 0
        $DEPOSITO_LIST.forEach(element => {
            for (j; j < $VALORES_LIST.length; j++) {
                if ($VALORES_LIST[j]["deposito"] == element) {
                    valores.push($VALORES_LIST[j]["cantidad"])
                    j++;
                    break;
                } else {
                    valores.push(0)
                    break;
                }
            }
        });
        loadChart()
    }

}

function loadChart() {
    $('#m').show();
    $("#m").animate({
        opacity: 1,
    }, 1000, function () {

    });

    $("#w").html("")
    let aleatorio = Math.random()

    $("#w").html("<canvas id='myChart" + aleatorio + "'></canvas>")
    var ctx = document.getElementById("myChart" + aleatorio).getContext('2d');


    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: list_depos,
            datasets: [{
                label: articulo_Seleccionado,
                data: valores,
                backgroundColor: "rgb(2, 117, 216)"
            }]
        }
    });

}

function toggleReportsViews(historico=false){

    if (historico) {
        $('#contentHistorico').show();
        $('#content2').hide();
    }
    else {
        $('#contentHistorico').hide();
        $('#content2').show();
    }
    
}

function verHistoricoStock(articulo_name, deposito_name, data) {
    console.log(deposito_name);
    toggleReportsViews(true);
    $('#lblHistorico').text(` Histórico de stock ${articulo_name}`);
    $('#lblSeguimiento').text(`Seguimiento mensual para ${deposito_name}`);

    $("#wh").html("")
    let aleatorio = Math.random()

    $("#wh").html("<canvas id='chartHistorico" + aleatorio + "'></canvas>")
    var ctx = document.getElementById("chartHistorico" + aleatorio).getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: $.map(data, row => row.mes),
            datasets: [{
                label: 'Cantidad de stock',
                data: $.map(data, row => row.cantidad),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}