import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const BarChartThree: React.FC = () => {
  const [chartConfig, setChartConfig] = useState<any>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get('https://0ae556e6-5b9a-456f-b3b7-c93463cd36d1.mock.pstmn.io/chart-data/6');
        
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

export default BarChartThree;