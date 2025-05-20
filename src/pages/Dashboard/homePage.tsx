import "../../assets/styles/homePage_style.css";
import CircularChartOne from "../../components/CircularChartOne";
import CircularChartTwo from "../../components/CircularChartTwo";
import CircularChartThree from "../../components/CircularChartThree";
import BarChartOne from "../../components/BarChartOne";
import BarChartTwo from "../../components/BarChartTwo";
import BarChartThree from "../../components/BarChartThree";
import TempSeriesChartOne from "../../components/TempSeriesChartOne";
import TempSeriesChartTwo from "../../components/TempSeriesChartTwo";
import TempSeriesChartThree from "../../components/TempSeriesChartThree";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Panel de Control Devlibery</h1>
      <p className="mb-4 text-gray-700">
        Bienvenido a Devlibery, tu plataforma web para la gestión eficiente de
        domicilios en moto. Supervisa pedidos, analiza el rendimiento de tus
        repartidores y restaurantes, y mantén el control total de tu operación de
        entregas en tiempo real.
      </p>
      <div className="bg-white rounded-md shadow-md p-4 mb-6">
        <h2 className="historial-title mb-2">Resumen ejecutivo</h2>
        <ul className="text-gray-600 text-sm">
          <li>
            Pedidos activos, ventas recientes y desempeño de restaurantes en tiempo
            real.
          </li>
          <li>
            Monitorea la satisfacción de tus clientes y el rendimiento de tus
            repartidores.
          </li>
        </ul>
      </div>
      <div className="graphs-container">
        <div className="circular-graphs-container">
          <div className="graph-container">
            <h2 className="graph-title">Pedidos por restaurante</h2>
            <CircularChartOne />
          </div>
          <div className="graph-container">
            <h2 className="graph-title">Ventas totales</h2>
            <CircularChartTwo />
          </div>
          <div className="graph-container">
            <h2 className="graph-title">Productos destacados</h2>
            <CircularChartThree />
          </div>
        </div>
        <div className="bar-graphs-container">
          <div>
            <h2 className="graph-title">Pedidos entregados por día</h2>
            <BarChartOne />
          </div>
          <div>
            <h2 className="graph-title">Accidentes por mes</h2>
            <BarChartTwo />
          </div>
          <div>
            <h2 className="graph-title">Cancelaciones por semana</h2>
            <BarChartThree />
          </div>
        </div>
      </div>
      <div className="temp-series-graphs-container">
        <div>
          <h2 className="graph-title">Satisfacción de clientes</h2>
          <TempSeriesChartOne />
        </div>
        <div>
          <h2 className="graph-title">Accidentalidad mensual</h2>
          <TempSeriesChartTwo />
        </div>
        <div>
          <h2 className="graph-title">Restaurantes por mes</h2>
          <TempSeriesChartThree />
        </div>
      </div>
    </div>
  );
};

export default HomePage;