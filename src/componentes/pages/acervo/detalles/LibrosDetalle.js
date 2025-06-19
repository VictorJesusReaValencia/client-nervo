import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const LibrosDetalle = () => {
  const { id } = useParams();
  const [fotografia, setFotografia] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoto = async () => {
      const url = `https://backend-prueba-apel.onrender.com/api/libros/libro/${id}`;
      const peticion = await fetch(url, {
        method: "GET"
      });

      let datos = await peticion.json();
      if (datos.status === "success") {
        setFotografia(datos.libro);
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
        <span onClick={() => navigate(`/admin/fotografias`)}>Fotografias</span> /
        {tema && <span onClick={() => navigate(`/tema/${tema}`)}>{tema}</span>}
      </>
    );
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderField = (label, value) => {
    return value ? <p><span id='spanAzul'>{label}:</span> <span>{value}</span></p> : null;
  }

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
          <div className='marco_libros'>
            {console.log(fotografia)} {/* Verifica la estructura de fotografia.images */}
            {fotografia.images && fotografia.images.map((image, index) => (
              <img
                key={index}
                src={`https://backend-prueba-apel.onrender.com/imagenes/libros/${image.nombre}`}
                alt={`${fotografia.titulo} ${index + 1}`}
                className='fotografia-img-large'
              />
            ))}
          </div>
          <div className='contenido_librosDetalle'>
            <h3>{capitalizeFirstLetter(fotografia.tipo_bien)}</h3>
            <h4>Ficha catalográfica</h4>
            {renderField("Título", fotografia.titulo)}
            {renderField("Autor", fotografia.autor)}
            {renderField("Prólogo", fotografia.prologo)}
            {renderField("Compilador (es)", fotografia.compiladores)}
            {renderField("Editorial", fotografia.editorial)}
            {renderField("Año de publicación", fotografia.fecha_publicacion)}
            {renderField("Lugar de edición", fotografia.lugar_edicion)}
            {renderField("Año de reimpresión", fotografia.fehca_reimpresion)}
            {renderField("Volumen", fotografia.volumen)}
            {renderField("Número de páginas", fotografia.numero_paginas)}
            {renderField("ISBN", fotografia.isbn)}
            {renderField("Colección/Serie", fotografia.coleccion_serie)}
          </div>
        </div>
      </div>
    </main>
  );
};
