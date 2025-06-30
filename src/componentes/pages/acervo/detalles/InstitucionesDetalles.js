import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export const InstitucionesDetalle = () => {
  const { id } = useParams();
  const [fotografia, setFotografia] = useState(null);
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [fotografiaCount, setFotografiaCount] = useState(0);
  const [documentacionCount, setDocumentacionCount] = useState(0);
  const [correspondenciaCount, setCorrespondenciaCount] = useState(0);
  const [iconografiaCount, setIconografiaCount] = useState(0);
  const [librosCount, setLibrosCount] = useState(0);
  const [hemerografiaCount, setHemerografiaCount] = useState(0);
  const [partiturasCount, setPartiturasCount] = useState(0);
  const [objetosCount, setObjetosCount] = useState(0);
  const [monumentosCount, setMonumentosCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoto = async () => {
      const url = `https://backend-prueba-apel.onrender.com/api/instituciones/${id}`;
      const peticion = await fetch(url, {
        method: "GET"
      });

      let datos = await peticion.json();
      if (datos.status === "success") {
        setFotografia(datos.hemero);
        if (datos.hemero.images && datos.hemero.images.length > 0) {
          setImagenPrincipal(datos.hemero.images[0].nombre); // Establecer la primera imagen como principal
        }
        fetchCounts(datos.hemero.nombre);
      } else {
        // Manejo de error
      }
    };

    const fetchCounts = async (nombreInstitucion) => {
      try {
        const responses = await Promise.all([
          fetch(`https://backend-prueba-apel.onrender.com/api/fotografia/numero-institucion/${nombreInstitucion}`),
          fetch(`https://backend-prueba-apel.onrender.com/api/documentacion/numero-institucion/${nombreInstitucion}`),
          fetch(`https://backend-prueba-apel.onrender.com/api/correspondencia/numero-institucion/${nombreInstitucion}`),
          fetch(`https://backend-prueba-apel.onrender.com/api/iconografia/numero-institucion/${nombreInstitucion}`),
          fetch(`https://backend-prueba-apel.onrender.com/api/libros/numero-institucion/${nombreInstitucion}`),
          fetch(`https://backend-prueba-apel.onrender.com/api/hemerografia/numero-institucion/${nombreInstitucion}`),
          fetch(`https://backend-prueba-apel.onrender.com/api/partituras/numero-institucion/${nombreInstitucion}`),
          fetch(`https://backend-prueba-apel.onrender.com/api/objetos/numero-institucion/${nombreInstitucion}`),
          fetch(`https://backend-prueba-apel.onrender.com/api/monumentos/numero-institucion/${nombreInstitucion}`)
        ]);

        const data = await Promise.all(responses.map(res => res.json()));

        if (data[0].status === "success") setFotografiaCount(data[0].count);
        if (data[1].status === "success") setDocumentacionCount(data[1].count);
        if (data[2].status === "success") setCorrespondenciaCount(data[2].count);
        if (data[3].status === "success") setIconografiaCount(data[3].count);
        if (data[4].status === "success") setLibrosCount(data[4].count);
        if (data[5].status === "success") setHemerografiaCount(data[5].count);
        if (data[6].status === "success") setPartiturasCount(data[6].count);
        if (data[7].status === "success") setObjetosCount(data[7].count);
        if (data[8].status === "success") setMonumentosCount(data[8].count);
      } catch (error) {
        // Manejo de error
      }
    };

    fetchFoto();
  }, [id]);

  if (!fotografia) {
    return <div>Loading...</div>;
  }

  const handleImagenClick = (nombreImagen) => {
    setImagenPrincipal(nombreImagen);
  };

  const handleNavLinkClick = (event) => {
    event.stopPropagation(); // Evita que el evento de clic se propague
  };

  const getNavigationPath = () => {
    const { nombre, ciudad, pais } = fotografia;
    return (
      <>
        <span onClick={() => navigate(`/pais/${pais}`)}>{pais}</span> /
        <span onClick={() => navigate(`/admin/fotografias`)}>{ciudad}</span> /
        <span onClick={() => navigate(`admin/instituciones/${nombre}`)}>{nombre}</span> /
      </>
    );
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderField = (label, value) => {
    return value ? <p><span>{label}:</span> <span>{value}</span></p> : null;
  };

  return (
    <main className='main_fotodetalle'>
      <div id='nav3'>
        <p>{getNavigationPath()}</p>
      </div>
      <div className="container_fotodetalle">
        <button onClick={() => navigate(-1)}>Regresar</button>
        <div className='barra_fotodetalle'>
          <h2>{fotografia.nombre}</h2>
        </div>
        <div className='ficha_fotografia'>
          <div className='marco'>
            <img id='foto_principal_institucion'
              src={`https://backend-prueba-apel.onrender.com/imagenes/instituciones/${imagenPrincipal}`}
              alt={`${fotografia.nombre} principal`}
              className='fotografia-img-large'
            />
            <div className='thumbnails'>
              {fotografia.images && fotografia.images.map((image, index) => (
                <img
                  key={index}
                  src={`https://backend-prueba-apel.onrender.com/imagenes/instituciones/${image.nombre}`}
                  alt={`${fotografia.nombre} ${index + 1}`}
                  className='fotografia-img-thumbnail'
                  onClick={() => handleImagenClick(image.nombre)}
                />
              ))}
            </div>
          </div>
          <div className='contenido_hemerografiaDetalle'>
            <h3>{capitalizeFirstLetter(fotografia.nombre)}</h3>
            <h4>Ficha catalográfica</h4>
            {renderField("Nombre de la institución", fotografia.nombre)}
            {renderField("País", fotografia.pais)}
            {renderField("Ciudad", fotografia.ciudad)}
            {fotografia.maps ? (
              <p>
                <span>Maps:</span>{" "}
                <span>
                  <a href={fotografia.maps} target="_blank" rel="noopener noreferrer">
                    {fotografia.maps}
                  </a>
                </span>
              </p>
            ) : null}

            {fotografia.pagina_web ? (
              <p>
                <span>Página web:</span>{" "}
                <span>
                  <a href={fotografia.pagina_web} target="_blank" rel="noopener noreferrer">
                    {fotografia.pagina_web}
                  </a>
                </span>
              </p>
            ) : null}
            {renderField("Notas relevantes", fotografia.notas_relevantes)}
          </div>
        </div>

        <div className='container_acervo'>
          <section className='acervo_pages'>
            <NavLink to={`/admin/fotografias/institucion/${fotografia.nombre}`} className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img
                    src="https://nervodigital.com.mx/acervo/imgs/fotografiasub.jpg"
                    alt="Fotografía"
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Fotografía</h4>
                  <p className='description'>Conjunto de las fotografias</p>
                  <p className='count'>Número de fotografías: {fotografiaCount}</p>
                </div>
              </article>
            </NavLink>
            <NavLink to={`/admin/iconografia/institucion/${fotografia.nombre}`} className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://nervodigital.com.mx/acervo/imgs/dibujosub.png" 
                    alt="Iconografía" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Iconografía</h4>
                  <p className='description'>Conjunto de las iconografías</p>
                  <p className='count'>Número de iconografías: {iconografiaCount}</p>
                </div>
              </article>
            </NavLink>
            <NavLink to={`/admin/libros/institucion/${fotografia.nombre}`} className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://nervodigital.com.mx/acervo/imgs/librosub.jpg" 
                    alt="Libros" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Libros</h4>
                  <p className='description'>Conjunto de los libros</p>
                  <p className='count'>Número de libros: {librosCount}</p>
                </div>
              </article>
            </NavLink>
            <NavLink to={`/admin/hemerografia/institucion/${fotografia.nombre}`} className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://nervodigital.com.mx/acervo/imgs/hemerografiasub.jpg" 
                    alt="Publicaciones periódicas" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Publicaciones periódicas</h4>
                  <p className='description'>Conjunto de las publicaciones periódicas</p>
                  <p className='count'>Número de publicaciones periódicas: {hemerografiaCount}</p>
                </div>
              </article>
            </NavLink>
            <NavLink to={`/admin/correspondencia/institucion/${fotografia.nombre}`} className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://nervodigital.com.mx/acervo/imgs/correspondenciasub.jpg" 
                    alt="Correspondencia" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Correspondencia</h4>
                  <p className='description'>Conjunto de las correspondencias</p>
                  <p className='count'>Número de correspondencias: {correspondenciaCount}</p>
                </div>
              </article>
            </NavLink>
            <NavLink to={`/admin/documentacion/institucion/${fotografia.nombre}`} className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://nervodigital.com.mx/acervo/imgs/documentosub.jpg" 
                    alt="Documentación" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Documentación</h4>
                  <p className='description'>Conjunto de las documentaciones</p>
                  <p className='count'>Número de documentos: {documentacionCount}</p>
                </div>
              </article>
            </NavLink>
            <NavLink to={`/admin/partituras/institucion/${fotografia.nombre}`} className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://nervodigital.com.mx/acervo/imgs/partiturasub.png" 
                    alt="Partituras" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Partituras</h4>
                  <p className='description'>Conjunto de las partituras</p>
                  <p className='count'>Número de partituras: {partiturasCount}</p>
                </div>
              </article>
            </NavLink>
            <NavLink to={`/admin/objetos/institucion/${fotografia.nombre}`} className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://nervodigital.com.mx/acervo/imgs/objetosub.jpg" 
                    alt="Objetos personales" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Objetos personales</h4>
                  <p className='description'>Conjunto de los objetos personales</p>
                  <p className='count'>Número de objetos personales: {objetosCount}</p>
                </div>
              </article>
            </NavLink>
            <NavLink to={`/admin/monumentos/institucion/${fotografia.nombre}`} className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://nervodigital.com.mx/acervo/imgs/monumentosub.jpg" 
                    alt="Monumentos" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Monumentos</h4>
                  <p className='description'>Conjunto de los monumentos</p>
                  <p className='count'>Número de monumentos: {monumentosCount}</p>
                </div>
              </article>
            </NavLink>
          </section>
        </div>
      </div>
    </main>
  );
};
