
import { GET, POST } from "./api.js";

var f_movimientos_inicio = moment().format('YYYY-MM-DD');
var f_movimientos_fin = moment().format('YYYY-MM-DD');
var tabla_reporte;
var productividad_suc_actual;
var cantidades_movimientos;

$(document).ready(function (){
    
    $('#section_lista_resumen').hide();
    $('#productividad').hide();
    innitFiltroFechas();
    innitTablaReporte();
    innitComboDepositos();
    getDepositos();


    $('#btnVerReporte').click(function() {
        verReporte();
    });

    $('#btnRegresar').click(function (){
      toggleReportView('section_filters');
    });

    $('#divPedidos').click(function(){
      changeTipoMovimiento('Pedidos');
    });
    $('#divTraspSalientes').click(function(){
      changeTipoMovimiento('Traspasos salientes');
    });
    $('#divTraspEntrantes').click(function(){
      changeTipoMovimiento('Traspasos entrantes');
    });
    $('#divTodosMovimientos').click(function(){
      changeTipoMovimiento('Total movimientos');
    });
    $('#btnResumenDepositos').click(function(){
      toggleReportView('section_lista_resumen');
    });
    $('#btnRegresarProductividad').click(function(){
      toggleReportView('productividad');
    });

});

async function verReporte() {   

    let lstDepositos = $('#cmbDepositos').val().toString();

    if (lstDepositos == null || lstDepositos == '') {
        swal({
            title: "Atención",
            text: `Debe seleccionar al menos un depósito`,
            icon: "warning",
          });

        return;
    }

    
    let bodyRequest = {
        fecha_desde : f_movimientos_inicio,
        fecha_hasta : f_movimientos_fin,
        depositos : lstDepositos
    };

    let path = `/reportes/cantidad_movimientos_depositos/`;

    const response = await POST(path,bodyRequest);

    tabla_reporte.clear().draw();

    if (response.success) {
        if (response.data.reporte_depositos.length > 0) {
            cargarTablaReporte(response.data.reporte_depositos);
            productividad_suc_actual = response.data.reporte_por_deposito;
            cantidades_movimientos = response.data.cantidades_movimientos;
            console.log(cantidades_movimientos);
            verProductividad();
            toggleReportView('productividad');
            let fecha_filtro = $('#fecha_filtro').val();
            $('#lblSucursalProductividad').text('Productividad ' + $('#cmbDepositos option:selected').text());
            $('.lblFechaFiltrado').text(`Período del ${fecha_filtro.replace('-','al')}`);
        }
        else {
            swal({
                title: "Atención",
                text: `No hay resultados para ese criterio de búsqueda`,
                icon: "warning",
              });
        }
    }
    else {
        swal({
            title: "Atención",
            text: `${response.data}`,
            icon: "error",
          });
    }
}


function cargarTablaReporte(data) {

    data.forEach(item => {
        tabla_reporte.row.add([item.deposito, item.tipo_movimiento, item.cantidad, `${item.pendientes}%`, `${item.confirmados}%`, `${item.modificados}%`, `${item.rechazados}%`]).draw();
    });

}


function toggleReportView(view) {
  if (view == 'productividad') {
    $('#productividad').show();
    $('#section_filters').hide();
    $('#section_lista_resumen').hide();
    $('#rpt_content').hide();
  }
  else if (view == 'section_filters') {
    $('#productividad').hide();
    $('#section_filters').show();
    $('#section_lista_resumen').hide();
    $('#rpt_content').show();
  }
  else if (view == 'section_lista_resumen') {
    $('#productividad').hide();
    $('#section_filters').hide();
    $('#section_lista_resumen').show();
    $('#rpt_content').show();
  }
}

