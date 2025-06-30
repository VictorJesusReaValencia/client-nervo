import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Bien = ({
  titulo,
  apiTemasUrl,
  apiItemsUrl,
  apiBuscarUrl,
  rutaItem,
  camposBusqueda,
  campoComparacion = 'nombre_periodico'
}) => {
  const [temas, setTemas] = useState([]);
  const [itemsReferencia, setItemsReferencia] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [filtros, setFiltros] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
        //console.log("Cargando datos de temas y referencias...");
      const temasRes = await fetch(apiTemasUrl);
      const temasDatos = await temasRes.json();
       
         if (temasDatos.status === 'success') {
       
        setTemas(temasDatos.temas);
      }

      const refRes = await fetch(apiItemsUrl);
      const refDatos = await refRes.json();

     

      if (refDatos.status === 'success') {
        setItemsReferencia(refDatos.Periodicos || refDatos.items || []);
       
      }
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
    }
  };

  const filtrosVacios = () =>
    camposBusqueda.every(campo => !filtros[campo] || filtros[campo].trim() === '');

  const handleInputChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const buscar = async () => {
    if (filtrosVacios()) {
      setResultados([]);
      return;
    }

    const query = new URLSearchParams();
    for (const [campo, valor] of Object.entries(filtros)) {
      if (valor) query.append(campo, valor);
    }

    try {
      const res = await fetch(`${apiBuscarUrl}?${query.toString()}`);
      const datos = await res.json();
      if (datos.status === 'success') {
        setResultados(datos.resultados);
      }
    } catch (error) {
      console.error('❌ Error en la búsqueda:', error);
    }
  };
  
  const defaultImage = () =>
    'https://firebasestorage.googleapis.com/v0/b/acervodb.firebasestorage.app/o/Periodicos%2FPeriodico_Default.png?alt=media&token=77a0ea71-72f0-4b6b-bd2a-72333d6f7de1';

  const getImagenDelTema = (temaNombre) => {

    if (!Array.isArray(itemsReferencia)) return defaultImage();
    const match = itemsReferencia.find(p => p[campoComparacion] === temaNombre);
    if (match?.imagenes_fb?.length > 0) {
      return match.imagenes_fb[0].url;
    }
    return defaultImage();
  };

  const handleTemaClick = (tema) => navigate(`${rutaItem}/tema/${tema}`);
  const handleItemClick = (item) => navigate(`${rutaItem}/${item._id}`);

  return (
    <main className='main_temas_fotografia'>
      <div className='temas_contenedor_items'>
        <h1>{titulo}</h1>

        <div className="form-buscador">
          {camposBusqueda.map(campo => (
            <input
              key={campo}
              type={campo.includes("fecha") ? "date" : "text"}
              placeholder={campo.charAt(0).toUpperCase() + campo.slice(1).replace(/_/g, ' ')}
              value={filtros[campo] || ''}
              onChange={e => handleInputChange(campo, e.target.value)}
            />
          ))}
          <button onClick={buscar}>Buscar</button>
        </div>

        {resultados.length > 0 ? (
          <div className='fotografias-container'>
            {resultados.map(item => (
              <div
                key={item._id}
                className="hemerografia-item"
                onClick={() => handleItemClick(item)}
              >
                <img
                  src={item.imagenes_fb?.[0]?.url || defaultImage()}
                  className='fotografia-img'
                  alt="Imagen"
                />
                <p className='numero_foto'>{item.numero_registro}</p>
              </div>
            ))}
          </div>
        ) : filtrosVacios() ? (
          <div>
            {temas.map((tema, index) => (
              <div
                key={index}
                className='temas_contenedor'
                onClick={() => handleTemaClick(tema.tema)}
              >
                <article>
                  <img
                    id='img_temas'
                    src={getImagenDelTema(tema.tema)}
                    alt={`Imagen representativa de ${tema.tema}`}
                  />
                  <div className="contenido_temas">
                    <h3>{tema.tema}</h3>
                    <p>Total: {tema.numeroDeFotos}</p>
                    <p>Revisados: {tema.revisados}</p>
                    <p>Pendientes: {tema.pendientes}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay resultados que coincidan con los filtros.</p>
        )}
      </div>
    </main>
  );
};
