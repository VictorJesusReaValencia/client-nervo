import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const PeriodicoDetalle = () => {
  const { id } = useParams();
  const [fotografia, setFotografia] = useState(null);
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoto = async () => {
      const url = `https://backend-prueba-apel.onrender.com/api/periodicos/periodico/${id}`;
      const peticion = await fetch(url, {
        method: "GET"
      });

      let datos = await peticion.json();
      if (datos.status === "success") {
        setFotografia(datos.hemero);
        if (datos.hemero.images && datos.hemero.images.length > 0) {
          setImagenPrincipal(datos.hemero.images[0].nombre); // Establecer la primera imagen como principal
        }
      } else {
        // Manejo de error
      }
    };

    fetchFoto();
  }, [id]);

  if (!fotografia) {
    return <div>Valeria dice que no hay registro</div>;
  }

  const getNavigationPath = () => {
    const { pais, institucion, tema } = fotografia;
    return (
      <>
        {pais && <span onClick={() => navigate(`/pais/${pais}`)}>{pais}</span>} /
        {institucion && <span onClick={() => navigate(`/admin/instituciones/${institucion}`)}>{institucion}</span>} /
        <span onClick={() => navigate(`/admin/fotografias`)}>{fotografia.tipo_bien}</span> /
        {tema && <span onClick={() => navigate(`/tema/${tema}`)}>{tema}</span>}
      </>
    );
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderField = (label, value) => {
    return value ? <p><span>{label}:</span> <span>{value}</span></p> : null;
  };

  const formatFechaPublicacion = (fecha) => {
    if (!fecha) return '';
    return format(new Date(fecha), "EEEE, dd MMMM yyyy", { locale: es });
  };
  const handleEditClick = (event, fotografiaId) => {
    event.stopPropagation();
    navigate(`/admin/editar/periodicos/${fotografiaId}`);
  };
  const handleImagenClick = (nombreImagen) => {
    setImagenPrincipal(nombreImagen);
  };

  return (
    <main>
    
     
 
       
        <div className='ficha_periodico'>
          <div className='marco_periodico'>
            <img
              src={`https://backend-prueba-apel.onrender.com/imagenes/general/Temas/hemerografia/${fotografia.nombre_periodico}.jpg`}
              alt={`${fotografia.titulo} principal`}
              className='fotografia-img-large'
            />
            <div className='thumbnails'>
              {fotografia.images && fotografia.images.map((image, index) => (
                <img
                  key={index}
                  src={`https://backend-prueba-apel.onrender.com/imagenes/periodicos/${image.nombre}`}
                  alt={`${fotografia.titulo} ${index + 1}`}
                  className='fotografia-img-thumbnail'
                  onClick={() => handleImagenClick(image.nombre)}
                />
              ))}
            </div>
          </div>
          <div className='contenido_hemerografiaDetalle'>
            <h3>{capitalizeFirstLetter(fotografia.tipo_bien)}</h3>
            <h4>Ficha catalográfica</h4>

            {renderField("Periódico", fotografia.nombre_periodico)}
            {renderField("País", fotografia.pais)}
            {renderField("Ciudad", fotografia.ciudad)}
            <button onClick={(event) => handleEditClick(event, fotografia._id)}>Editar</button>
          </div>
        </div>
    
    </main>
  );
};
