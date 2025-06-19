import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Cortejo = () => {
  const [albumes, setAlbumes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAlbumes();
  }, []);

  const getAlbumes = async () => {
    const url = "https://backend-prueba-apel.onrender.com/api/fotografia/listar-albumes";
    const peticion = await fetch(url, {
      method: "GET"
    });

    let datos = await peticion.json();
    if (datos.status === "success") {
      setAlbumes(datos.albumes);
    } else {
      // Manejo de error
      console.error('Error fetching albums:', datos.message);
    }
  };

  const handleAlbumClick = (album) => {
    navigate(`/admin/album/${album}`);
  };

  return (
    <div>
      <main id='main2'>
        <div className='container_fotografia'>
          <h1>Álbumes</h1>
          
          <div className='albumes-container'>
            {albumes.map((album, index) => {
              return (
                <div
                  key={index}
                  className='albumes_item'
                  onClick={() => handleAlbumClick(album.album)}
                >
                  
                  {album.fotoAleatoria && (
                    <img 
                      src={`https://backend-prueba-apel.onrender.com/imagenes/fotografias/${album.fotoAleatoria}`}
                      alt={`Foto aleatoria del álbum ${album.album}`} 
                      
                    />
                  )}
                  <h3>{album.album}</h3>
                  <p>Número de bienes registrados:<br/>{album.numeroDeFotos} </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
