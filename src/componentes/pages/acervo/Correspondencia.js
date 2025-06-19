import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Correspondencia = () => {
  const [temas, setTemas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTemas();
  }, []);

  const getTemas = async () => {
    const url = "https://backend-prueba-apel.onrender.com/api/correspondencia/listar-temas";
    const peticion = await fetch(url, {
      method: "GET"
    });

    let datos = await peticion.json();
    if (datos.status === "success") {
      setTemas(datos.temas);
    } else {
      // Manejo de error
      console.error('Error fetching themes:', datos.message);
    }
  };

  const handleTemaClick = (tema) => {
    navigate(`/admin/correspondencia/tema/${tema}`);
  };

  return (
    <main className='main_temas_fotografia'>
      <div className='temas_contenedor_items'>
        <h1>Temas Correspondencia</h1>
        <div className=''>
          {temas.map((tema, index) => (
            <div
              key={index}
              className='temas_contenedor'
              onClick={() => handleTemaClick(tema.tema)}
            >
              <article>
                <img
                  id='img_temas'
                  src={`https://backend-prueba-apel.onrender.com/imagenes/correspondencia/${tema.nombreImagen}`}
                  alt={`${tema.tema} foto`}
                />
                <div className="contenido_temas">
                  <h3>{tema.tema}</h3>
                  <p id='p_temas'>Número de bienes registrados {tema.numeroDeFotos} </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
