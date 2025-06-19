import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const PartiturasInstitucionTema = () => {
  const [fotos, setFotos] = useState([]);
  const [nombrePeriodico, setNombrePeriodico] = useState('');
  const { institucionId, tema } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getFotos();
  }, [institucionId, tema]);

  const getFotos = async () => {
    const url = `https://backend-prueba-apel.onrender.com/api/partituras/${institucionId}/${tema}`;
    const peticion = await fetch(url, {
      method: "GET"
    });
    let datos = await peticion.json();
    if (datos.status === "success") {
      setFotos(datos.fotos);
      if (datos.fotos.length > 0) {
        setNombrePeriodico(datos.fotos[0].nombre_periodico);
      }
    } else {
      // Manejo de error
      console.error('Error fetching photos:', datos.message);
    }
  };

  const handleFotoClick = (fotografia) => {
    navigate(`/admin/partituras/${fotografia._id}`);
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
    navigate(`/admin/editar/partituras/${fotografiaId}`);
  };

  return (
    <main className='main_album'>
      <div className='container_fotografia'>
        <h1>{nombrePeriodico}</h1>
        <div className='fotografias-container'>
          {fotos.map((fotografia) => {
            const firstImage = fotografia.images && fotografia.images.length > 0 ? fotografia.images[0].nombre : null;
            const imageUrl = firstImage ? `https://backend-prueba-apel.onrender.com/imagenes/partituras/${firstImage}` : '';

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
