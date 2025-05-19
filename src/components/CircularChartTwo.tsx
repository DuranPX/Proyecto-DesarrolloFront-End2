import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const CircularChartTwo = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://d7ae0275-a0cd-4f27-8cb5-5e6305717ea0.mock.pstmn.io/chart-data/2');
        
        // Convertir el string de formatter a función real
        const processedOptions = {
          ...response.data.options,
          legend: {
            ...response.data.options.legend,
            formatter: function(val: string, opts: any) {
              return `${val} - ${opts.w.globals.series[opts.seriesIndex]}`;
            }
          }
        };

        setChartData({
          series: response.data.series,
          options: processedOptions
        });

      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) return <div>Cargando gráfica...</div>;

  return (
    <div id="chart">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="donut"
        width={380}
      />
    </div>
  );
};

export default CircularChartTwo;