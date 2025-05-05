import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartState {
    series: number[];
    options: any;
}

const CircularChartOne: React.FC = () => {
    const [state] = React.useState<ChartState>({
        series: [36, 55, 18, 27, 20],
        options: {
            chart: {
                width: 380,
                type: 'donut',
            },
            plotOptions: {
                pie: {
                    startAngle: -90,
                    endAngle: 270
                }
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                type: 'gradient',
            },
            legend: {
                formatter: function (val: string, opts: any) {
                    return val + " - " + opts.w.globals.series[opts.seriesIndex];
                }
            },
            title: {
                text: 'Gradient Donut with custom Start-angle'
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },
    });

    return (
        <div id="chart">
            <ReactApexChart
                options={state.options}
                series={state.series}
                type="donut"
                width={380}
            />
        </div>
    );
};

export default CircularChartOne;