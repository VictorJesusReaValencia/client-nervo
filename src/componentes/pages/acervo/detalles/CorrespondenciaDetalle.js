import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const CorrespondenciaDetalle = () => {
  const { id } = useParams();
  const [fotografia, setFotografia] = useState(null);
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoto = async () => {
      const url = `https://backend-prueba-apel.onrender.com/api/correspondencia/icon/${id}`;
      const peticion = await fetch(url, {
        method: "GET"
      });

      let datos = await peticion.json();
      if (datos.status === "success") {
        setFotografia(datos.Corresp);
        if (datos.Corresp.images && datos.Corresp.images.length > 0) {
          setImagenPrincipal(datos.Corresp.images[0].nombre); // Establecer la primera imagen como principal
        }
      } else {
        // Manejo de error
      }
    };

    fetchFoto();
  }, [id]);

  if (!fotografia) {
    return <div>Loading...</div>;
  }

  const getNavigationPath = () => {
    const { pais, institucion, tema } = fotografia;
    return (
      <>
        {pais && <span onClick={() => navigate(`/pais/${pais}`)}>{pais}</span>} /
        {institucion && <span onClick={() => navigate(`/admin/instituciones/${institucion}`)}>{institucion}</span>} /
        <span onClick={() => navigate(`/admin/fotografias`)}>Fotografías</span> /
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

  const handleImagenClick = (nombreImagen) => {
    setImagenPrincipal(nombreImagen);
  };

  return (
    <main className='main_fotodetalle'>
      <div id='nav3'>
        <p>{getNavigationPath()}</p>
      </div>
      <div className="container_fotodetalle">
        <button onClick={() => navigate(-1)}>Regresar</button>

        <div className='barra_fotodetalle'>
          <h2>{fotografia.tema}</h2>
        </div>
        <div className='ficha_fotografia'>
          <div className='marco'>
            <img
              src={`https://backend-prueba-apel.onrender.com/imagenes/correspondencia/${imagenPrincipal}`}
              alt={`${fotografia.titulo} principal`}
              className='fotografia-img-large'
            />
            <div className='thumbnails'>
              {fotografia.images && fotografia.images.map((image, index) => (
                <img
                  key={index}
                  src={`https://backend-prueba-apel.onrender.com/imagenes/correspondencia/${image.nombre}`}
                  alt={`${fotografia.titulo} ${index + 1}`}
                  className='fotografia-img-thumbnail'
                  onClick={() => handleImagenClick(image.nombre)}
                />
              ))}
            </div>
          </div>
          <div className='contenido_fotodetalle'>
            <h3>{capitalizeFirstLetter(fotografia.tipo_bien)}</h3>
            {renderField("Título", fotografia.encabezado)}
            {renderField("Autor", fotografia.autor)}
            {renderField("Fecha", fotografia.fecha_publicacion)}
            {renderField("Colección", fotografia.coleccion)}
            {renderField("Numero Edicion", fotografia.numero_edicion)}
            {renderField("Número de Foto", fotografia.numero_foto)}
            {renderField("Descripción", fotografia.descripcion)}
            {renderField("Ubicación del bien", fotografia.institucion)}
          </div>
        </div>
      </div>
    </main>
  );
};
