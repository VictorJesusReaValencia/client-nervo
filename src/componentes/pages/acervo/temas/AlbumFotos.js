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

  const handleFotoClick = (fotos) => {
    navigate(`/admin/fotografias/${fotos._id}`);
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
        <h1>Álbum {id}</h1>
  
        <div className='fotografias-container'>
        {fotos.map((fotografia) => {
  // Verifica que el campo 'images' exista y tenga al menos una imagen
  const firstImage = fotografia.imagenes_fb && fotografia.imagenes_fb.length > 0 ? fotografia.imagenes_fb[0].url : null;
  const imageUrl = firstImage ? `${firstImage}` : '';

  return (
    <div
      key={fotos._id}
      className='fotografia-item'
      onClick={() => handleFotoClick(fotografia)}
    >
      {true ? (
        <img src={imageUrl} className='fotografia-img' alt={`Foto ${fotos.numero_registro}`} />
      ) : (
        <p>No hay imagen disponible</p>
      )}
      <p className='numero_foto'>{fotos.numero_registro}</p>

    <button onClick={(event) => handleEditClick(event, fotografia._id)}>Editar</button>
      <button onClick={(event) => handleDeleteClick(event, fotos._id)}>Borrar</button>

  
    </div>
  );
})}

        </div>
      </div>
    </main>
  );
 
        

};