function innitComboDepositos() {

    $('.select2').select2(
    {
        language: "es",
        allowClear: true,
        closeOnSelect: false,
        minimumResultsForSearch: Infinity
    });   

    $('#cmbDepositos').on('select2:select', function (e) {
        let data = e.params.data;
    
        let _seleccion = data.id;

        if ($('#cmbDepositos').val().toString().includes('todos'))
        {
            $('#cmbDepositos').val(null).trigger('change');
            $('#cmbDepositos').val(_seleccion).trigger('change');
        }
        
        
    });

}

function innitTablaReporte() {

    tabla_reporte = $('#tabla_resultado_reporte').DataTable({
        "language": datetable_languaje,
        ordering: false,
        pageLength: 5,
        columnDefs: [
            {
                'targets': 0,  
                'searchable': true,
                'orderable': true      
            },
        ],
        order: [
            [ 0, "asc" ],
            [ 1, "asc" ]
        ],
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text:'<i class="fas fa-file-excel"></i> Exportar',
                className: 'btn btn-success',
                title:`Reporte Movimientos Depositos ${moment().format('DD-MM-YYYY HH.mm')} HS`,
                customize: function (xlsx)
                {

                    var filtros = {

                        'Fecha de Emisión' : `${moment().format('DD/MM/YYYY HH:mm')} HS`,
                        'Emitido por' : `${user_info_nombre()} ${user_info_apellido()} (${user_info_username()})`,
                        'Rango de fechas' : `${$('#fecha_filtro').val()}`
                    }


                    generateReportHeader('Movimientos por depósito', filtros, xlsx);

                }
            }
        ],
        rowCallback: function( row, data, iDisplayIndex ) {
            setColorScaleRuler(data[3],$(row).find('td:eq(3)'), false);

            $(row).find('td:eq(0)').attr('style','white-space:nowrap;');
            $(row).find('td:eq(7)').attr('style','white-space:nowrap;');

            // Alineación a la derecha valores numericos
            $(row).find('td:eq(2)').addClass('text-right');
            $(row).find('td:eq(3)').addClass('text-right');
            $(row).find('td:eq(4)').addClass('text-right');
            $(row).find('td:eq(5)').addClass('text-right');
            $(row).find('td:eq(6)').addClass('text-right');
        },
        
    });

    $('#tabla_resultado_reporte tbody').on( 'click', 'td', function () {
       
        let rowIdx = tabla_reporte.cell( this ).index().row;
        let colIdx = tabla_reporte.cell(this).index().column;  

        let id_usuario = tabla_reporte.rows( rowIdx ).data()[0][0] ;
        let username = tabla_reporte.rows( rowIdx ).data()[0][1] ;
    

        if (colIdx == 7) {
            verProductividad();
        }
    
    } );  

}


function verProductividad() {

    productividad_suc_actual.forEach(movimiento => {
      if (movimiento.tipo_movimiento == "Traspasos entrantes") {
        $('#lblCountTE').text(`${movimiento.total}`);
      }
      else if (movimiento.tipo_movimiento == "Traspasos salientes") {
        $('#lblCountTS').text(`${movimiento.total}`);
      }
      else if (movimiento.tipo_movimiento == "Pedidos") {
        $('#lblCountPedidos').text(`${movimiento.total}`);
      }
      else {
        $('#lblCountTotal').text(`${movimiento.total}`);
      }

    });

    chartTraspasosSalientes();
    chartTraspasosEntrantes();
    chartPedidos();
    chartTotalMovimientos();

    changeTipoMovimiento('Total movimientos');
}

function changeTipoMovimiento(tipoMovimiento) {
  let porcPendientes = "";
  let porcConfirmados = "";
  let porcModificados = "";
  let porcRechazados = "";
  
  productividad_suc_actual.forEach(movimiento => {
    if (movimiento.tipo_movimiento == tipoMovimiento) {
      $('#lblTipoMovimiento').text(tipoMovimiento);
      porcPendientes = movimiento.pendientes.toString();
      porcConfirmados = movimiento.confirmados.toString();
      porcModificados = movimiento.modificados.toString();
      porcRechazados = movimiento.rechazados.toString();

    }
  });

  $('.progress #porcPendientes').attr('style',`width:${porcPendientes}%`);
  $('.progress #porcConfirmados').attr('style',`width:${porcConfirmados}%`);
  $('.progress #porcModificados').attr('style',`width:${porcModificados}%`);
  $('.progress #porcRechazados').attr('style',`width:${porcRechazados}%`);

  $('.progress #porcPendientes').text(`${porcPendientes}%`);
  $('.progress #porcConfirmados').text(`${porcConfirmados}%`);
  $('.progress #porcModificados').text(`${porcModificados}%`);
  $('.progress #porcRechazados').text(`${porcRechazados}%`);

  chartProductividad(tipoMovimiento);

}


