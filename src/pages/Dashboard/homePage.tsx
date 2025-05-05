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
      <h1 className="homepage-title">¡Bienvenido al Veneco Rappi!</h1>
      <p className="mb-2">Este es el contenido de la página de inicio de tu dashboard.</p>
      <p className="mb-2">Puedes personalizar esta sección con información relevante, widgets o un resumen de tus datos.</p>
      <div className="bg-white rounded-md shadow-md p-4">
        <h2 className="historial-title">Historial de pedidos</h2>
        <ul>
          <li>Métrica importante 1: [Valor]</li>
          <li>Métrica importante 2: [Valor]</li>
          <li>Última actividad: [Fecha y hora]</li>
        </ul>
      </div>
      <div className="graphs-container">
        <div className="circular-graphs-container">
          <div className="graph-container">
            <h2 className="graph-title">Gráfica de pedidos por restaurante</h2>
            <CircularChartOne />
          </div>
          <div className="graph-container">
            <h2 className="graph-title">Gráfica de ventas</h2>
            <CircularChartTwo />
          </div>
          <div className="graph-container">
            <h2 className="graph-title">Gráfica de productos</h2>
            <CircularChartThree />
          </div>
        </div>
        <div className="bar-graphs-container">
          <div>
            <h2 className="graph-title">Gráfica de pedidos entregados por dia</h2>
            <BarChartOne />
          </div>
          <div>
            <h2 className="graph-title">Gráfica de accidentes por mes</h2>
            <BarChartTwo />
          </div>
          <div>
            <h2 className="graph-title">Gráfica de cancelaciones por semana</h2>
            <BarChartThree />
          </div>
        </div>
      </div>
      <div className="temp-series-graphs-container">
        <div>
          <h2 className="graph-title">Gráfica de satisfacción de clientes</h2>
          <TempSeriesChartOne />
        </div>
        <div>
          <h2 className="graph-title">Gráfica de accidentalidad por mes</h2>
          <TempSeriesChartTwo />
        </div>
        <div>
          <h2 className="graph-title">Gráfica de cantidad de restaurantes por mes</h2>
          <TempSeriesChartThree />
        </div>
      </div>
      {/* Puedes agregar más contenido, gráficos, o componentes aquí */}
    </div>
  );
};

export default HomePage;