import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

export const Detalle = ({
  apiBaseUrl,                     // URL base, por ejemplo: https://.../api/hemerografia
  campoImagenes = "imagenes_fb", // Campo que contiene el arreglo de imágenes
  campoPDFs = "pdfs",            // Campo que contiene los PDFs (si existen)
  camposFicha = [],              // Campos que se mostrarán como ficha catalográfica
  camposNavegacion = [],         // Ej: ["pais", "institucion", "tema"]
  tituloCampo = "tema",          // Campo a mostrar como título principal
  campoInfo = "hemero" // Campo adicional para información extra
}) => {
  const { id } = useParams();
  const [registro, setRegistro] = useState(null);
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetalle = async () => {
      const url = `${apiBaseUrl}/${id}`;
      const res = await fetch(url);
      const datos = await res.json();

      if (datos.status === "success") {
        const info = datos[campoInfo];
        setRegistro(info);

        const imagenes = info?.[campoImagenes];
        if (imagenes && imagenes.length > 0) {
          setImagenPrincipal(imagenes[0].url);
        }
        if (imagenes && imagenes.length > 0) {
          setImagenPrincipal(imagenes[0].url);
        }
      } else {
        console.error("❌ Error al cargar detalle:", datos.message);
      }
    };

    fetchDetalle();
  }, [id]);

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const renderField = (label, value) =>
    value ? (
      <p>
        <span>{label}:</span> <span>{value}</span>
      </p>
    ) : null;

  const formatFechaPublicacion = (fecha) => {
    if (!fecha) return '';
    const fechaModificada = addDays(new Date(fecha), 1);
    return format(fechaModificada, "EEEE, dd MMMM yyyy", { locale: es });
  };

  const handleImagenClick = (url) => setImagenPrincipal(url);

  const getNavigationPath = () => {
    if (!registro) return null;

    return (
      <>
        {camposNavegacion.map((campo, i) => {
          const valor = registro[campo];
          if (!valor) return null;

          let ruta = `/`;
          if (campo === "pais") ruta += `pais/${valor}`;
          else if (campo === "institucion") ruta += `admin/instituciones/${valor}`;
          else if (campo === "tema") ruta += `tema/${valor}`;
          else ruta += valor;

          return (
            <span key={i} onClick={() => navigate(ruta)}>
              {valor}
              {i < camposNavegacion.length - 1 && ' / '}
            </span>
          );
        })}
      </>
    );
  };

  if (!registro) return <div>Loading...</div>;

  return (
    <main className='main_fotodetalle'>
      <div id='nav3'>
        <p>{getNavigationPath()}</p>
      </div>
      <div className="container_fotodetalle">
        <button onClick={() => navigate(-1)}>Regresar</button>

        <div className='barra_fotodetalle'>
          <h2>{registro[tituloCampo]}</h2>
        </div>

        <div className='ficha_fotografia'>
          <div className='marco_hemerografia'>
            <img
              src={imagenPrincipal}
              alt={`${registro.titulo || 'imagen principal'}`}
              className='fotografia-img-large'
            />
            <div className='thumbnails'>
              {registro[campoImagenes]?.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`Miniatura ${i + 1}`}
                  className='fotografia-img-thumbnail'
                  onClick={() => handleImagenClick(img.url)}
                />
              ))}
            </div>
          </div>

          <div className='contenido_hemerografiaDetalle'>
            <h3>{capitalizeFirstLetter(registro.tipo_bien)}</h3>
            <h4>Ficha catalográfica</h4>
            {camposFicha.map((campo, i) => {
              const { etiqueta, valor } = campo;
              const contenido = valor === "fecha_publicacion"
                ? formatFechaPublicacion(registro[valor])
                : registro[valor];
              return renderField(etiqueta, contenido);
            })}
          </div>
        </div>

        {registro[campoPDFs]?.length > 0 && (
          <div className='pdfs-section'>
            <h4>Archivos PDF disponibles:</h4>
            <ul>
              {registro[campoPDFs].map((pdf, index) => (
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