async function getDepositos() {

    let cmbDepositos = document.getElementById("cmbDepositos");
    
    const response = await GET('/depositos/');

    if (response.success) {

        let optTodos = document.createElement("option");
   
        optTodos.appendChild(document.createTextNode("Todos"));
        optTodos.value = 'todos';

        cmbDepositos.appendChild(optTodos);

        response.data.forEach(deposito => {

           // Select depositos
           let opt = document.createElement("option");
   
           opt.appendChild(document.createTextNode(deposito.nombre));
           opt.value = deposito.id;
   
           cmbDepositos.appendChild(opt);
        });
        
    }
    else {
        console.error(`Error: ${response.data}`);
    }
}


function innitFiltroFechas() {

    $('#fecha_filtro').daterangepicker({

        startDate: moment(),
        endDate: moment(),
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últ. 7 días': [moment().subtract(6, 'days'), moment()],
            'Últ. 30 días': [moment().subtract(29, 'days'), moment()]
        },
    
        "alwaysShowCalendars": true,
        "showDropdowns": false,
        "minYear": 1901,
        "maxYear": 2999,
        "maxSpan": {
            "days": 31
        },
        "locale": locale_daterangepicker,
        autoUpdateInput: false,
        "maxDate": moment(),
        "buttonClasses": "btn btn-md btn-primary",
        "cancelClass": "btn btn-md btn-default"
    }, function(start, end, label) {
       
        f_movimientos_inicio = start.format('YYYY-MM-DD') ;
        f_movimientos_fin = end.format('YYYY-MM-DD');
    
      
    });
    

    $('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });

    let today = moment().format('DD/MM/YYYY');
    let yesterday = moment().subtract(1,'days').format('DD/MM/YYYY');

    $('input[name="datefilter"]').val(`${today} - ${today}`);
    
    
    
}


function chartProductividad(tipo_movimiento) {

    $('#lblProductividadChart').text('Productividad gestión ' + tipo_movimiento);

    let movimientoSuc = productividad_suc_actual.filter(movimiento => movimiento.tipo_movimiento == tipo_movimiento)[0] ;
    let gestionado = parseFloat(movimientoSuc.confirmados) +  parseFloat(movimientoSuc.modificados) +  parseFloat(movimientoSuc.rechazados);
    let noGestionados = parseFloat(movimientoSuc.pendientes);  
    
    $("#chartDiv").html("")
    let aleatorio = Math.random();

    $("#chartDiv").html("<canvas id='chartProd" + aleatorio + "'></canvas>")
    var ctx = document.getElementById("chartProd" + aleatorio);
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              label: "My First dataset",
              data: [gestionado, noGestionados],
              backgroundColor: [
                '#00b5e9',
                '#fa4251'
              ],
              hoverBackgroundColor: [
                '#00b5e9',
                '#fa4251'
              ],
              borderWidth: [
                0, 0
              ],
              hoverBorderColor: [
                'transparent',
                'transparent'
              ]
            }
          ],
          labels: [
            ' % gestionado',
            ' % no gestionado'
          ]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          cutoutPercentage: 55,
          animation: {
            animateScale: true,
            animateRotate: true
          },
          legend: {
            display: false
          },
          tooltips: {
            titleFontFamily: "Poppins",
            xPadding: 15,
            yPadding: 10,
            caretPadding: 0,
            bodyFontSize: 16
          }
        }
    });
}


