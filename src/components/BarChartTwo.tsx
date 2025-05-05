import React from 'react'; // React ahora está siendo utilizado
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

const BarChartTwo: React.FC = () => {
  const colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#00D9E9', '#FF66C3', '#546E7A'];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { 
        show: false 
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        distributed: true,
        borderRadius: 4,
      },
    },
    colors: colors,
    series: [{
      name: 'Valores',
      data: [21, 22, 10, 28, 16, 21, 13, 30]
    }],
    xaxis: {
      categories: [
        ['Alejo', 'Ocampo'],
        ['Carlos', 'Lema'],
        ['Juan', 'Duran'],
        'Amber',
        ['Peter', 'Brown'],
        ['Marisol', 'Herrera'],
        ['Sebastian', 'Garcia'],
        ['Lily', 'Roberts'],
      ],
      labels: {
        style: {
          colors: colors,
          fontSize: '12px',
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      title: {
        text: 'Valores',
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} unidades`,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div id="chart">
        <ReactApexChart 
          options={options} 
          series={options.series} 
          type="bar" 
          height={350} 
        />
      </div>
    </div>
  );
};

export default BarChartTwo;