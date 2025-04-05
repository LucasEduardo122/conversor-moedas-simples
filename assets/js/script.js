function renderizarGrafico(dados) {
  if (dados.length != 0) {

    const options = {
      series: [
        {
          name: "cambio",
          data: dados.map(item => {
            return { x: new Date(item.data).getTime(), y: item.cotacao }
          }),
        },
      ],
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      yaxis: {
        min: 5,
        tickAmount: 4,
        labels: {
          formatter: (value) => {
            return value.toFixed(1).replace('.', ',')
          },
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
        tooltip: {
          enabled: false,
        },
        axisTicks: {
          show: false,
        },
      },
      fill: {
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100],
        },
      },
      colors: ["#7C3AED"],
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return `<div class="tooltip">
        <span>${String(series[seriesIndex][dataPointIndex]).replace('.', ',')}</span>
        <span>${new Date(
            w.globals.seriesX[seriesIndex][dataPointIndex]
          ).toLocaleDateString("pt-BR", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}</span>
        </div>`
        },
      },
    }

    console.log(chart)

    if (chart) {
      chart.destroy();
    }

    chart = new ApexCharts(document.querySelector("#chart"), options)
    chart.render()
  }
}