function grafico() {

    $("#teChart").html("")
    let aleatorio = Math.random()

    $("#teChart").html("<canvas id='chartTE" + aleatorio + "'></canvas>")
    var ctx = document.getElementById("chartTE" + aleatorio).getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['01-10','05-10','09-10','15-10','23-10'],
            datasets: [{
                label: 'Cantidad',
                data: [10,5,3,9,8],
                backgroundColor: 'transparent',
                borderColor: 'rgba(255,255,255,.55)'
            }],
            
        },
        options: {

            maintainAspectRatio: false,
            legend: {
              display: false
            },
            responsive: true,
            tooltips: {
              mode: 'index',
              titleFontSize: 12,
              titleFontColor: '#000',
              bodyFontColor: '#000',
              backgroundColor: '#fff',
              titleFontFamily: 'Montserrat',
              bodyFontFamily: 'Montserrat',
              cornerRadius: 3,
              intersect: false,
            },
            scales: {
              xAxes: [{
                gridLines: {
                  color: 'transparent',
                  zeroLineColor: 'transparent'
                },
                ticks: {
                  fontSize: 2,
                  fontColor: 'transparent'
                }
              }],
              yAxes: [{
                display: false,
                ticks: {
                  display: false,
                }
              }]
            },
            title: {
              display: false,
            },
            elements: {
              line: {
                borderWidth: 1
              },
              point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4
              }
            }
          }
    });
}


function chartTraspasosSalientes() {

    let cant_traspasos_salientes = cantidades_movimientos.filter(item => item.movimiento == 'Traspasos salientes');

    $("#tsChart").html("")
    let aleatorio = Math.random()

    $("#tsChart").html("<canvas id='chartTS" + aleatorio + "'></canvas>")
    var ctx = document.getElementById("chartTS" + aleatorio).getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: $.map(cant_traspasos_salientes, row => row.fecha),
            datasets: [{
                label: 'Cantidad',
                data: $.map(cant_traspasos_salientes, row => row.cantidad),
                backgroundColor: 'transparent',
                borderColor: 'rgba(255,255,255,.55)'
            }],
            
        },
        options: {

            maintainAspectRatio: false,
            legend: {
              display: false
            },
            responsive: true,
            tooltips: {
              mode: 'index',
              titleFontSize: 12,
              titleFontColor: '#000',
              bodyFontColor: '#000',
              backgroundColor: '#fff',
              titleFontFamily: 'Montserrat',
              bodyFontFamily: 'Montserrat',
              cornerRadius: 3,
              intersect: false,
            },
            scales: {
              xAxes: [{
                gridLines: {
                  color: 'transparent',
                  zeroLineColor: 'transparent'
                },
                ticks: {
                  fontSize: 2,
                  fontColor: 'transparent'
                }
              }],
              yAxes: [{
                display: false,
                ticks: {
                  display: false,
                }
              }]
            },
            title: {
              display: false,
            },
            elements: {
              line: {
                tension: 0.00001,
                borderWidth: 1
              },
              point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4
              }
            }
          }
    });
}


function chartTraspasosEntrantes() {

  let cant_traspasos_entrantes = cantidades_movimientos.filter(item => item.movimiento == 'Traspasos entrantes');

  $("#teChart").html("")
  let aleatorio = Math.random()

  $("#teChart").html("<canvas id='chartTE" + aleatorio + "'></canvas>")
  var ctx = document.getElementById("chartTE" + aleatorio).getContext('2d');

  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: $.map(cant_traspasos_entrantes, row => row.fecha),
          datasets: [{
              label: 'Cantidad',
              data: $.map(cant_traspasos_entrantes, row => row.cantidad),
              backgroundColor: 'transparent',
              borderColor: 'rgba(255,255,255,.55)'
          }],
          
      },
      options: {

        maintainAspectRatio: false,
        legend: {
          display: false
        },
        responsive: true,
        tooltips: {
          mode: 'index',
          titleFontSize: 12,
          titleFontColor: '#000',
          bodyFontColor: '#000',
          backgroundColor: '#fff',
          titleFontFamily: 'Montserrat',
          bodyFontFamily: 'Montserrat',
          cornerRadius: 3,
          intersect: false,
        },
        scales: {
          xAxes: [{
            gridLines: {
              color: 'transparent',
              zeroLineColor: 'transparent'
            },
            ticks: {
              fontSize: 2,
              fontColor: 'transparent'
            }
          }],
          yAxes: [{
            display: false,
            ticks: {
              display: false,
            }
          }]
        },
        title: {
          display: false,
        },
        elements: {
          line: {
            borderWidth: 1
          },
          point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4
          }
        }
      }
  });
}


