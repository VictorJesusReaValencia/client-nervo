import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const DocumentacionDetalle = () => {
  const { id } = useParams();
  const [fotografia, setFotografia] = useState(null);
  const [pdfNombre, setPdfNombre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoto = async () => {
      const url = `https://backend-prueba-apel.onrender.com/api/documentacion/docu/${id}`;
      const peticion = await fetch(url, {
        method: "GET"
      });

      let datos = await peticion.json();
      if (datos.status === "success") {
        setFotografia(datos.docu);
        if (datos.docu.pdf && datos.docu.pdf.length > 0) {
          setPdfNombre(datos.docu.pdf[0].nombre);
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
        <span onClick={() => navigate(`/admin/fotografias`)}>Fotografias</span> /
        {tema && <span onClick={() => navigate(`/tema/${tema}`)}>{tema}</span>}
      </>
    );
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderField = (label, value) => {
    return value ? <p><span>{label}:</span> <span>{value}</span></p> : null;
  }

  const formatFechaEmision = (fecha) => {
    if (!fecha) return '';
    return format(new Date(fecha), "EEEE, dd MMMM yyyy", { locale: es });
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
          <div className='marco'>
            {console.log(fotografia)} {/* Verifica la estructura de fotografia.images */}
            {fotografia.images && fotografia.images.map((image, index) => (
              <img
                key={index}
                src={`https://backend-prueba-apel.onrender.com/imagenes/documentacion/${image.nombre}`}
                alt={`${fotografia.titulo} ${index + 1}`}
                className='fotografia-img-large'
              />
            ))}
          </div>
          <div className='contenido_fotodetalle'>
            <h3>{capitalizeFirstLetter(fotografia.tipo_bien)}</h3>
            {renderField("Título", fotografia.titulo)}
            {renderField("Institución emisora", fotografia.emisor)}
            {renderField("Fecha de emisión", formatFechaEmision(fotografia.fecha_emision))}
            {renderField("Lugar de emisión", fotografia.lugar_emision)}
            {renderField("Destinatario", fotografia.destinatario)}
            {renderField("Número de expediente/carpeta", fotografia.numero_expediente)}
            {renderField("Contenido del documento", fotografia.contenido)}
            {renderField("Notas", fotografia.notas)}
          </div>
          <div className='marco'>
            {pdfNombre && (
              <div className='pdf-viewer'>
                <embed 
                  src={`https://backend-prueba-apel.onrender.com/imagenes/documentacion/pdf/${pdfNombre}`} 
                  width="100%" 
                  height="600px" 
                  type="application/pdf" 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
