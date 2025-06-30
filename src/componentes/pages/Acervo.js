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
    fetch(`https://backend-prueba-apel.onrender.com/api/${tipo}/numero-bienes`)
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

                  {numeroBienes.fotografia && (
                    <>
                      <p className='description'>Total: {numeroBienes.fotografia.total} </p>
                      <p className='description'>Revisados: {numeroBienes.fotografia.revisados}</p>
                      <p className='description'>Pendientes: {numeroBienes.fotografia.pendientes}</p>
                    </>
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

                  {numeroBienes.iconografia && (
                    <>
                      <p className='description'>Total: {numeroBienes.iconografia.total} </p>
                      <p className='description'>Revisados: {numeroBienes.iconografia.revisados}</p>
                      <p className='description'>Pendientes: {numeroBienes.iconografia.pendientes}</p>
                    </>
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

                  {numeroBienes.libros && (
                    <>
                      <p className='description'>Total: {numeroBienes.libros.total} </p>
                      <p className='description'>Revisados: {numeroBienes.libros.revisados}</p>
                      <p className='description'>Pendientes: {numeroBienes.libros.pendientes}</p>
                    </>
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

                  {numeroBienes.correspondencia && (
                    <>
                      <p className='description'>Total: {numeroBienes.correspondencia.total} </p>
                      <p className='description'>Revisados: {numeroBienes.correspondencia.revisados}</p>
                      <p className='description'>Pendientes: {numeroBienes.correspondencia.pendientes}</p>
                    </>
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

                  {numeroBienes.documentacion && (
                    <>
                      <p className='description'>Total: {numeroBienes.documentacion.total} </p>
                      <p className='description'>Revisados: {numeroBienes.documentacion.revisados}</p>
                      <p className='description'>Pendientes: {numeroBienes.documentacion.pendientes}</p>
                    </>
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

                  {numeroBienes.partituras && (
                    <>
                      <p className='description'>Total: {numeroBienes.partituras.total} </p>
                      <p className='description'>Revisados: {numeroBienes.partituras.revisados}</p>
                      <p className='description'>Pendientes: {numeroBienes.partituras.pendientes}</p>
                    </>
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

                  {numeroBienes.objetos && (
                    <>
                      <p className='description'>Total: {numeroBienes.objetos.total} </p>
                      <p className='description'>Revisados: {numeroBienes.objetos.revisados}</p>
                      <p className='description'>Pendientes: {numeroBienes.objetos.pendientes}</p>
                    </>
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

                  {numeroBienes.monumentos && (
                    <>
                      <p className='description'>Total: {numeroBienes.monumentos.total} </p>
                      <p className='description'>Revisados: {numeroBienes.monumentos.revisados}</p>
                      <p className='description'>Pendientes: {numeroBienes.monumentos.pendientes}</p>
                    </>
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

                  {numeroBienes.iconografia && (
                    <>
                      <p className='description'>Total: {numeroBienes.iconografia.total} </p>
                      <p className='description'>Revisados: {numeroBienes.iconografia.revisados}</p>
                      <p className='description'>Pendientes: {numeroBienes.iconografia.pendientes}</p>
                    </>
                  )}
                </div>
              </article>
            </NavLink>


            <p id='bienesTotales'>
  <h2>Número de bienes totales:</h2>
  {
    Object.values(numeroBienes)
      .filter(val => val && typeof val === 'object' && 'total' in val)
      .reduce((total, val) => total + (val.total || 0), 0)
  }
</p>
          </section>
        </div>
      </main>
    </div>
  );
}
