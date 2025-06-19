import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';

export const Instituciones = () => {
  const [ciudades, setCiudades] = useState({});
  const navigate = useNavigate();

  const handleButtonClick = async (pais) => {
    try {
      const response = await fetch(`https://backend-prueba-apel.onrender.com/api/instituciones/pais/${pais}`);
      const data = await response.json();
      const instituciones = data.insti;
      //console.log('Instituciones:', instituciones);

      const ciudadesAgrupadas = instituciones.reduce((acc, institucion) => {
        const { ciudad } = institucion;
        if (!acc[ciudad]) {
          acc[ciudad] = [];
        }
        acc[ciudad].push(institucion);
        return acc;
      }, {});

      setCiudades(ciudadesAgrupadas);
      console.log('Ciudades agrupadas:', ciudadesAgrupadas);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    }
  };

  const handleImageClick = (id) => {
    navigate(`/admin/instituciones/${id}`);
  };

  const handleEditClick = (event, fotografiaId) => {
    event.stopPropagation();
    navigate(`/admin/editar/institucion/${fotografiaId}`);
  };
  const paises = [
    'Argentina', 'Canadá', 'Cuba', 'España', 'Estados Unidos',
    'Francia', 'Inglaterra', 'México', 'Portugal', 'Uruguay', 'Venezuela'
  ];

  return (
    <main id='main2'>
      <div className="contenedor_instituciones">
        <h1>Instituciones</h1>
        <div className='frame_botones_registro'>
          {paises.map(pais => (
            <button key={pais} onClick={() => handleButtonClick(pais)}>
              {pais}
            </button>
          ))}
        </div>
        <div className='contenedor_ciudades'>
          {Object.keys(ciudades).map(ciudad => (
            <div key={ciudad} className='ciudad'>
              <h2>{ciudad}</h2>
              <ul>
                {ciudades[ciudad].map(institucion => (
                  <div key={institucion.id} className='institucion_contenedor' onClick={() => handleImageClick(institucion.nombre)} style={{ cursor: 'pointer' }}>
                    
                    {institucion.imagenes_fb && institucion.imagenes_fb.length > 0 && (
                      
                      <img
                        src={`${institucion.imagenes_fb[0].url}`}
                        alt={institucion.nombre}
                        
                        
                      />
                    
                    )}
                    <p>{institucion.nombre}</p>
                    <button onClick={(event) => handleEditClick(event, institucion.nombre)}>Editar</button>
                    <button onClick={(event) => handleEditClick(event, institucion.nombre)}>Borrar</button>
                  </div>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