function chartPedidos() {

  let cant_pedidos = cantidades_movimientos.filter(item => item.movimiento == 'Pedidos');

  $("#pedidosChart").html("")
  let aleatorio = Math.random()

  $("#pedidosChart").html("<canvas id='chartPedidos" + aleatorio + "'></canvas>")
  var ctx = document.getElementById("chartPedidos" + aleatorio).getContext('2d');

  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: $.map(cant_pedidos, row => row.fecha),
          datasets: [{
              label: 'Cantidad',
              data: $.map(cant_pedidos, row => row.cantidad),
              backgroundColor: 'transparent',
              borderColor: 'rgba(255,255,255,.55)'
          }],
          
      },
      options: {

        maintainAspectRatio: false,
        legend: {
          display: false
        },
        responsive: true,
        tooltips: {
          mode: 'index',
          titleFontSize: 12,
          titleFontColor: '#000',
          bodyFontColor: '#000',
          backgroundColor: '#fff',
          titleFontFamily: 'Montserrat',
          bodyFontFamily: 'Montserrat',
          cornerRadius: 3,
          intersect: false,
        },
        scales: {
          xAxes: [{
            gridLines: {
              color: 'transparent',
              zeroLineColor: 'transparent'
            },
            ticks: {
              fontSize: 2,
              fontColor: 'transparent'
            }
          }],
          yAxes: [{
            display: false,
            ticks: {
              display: false,
            }
          }]
        },
        title: {
          display: false,
        },
        elements: {
          line: {
            borderWidth: 1
          },
          point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4
          }
        }
      }
  });
}


function chartTotalMovimientos() {

  let cant_total = cantidades_movimientos.filter(item => item.movimiento == 'Total movimientos');

  $("#totalChart").html("")
  let aleatorio = Math.random()

  $("#totalChart").html("<canvas id='chartTotal" + aleatorio + "'></canvas>")
  var ctx = document.getElementById("chartTotal" + aleatorio).getContext('2d');

  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: $.map(cant_total, row => row.fecha),
          datasets: [{
              label: 'Cantidad',
              data: $.map(cant_total, row => row.cantidad),
              backgroundColor: 'transparent',
              borderColor: 'rgba(255,255,255,.55)'
          }],
          
      },
      options: {

        maintainAspectRatio: false,
        legend: {
          display: false
        },
        responsive: true,
        tooltips: {
          mode: 'index',
          titleFontSize: 12,
          titleFontColor: '#000',
          bodyFontColor: '#000',
          backgroundColor: '#fff',
          titleFontFamily: 'Montserrat',
          bodyFontFamily: 'Montserrat',
          cornerRadius: 3,
          intersect: false,
        },
        scales: {
          xAxes: [{
            gridLines: {
              color: 'transparent',
              zeroLineColor: 'transparent'
            },
            ticks: {
              fontSize: 2,
              fontColor: 'transparent'
            }
          }],
          yAxes: [{
            display: false,
            ticks: {
              display: false,
            }
          }]
        },
        title: {
          display: false,
        },
        elements: {
          line: {
            tension: 0.00001,
            borderWidth: 1
          },
          point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4
          }
        }
      }
  });
}