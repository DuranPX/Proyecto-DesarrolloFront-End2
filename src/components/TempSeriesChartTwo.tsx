import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

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

const TempSeriesChartTwo: React.FC = () => {
  const [state, setState] = useState<ChartState>({
    series: [],
    options: {}
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('https://d7ae0275-a0cd-4f27-8cb5-5e6305717ea0.mock.pstmn.io/chart-data/8');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Convertir las funciones de string a funciones reales
        if (data.chartData.options.yaxis?.labels?.formatter) {
          data.chartData.options.yaxis.labels.formatter = new Function(
            'val', 
            data.chartData.options.yaxis.labels.formatter.replace('function(val) ', '')
          );
        }
        
        if (data.chartData.options.tooltip?.y?.formatter) {
          data.chartData.options.tooltip.y.formatter = new Function(
            'val', 
            data.chartData.options.tooltip.y.formatter.replace('function(val) ', '')
          );
        }

        setState(data.chartData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) return <div>Loading chart data...</div>;
  if (error) return <div>Error: {error}</div>;

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