

import './App.css';
import { Rutas } from './routes/Rutas';
import { Routing } from './routes/Routing';
import { Routes } from 'react-router-dom';
import { Header } from './componentes/layout/Header';

function App() {
  return (
    <>
      <div className="App">

        <Rutas/>

      </div>
    </>
  );
}

export default App;
