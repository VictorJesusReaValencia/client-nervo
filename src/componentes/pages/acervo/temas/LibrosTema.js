import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const LibrosTema = () => {
  const [fotos, setFotos] = useState([]);
  const [nombrePeriodico, setNombrePeriodico] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getFotos();
  }, [id]);

  const getFotos = async () => {
    const url = `https://backend-prueba-apel.onrender.com/api/libros/tema/${id}`;
    const peticion = await fetch(url, {
      method: "GET"
    });
    let datos = await peticion.json();
    if (datos.status === "success") {
      setFotos(datos.fotos);
      if (datos.fotos.length > 0) {
        setNombrePeriodico(datos.fotos[0].tema);
      }
    } else {
      // Manejo de error
      console.error('Error fetching photos:', datos.message);
    }
  };

  const handleFotoClick = (fotografia) => {
    navigate(`/admin/libros/${fotografia._id}`);
  };

  const handleDeleteClick = async (event, fotografiaId) => {
    event.stopPropagation();
    const url = `https://backend-prueba-apel.onrender.com/api/libros/${fotografiaId}`;
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
    navigate(`/admin/editar/libros/${fotografiaId}`);
  };

  return (
    <main className='main_album'>
      <div className='container_fotografia'>
        <h3>{nombrePeriodico}</h3>
        <button onClick={getFotos}>Mostrar Fotografías</button>
        <div className='fotografias-container'>
        {fotos.map((fotografia) => {
  // Verifica que el campo 'images' exista y tenga al menos una imagen
  const firstImage = fotografia.imagenes_fb && fotografia.imagenes_fb.length > 0 ? fotografia.imagenes_fb[0].url : null;
  const imageUrl = firstImage ? `${firstImage}` : '';

  return (
    <div
      key={fotografia._id}
      className='libros-item'
      onClick={() => handleFotoClick(fotografia)}
    >
      {firstImage ? (
        <img src={imageUrl} className='fotografia-img' alt={`Foto ${fotografia.numero_foto}`} />
      ) : (
        <p>No hay imagen disponible</p>
      )}
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
