import React from 'react';

const HomePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">¡Bienvenido al Dashboard!</h1>
      <p className="mb-2">Este es el contenido de la página de inicio de tu dashboard.</p>
      <p className="mb-2">Puedes personalizar esta sección con información relevante, widgets o un resumen de tus datos.</p>
      <div className="bg-white rounded-md shadow-md p-4">
        <h2 className="text-lg font-semibold mb-2">Información Destacada</h2>
        <ul>
          <li>Métrica importante 1: [Valor]</li>
          <li>Métrica importante 2: [Valor]</li>
          <li>Última actividad: [Fecha y hora]</li>
        </ul>
      </div>
      {/* Puedes agregar más contenido, gráficos, o componentes aquí */}
    </div>
  );
};

export default HomePage;