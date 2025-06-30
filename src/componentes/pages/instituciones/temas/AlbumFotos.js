import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const AlbumFotos = () => {
  const [fotos, setFotos] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getFotos();
  }, [id]);

  const getFotos = async () => {
    const url = `https://backend-prueba-apel.onrender.com/api/fotografia/album/${id}`;
    const peticion = await fetch(url, {
      method: "GET"
    });
    let datos = await peticion.json();
    if (datos.status === "success") {
      setFotos(datos.fotos);
    } else {
      // Manejo de error
      console.error('Error fetching photos:', datos.message);
    }
  };

  const handleFotoClick = (fotografia) => {
    navigate(`/admin/fotografias/${fotografia._id}`);
  };

  const handleDeleteClick = async (event, fotografiaId) => {
    event.stopPropagation();
    const url = `https://backend-prueba-apel.onrender.com/api/fotografia/${fotografiaId}`;
    const peticion = await fetch(url, {
      method: "DELETE"
    });

    let datos = await peticion.json();
    if (datos.status === "success") {
      // Refrescar la lista de fotos después de eliminar
      getFotos();
    } else {
      // Manejo de error
      console.error('Error deleting photo:', datos.message);
    }
  };

  const handleEditClick = (event, fotografiaId) => {
    event.stopPropagation();
    navigate(`/admin/editar/fotografia/${fotografiaId}`);
  };

  return (
    
      <main className='main_album'>
        <div className='container_fotografia'>
          <h1>Fotografías</h1>

          <div className='fotografias-container'>
            {fotos.map((fotografia) => {
              const imageUrl = `https://backend-prueba-apel.onrender.com/imagenes/fotografias/${fotografia.image}`;
              return (
                <div
                  key={fotografia._id}
                  className='fotografia-item'
                  onClick={() => handleFotoClick(fotografia)}
                >
                  <img src={imageUrl} className='fotografia-img'  />
                  
                  <p className='numero_foto'>{fotografia.numero_foto}</p>
                  <button onClick={(event) => handleEditClick(event, fotografia._id)}>Editar</button>
                  <button onClick={(event) => handleDeleteClick(event, fotografia._id)}>Borrar</button>
                  
                </div>
              );
            })}
          </div>
        </div>
      </main>
 
  );
};
