import Breadcrumb from "../components/Breadcrumb";
import CircularChartOne from "../components/CircularChartOne";
import CircularChartTwo from "../components/CircularChartOne";
import CircularChartThree from "../components/CircularChartThree.tsx";
import BarChartOne from "../components/BarChartOne.tsx";
import BarChartTwo from "../components/BarChartTwo.tsx";
import BarChartThree from "../components/BarChartThree.tsx";
import TempSeriesChartOne from "../components/TempSeriesChartOne";
import TempSeriesChartTwo from "../components/TempSeriesChartTwo";
import TempSeriesChartThree from "../components/TempSeriesChartThree";

const Chart = () => {
  return (
    <div className="p-6">
      <Breadcrumb pageName="Charts" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CircularChartOne />
        <CircularChartTwo />
        <CircularChartThree />
        <BarChartOne />
        <BarChartTwo />
        <BarChartThree />
        <TempSeriesChartOne />
        <TempSeriesChartTwo />
        <TempSeriesChartThree />
      </div>
    </div>
  );
};

export default Chart;