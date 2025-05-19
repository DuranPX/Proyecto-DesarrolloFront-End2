import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const BarChartTwo: React.FC = () => {
  const [chartConfig, setChartConfig] = useState<any>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get('https://d7ae0275-a0cd-4f27-8cb5-5e6305717ea0.mock.pstmn.io/chart-data/5');
        
        // Convertir el string de formatter a función real
        const processedData = {
          ...response.data,
          tooltip: {
            ...response.data.tooltip,
            y: {
              formatter: (val: number) => `${val} unidades`
            }
          }
        };

        setChartConfig(processedData);
      } catch (error) {
        console.error('Error al cargar datos del servidor:', error);
      }
    };

    fetchChartData();
  }, []);

  if (!chartConfig) {
    return <div className="bg-white p-4 rounded-lg shadow">Cargando gráfica...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <ReactApexChart
        options={chartConfig}
        series={chartConfig.series}
        type="bar"
        height={chartConfig.chart.height}
      />
    </div>
  );
};

export default BarChartTwo;