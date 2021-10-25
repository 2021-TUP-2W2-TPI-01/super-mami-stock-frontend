import { GET, POST } from './api.js';
var list_depos = [];
var articulo_Seleccionado = ''
var $VALORES_LIST = []
var $DEPOSITO_LIST = [] //Se usa para obtener Id solamente
var valores = []

$(document).ready(function () {
    loadCmbArticulos();
    loadDepositos();
})


async function loadCmbArticulos() {
    var cmbArticulos = $("#cmbArticulos")
    var str = ''
    const articulos = await GET('/articulos/');
    if (articulos.success) {
        cmbArticulos.html('')
        articulos.data.forEach(articulo => {
            str += '<option value=' + articulo.id + '>' + articulo.nombre + '</option>';
        });
        cmbArticulos.html(str)
    }
    var e = document.getElementById("cmbArticulos");
    var articulo_nombre = e.options[e.selectedIndex].text;
    articulo_Seleccionado = articulo_nombre
}


$("#cmbArticulos").on('change', function () {
    var e = document.getElementById("cmbArticulos");
    var articulo_nombre = e.options[e.selectedIndex].text;
    articulo_Seleccionado = articulo_nombre
    var codigo_art = $("#cmbArticulos").val()
    loadArticulosPerDeposito(codigo_art)
    loadChart();
})


async function loadDepositos() {
    list_depos = []
    $DEPOSITO_LIST = []
    var str = '<small>'
    const depositos = await GET('/depositos/');
    if (depositos.success) {
        depositos.data.forEach(deposito => {
            list_depos.push('Suc: ' + deposito.id)
            str += 'Suc <b><a class="text-primary">' + deposito.id + '</a> </b>: <b>' + deposito.nombre + "</b><br> ";
            $DEPOSITO_LIST.push(deposito.id)
        });
        
    }
    str += '</small>'
    $("#depositosNombre").html(str)
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
                if (art_dep.IdDeposito == element){
                    console.log("entra"+art_dep.IdDeposito)
                    $VALORES_LIST.push({"deposito":art_dep.IdDeposito,"cantidad":art_dep.Cantidad})
                }
            });
        });

        var j = 0
        $DEPOSITO_LIST.forEach(element => {
            for (j; j < $VALORES_LIST.length; j++) {
                if($VALORES_LIST[j]["deposito"] == element){
                    valores.push($VALORES_LIST[j]["cantidad"])
                    j++;
                    break;
                }else{
                    valores.push(0)
                    break;
                }
            }
        });
        loadChart()
    }
    
}

function loadChart() {
    $("#w").html("")
    let aleatorio = Math.random()

    $("#w").html("<canvas id='myChart"+aleatorio+"'></canvas>")
    var ctx = document.getElementById("myChart"+aleatorio).getContext('2d');
    
   
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
