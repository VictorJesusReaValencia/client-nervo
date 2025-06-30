import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const Seccion = () => {
  const [fotos, setFotos] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombrePeriodico, setNombrePeriodico] = useState('');

  useEffect(() => {
    getFotos();
  }, [id]);

  const getFotos = async () => {
    const url = `https://backend-prueba-apel.onrender.com/api/hemerografia/listar/seccion/${id}`;
    const peticion = await fetch(url, {
      method: "GET"
    });
    let datos = await peticion.json();
    if (datos.status === "success") {
      setFotos(datos.bienes);
    } else {
      // Manejo de error
      console.error('Error fetching photos:', datos.message);
    }
  };

  const handleFotoClick = (fotografia) => {
    navigate(`/admin/hemerografia/${fotografia._id}`);
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
    navigate(`/admin/editar/hemerografia/${fotografiaId}`);
  };

  return (
    <main className='main_album'>
      <div className='container_fotografia'>
        <h1>{id}</h1>
  
        <div className='fotografias-container'>
        {fotos.map((fotografia) => {
  // Verifica que el campo 'images' exista y tenga al menos una imagen
  const firstImage = fotografia.images && fotografia.images.length > 0 ? fotografia.images[0].nombre : null;
  const imageUrl = firstImage ? `https://backend-prueba-apel.onrender.com/imagenes/hemerografia/${firstImage}` : '';

  return (
    <div
      key={fotografia._id}
      className='hemerografia-item'
      onClick={() => handleFotoClick(fotografia)}
    >
      {firstImage ? (
        <img src={imageUrl} className='fotografia-img' alt={`Foto ${fotografia.numero_registro}`} />
      ) : (
        <p>No hay imagen disponible</p>
      )}
      <p className='numero_foto'>{fotografia.numero_registro}</p>

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
