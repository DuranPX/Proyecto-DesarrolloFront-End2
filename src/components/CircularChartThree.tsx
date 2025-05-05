import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartState {
    series: number[];
    options: any;
}

const CircularChartThree: React.FC = () => {
    const [state] = React.useState<ChartState>({
        series: [42, 74, 15, 28, 31],
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

export default CircularChartThree;