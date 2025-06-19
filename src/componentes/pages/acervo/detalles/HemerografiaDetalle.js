import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

export const HemerografiaDetalle = () => {
  const { id } = useParams();
  const [fotografia, setFotografia] = useState(null);
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoto = async () => {
      const url = `https://backend-prueba-apel.onrender.com/api/hemerografia/hemero/${id}`;
      const peticion = await fetch(url, {
        method: "GET"
      });

      let datos = await peticion.json();
      if (datos.status === "success") {
        setFotografia(datos.hemero);
        if (datos.hemero.images && datos.hemero.images.length > 0) {
          setImagenPrincipal(datos.hemero.imagenes_fb[0].url); // Establecer la primera imagen como principal
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
    const fechaModificada = addDays(new Date(fecha), 1); // Suma un día a la fecha
    return format(fechaModificada, "EEEE, dd MMMM yyyy", { locale: es });
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
          <div className='marco_hemerografia'>
            <img
              src={`${imagenPrincipal}`}
              alt={`${fotografia.titulo} principal`}
              className='fotografia-img-large'
            />
            <div className='thumbnails'>
              {fotografia.imagenes_fb && fotografia.imagenes_fb.map((image, index) => (
                <img
                  key={index}
                  src={`${image.url}`}
                  alt={`${fotografia.titulo} ${index + 1}`}
                  className='fotografia-img-thumbnail'
                  onClick={() => handleImagenClick(image.url)}
                />
              ))}
            </div>
          </div>
          <div className='contenido_hemerografiaDetalle'>
            <h3>{capitalizeFirstLetter(fotografia.tipo_bien)}</h3>
            <h4>Ficha catalográfica</h4>
            {renderField("Título", fotografia.encabezado)}
            {renderField("Periódico", fotografia.nombre_periodico)}
            {renderField("Número de edición", fotografia.numero_edicion)}
            {renderField("Fecha de publicación", formatFechaPublicacion(fotografia.fecha_publicacion))}
            {renderField("Autor", fotografia.autor)}
            {renderField("Seudónimo", fotografia.seudonimo)}
            {renderField("Páginas", fotografia.numero_paginas)}
            {renderField("Columnas", fotografia.columnas)}
            {renderField("Género periodístico", fotografia.genero_periodistico)}
            {renderField("Lugar de publicación", fotografia.lugar_publicacion)}
            {renderField("Periodicidad", fotografia.periodicidad)}
          </div>
        </div>
        {fotografia.pdfs && fotografia.pdfs.length > 0 && (
    <div className='pdfs-section'>
      <h4>Archivos PDF disponibles:</h4>
      <ul>
        {fotografia.pdfs.map((pdf, index) => (
          <li key={index}>
            <a href={pdf.ruta} target="_blank" rel="noopener noreferrer">
              {pdf.nombre || `PDF ${index + 1}`}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )}
      </div>
    </main>
  );
};
