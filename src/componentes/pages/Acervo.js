import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export const Acervo = () => {
  const [numeroBienes, setNumeroBienes] = useState({
    fotografia: null,
    iconografia: null,
    libros: null,
    hemerografia: { total: 0, revisados: 0, pendientes: 0 },
    correspondencia: null,
    documentacion: null,
    partituras: null,
    objetos: null,
    monumentos: null,
    audiovisuales: null,
  });

  const fetchNumeroBienes = (tipo) => {
    fetch(`http://localhost:3900/api/${tipo}/numero-bienes`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          const info = data.total !== undefined ? {
            total: data.total || 0,
            revisados: data.revisados || 0,
            pendientes: data.pendientes || 0
          } : data.count;

          setNumeroBienes(prevState => ({ ...prevState, [tipo]: info }));
        }
      })
      .catch(error => console.error(`Error fetching data for ${tipo}:`, error));
  };

  useEffect(() => {
    const tipos = [
      'fotografia', 'iconografia', 'libros', 'hemerografia',
      'correspondencia', 'documentacion', 'partituras', 
      'objetos', 'monumentos', 'audiovisuales'
    ];
    tipos.forEach(tipo => fetchNumeroBienes(tipo));
  }, []);

  const handleNavLinkClick = (event) => {
    event.stopPropagation();
  };

  const totalBienes = Object.values(numeroBienes).reduce((total, val) => {
    if (val === null) return total;
    if (typeof val === 'object') return total + (val.total || 0);
    return total + val;
  }, 0);


  return (
    <div>
      <main id="main_acervo">
        <div className='container_acervo'>
          <section className='acervo_pages'>
            <NavLink to="/admin/fotografias" className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://backend-prueba-apel.onrender.com/imagenes/general/Acervo/fotografias.jpg" 
                    alt="Fotografía" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Fotografía</h4>
                  
                  {numeroBienes.fotografias !== null && (
                    <p className='description'>Número de bienes: {numeroBienes.fotografia}</p>
                  )}
                </div>
              </article>
            </NavLink>

            <NavLink to="/admin/iconografia" className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://backend-prueba-apel.onrender.com/imagenes/general/Acervo/iconografia.png" 
                    alt="Iconografía" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Iconografía</h4>
                  
                  {numeroBienes.iconografia !== null && (
                    <p className='description'>Número de bienes: {numeroBienes.iconografia}</p>
                  )}
                </div>
              </article>
            </NavLink>

            <NavLink to="/admin/libros" className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://backend-prueba-apel.onrender.com/imagenes/general/Acervo/libros.jpg" 
                    alt="Libros" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Libros</h4>
                  
                  {numeroBienes.libros !== null && (
                    <p className='description'>Número de bienes: {numeroBienes.libros}</p>
                  )}
                </div>
              </article>
            </NavLink>

             <NavLink to="/admin/hemerografia" className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://backend-prueba-apel.onrender.com/imagenes/general/Acervo/hemerografia.jpg" 
                    alt="Publicaciones periódicas" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Hemerografía</h4>
                  {numeroBienes.hemerografia && (
                    <>
                      <p className='description'>Total: {numeroBienes.hemerografia.total}/ 1500 </p>
                      <p className='description'>Revisados: {numeroBienes.hemerografia.revisados}</p>
                      <p className='description'>Pendientes: {numeroBienes.hemerografia.pendientes}</p>
                    </>
                  )}
                </div>
              </article>
            </NavLink>

            <NavLink to="/admin/correspondencia" className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://backend-prueba-apel.onrender.com/imagenes/general/Acervo/correspondencia.jpg" 
                    alt="Correspondencia" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Correspondencia</h4>
                  
                  {numeroBienes.correspondencia !== null && (
                    <p className='description'>Número de bienes: {numeroBienes.correspondencia}</p>
                  )}
                </div>
              </article>
            </NavLink>

            <NavLink to="/admin/documentacion" className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://backend-prueba-apel.onrender.com/imagenes/general/Acervo/documentacion.jpg" 
                    alt="Documentación" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Documentación</h4>
                  
                  {numeroBienes.documentacion !== null && (
                    <p className='description'>Número de bienes: {numeroBienes.documentacion}</p>
                  )}
                </div>
              </article>
            </NavLink>

            <NavLink to="/admin/partituras" className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://backend-prueba-apel.onrender.com/imagenes/general/Acervo/partituras.png" 
                    alt="Partituras" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Partituras</h4>
                  
                  {numeroBienes.partituras !== null && (
                    <p className='description'>Número de bienes: {numeroBienes.partituras}</p>
                  )}
                </div>
              </article>
            </NavLink>

            <NavLink to="/admin/objetos" className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://backend-prueba-apel.onrender.com/imagenes/general/Acervo/objetos.jpg" 
                    alt="Objetos personales" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Objetos personales</h4>
                  
                  {numeroBienes.objetos !== null && (
                    <p className='description'>Número de bienes: {numeroBienes.objetos}</p>
                  )}
                </div>
              </article>
            </NavLink>

            <NavLink to="/admin/monumentos" className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://backend-prueba-apel.onrender.com/imagenes/general/Acervo/monumentos.jpg" 
                    alt="Monumentos" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Monumentos</h4>
                  
                  {numeroBienes.monumentos !== null && (
                    <p className='description'>Número de bienes: {numeroBienes.monumentos}</p>
                  )}
                </div>
              </article>
            </NavLink>

            <NavLink to="/admin/audiovisuales" className="clasificacion" onClick={handleNavLinkClick}>
              <article>
                <div className='mascara'>
                  <img 
                    src="https://backend-prueba-apel.onrender.com/imagenes/general/Acervo/audiovisuales.jpg" 
                    alt="Audiovisuales" 
                  />
                </div>
                <div className='informacion-clas'>
                  <h4 className='title'>Audiovisuales</h4>
                  
                  {numeroBienes.audiovisuales !== null && (
                    <p className='description'>Número de bienes: {numeroBienes.audiovisuales}</p>
                  )}
                </div>
              </article>
            </NavLink>


            <p id='bienesTotales'><h2>Número de bienes totales:</h2> {Object.values(numeroBienes).reduce((total, num) => total + (num || 0), 0)}</p>

          </section>
        </div>
      </main>
    </div>
  );
}
