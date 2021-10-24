import { GET } from './api.js';
var list_depos = [];
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
}
async function loadDepositos() {
    const depositos = await GET('/depositos/');
    if (depositos.success) {
        depositos.data.forEach(deposito => {
            list_depos.push(deposito.nombre)
        });
        loadChart()
    }
}

function loadChart() {
    console.log(list_depos)
    var data = {
        labels: list_depos,
        datasets: [{
            label: "Articulos por depositos",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [65, 59, 20, 81, 56, 55, 40],
        }]
    };
    var options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                stacked: true,
                grid: {
                    display: true,
                    color: "rgba(255,99,132,0.2)"
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    new Chart('chart', {
        type: 'bar',
        options: options,
        data: data
    });

}
