import React from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

// Definición de tipo para los datos
interface ChartData {
  x: Date | string;
  y: number;
}

interface ChartState {
  series: {
    name: string;
    data: ChartData[];
  }[];
  options: ApexOptions;
}

// Ejemplo de datos - reemplaza con tus fechas reales
const sampleDates: ChartData[] = [
  { x: '2023-01-01', y: 2300000 },
  { x: '2023-01-02', y: 2100000 },
  { x: '2023-01-03', y: 1800000 },
  { x: '2023-01-04', y: 1900000 },
  { x: '2023-01-05', y: 2050000 },
];

const TempSeriesChartTwo: React.FC = () => {
  const [state] = React.useState<ChartState>({
    series: [{
      name: 'XYZ MOTORS',
      data: sampleDates // Usa tus datos reales aquí
    }],
    options: {
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
      title: {
        text: 'Stock Price Movement',
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: 'bold'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          formatter: function(val: number) {
            return (val / 1000000).toFixed(0) + 'M';
          },
        },
        title: {
          text: 'Price (in millions)',
          style: {
            fontSize: '12px'
          }
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM \'yy',
            day: 'dd MMM',
            hour: 'HH:mm'
          }
        }
      },
      tooltip: {
        shared: false,
        x: {
          format: 'dd MMM yyyy'
        },
        y: {
          formatter: function(val: number) {
            return '$' + (val / 1000000).toFixed(2) + 'M';
          }
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 3
      }
    }
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div id="chart">
        <ReactApexChart 
          options={state.options} 
          series={state.series} 
          type="area" 
          height={350} 
        />
      </div>
    </div>
  );
};

export default TempSeriesChartTwo;
