import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Hemerografia = () => {
  const [temas, setTemas] = useState([]);
  const [periodicos2, setPeriodicos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [texto, setTexto] = useState('');
  const [anioInicio, setAnioInicio] = useState('');
  const [anioFin, setAnioFin] = useState('');
  const [fechaPublicacion, setFechaPublicacion] = useState('');
  const [pais, setPais] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [periodico, setPeriodico] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getDatos();
  }, []);

  const getDatos = async () => {
    try {
      console.log("Cargando datos de temas y periódicos...");
      const temasRes = await fetch("http://localhost:3900/api/hemerografia/listar-temas");
      const temasDatos = await temasRes.json();
      console.log("Temas:", temasDatos.temas);
      const periodicosRes = await fetch("http://localhost:3900/api/periodicos/listar");
      const periodicosDatos = await periodicosRes.json();
      console.log("Periodicos:", periodicosDatos.Periodicos);
      if (temasDatos.status === "success") {
        setTemas(temasDatos.temas);
      }

      if (periodicosDatos.status === "success") {
        setPeriodicos(periodicosDatos.Periodicos);
        console.log("Periodicos:", periodicosDatos.Periodicos);
      }

    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
    }
  };

  const getImagenDelTema = (temaNombre) => {
    if (!Array.isArray(periodicos2)) return defaultImage(temaNombre);
    const match = periodicos2.find(p => p.nombre_periodico === temaNombre);
    if (match?.imagenes_fb?.length > 0) {
      return match.imagenes_fb[0].url;
    }
    return defaultImage(temaNombre);
  };

  const defaultImage = () =>
    `https://firebasestorage.googleapis.com/v0/b/acervodb.firebasestorage.app/o/Periodicos%2FPeriodico_Default.png?alt=media&token=77a0ea71-72f0-4b6b-bd2a-72333d6f7de1`;

  const handleTemaClick = (tema) => {
    navigate(`/admin/hemerografia/tema/${tema}`);
  };

   const buscar = async () => {
    const camposVacios =
    !texto && !anioInicio && !anioFin && !fechaPublicacion && !pais && !ciudad && !periodico;

  if (camposVacios) {
    setResultados([]); // Limpia resultados para mostrar temas de nuevo
    return;
  }
  const query = new URLSearchParams();

  if (texto) query.append('texto', texto);
  if (anioInicio) query.append('anioInicio', anioInicio);
  if (anioFin) query.append('anioFin', anioFin);
  if (fechaPublicacion) query.append('fecha_publicacion', fechaPublicacion);
  if (pais) query.append('pais', pais);
  if (ciudad) query.append('ciudad', ciudad);
  if (periodico) query.append('periodico', periodico);

  const url = `http://localhost:3900/api/hemerografia/buscar?${query.toString()}`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    if (datos.status === 'success') {
      setResultados(datos.resultados);
    } else {
      console.error('Error al buscar:', datos.message);
    }
  } catch (error) {
    console.error('Error en la búsqueda:', error);
  }
};
  

  const handleFotoClick = (fotografia) => {
    navigate(`/admin/hemerografia/${fotografia._id}`);
  };

  const handleDeleteClick = async (event, fotografiaId) => {
    event.stopPropagation();
    const url = `http://localhost:3900/api/hemerografia/${fotografiaId}`;
    const peticion = await fetch(url, {
      method: "DELETE"
    });

    const datos = await peticion.json();
    if (datos.status === "success") {
      setResultados(resultados.filter(f => f._id !== fotografiaId));
    }
  };

  const handleEditClick = (event, fotografiaId) => {
    event.stopPropagation();
    navigate(`/admin/editar/hemerografia/${fotografiaId}`);
  };

  return (
    <main className='main_temas_fotografia'>
      <div className='temas_contenedor_items'>
        <h1>Periódicos y revistas</h1>
      <div className="form-buscador">
        <input
          type="text"
          placeholder="Buscar texto..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <input
          type="number"
          placeholder="Año inicio"
          value={anioInicio}
          onChange={(e) => setAnioInicio(e.target.value)}
        />
        <input
          type="number"
          placeholder="Año fin"
          value={anioFin}
          onChange={(e) => setAnioFin(e.target.value)}
        />

        <input
          type="date"
          placeholder="Fecha exacta de publicación"
          value={fechaPublicacion}
          onChange={(e) => setFechaPublicacion(e.target.value)}
        />

        <input
          type="text"
          placeholder="País"
          value={pais}
          onChange={(e) => setPais(e.target.value)}
        />

        <input
          type="text"
          placeholder="Ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
        />

        <input
          type="text"
          placeholder="Periódico"
          value={periodico}
          onChange={(e) => setPeriodico(e.target.value)}
        />

        <button onClick={buscar}>Buscar</button>
      </div>


        {resultados.length > 0 ? (
          <div className='fotografias-container'>
            {resultados.map((fotografia) => {
              const firstImage = fotografia.imagenes_fb?.[0]?.url || defaultImage();
              const pendiente = fotografia.pendiente?.trim();
              const revisado = fotografia.revisado?.trim();
              const tieneRevisionNoResuelta = fotografia.revisiones?.some(rev => rev.revision_resuelta === false);

              let claseEstado = '';
              if (pendiente) claseEstado = 'pendiente';
              else if (tieneRevisionNoResuelta) claseEstado = 'revision-no-resuelta';
              else if (revisado !== 'Sí') claseEstado = 'no-revisado';
              else claseEstado = 'revisado';

              return (
                <div
                  key={fotografia._id}
                  className={`hemerografia-item ${claseEstado}`}
                  onClick={() => handleFotoClick(fotografia)}
                >
                  <img src={firstImage} className='fotografia-img' alt="Foto" />
                  <p className='numero_foto'>{fotografia.numero_registro}</p>
                  {pendiente && <p className='pendiente-text'>Pendiente: {pendiente}</p>}
                  <button onClick={(e) => handleEditClick(e, fotografia._id)}>Editar</button>
                  <button onClick={(e) => handleDeleteClick(e, fotografia._id)}>Borrar</button>
                </div>
              );
            })}
          </div>
        ) : (
          <div >
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
                    <p id='p_temas'>Total: {tema.numeroDeFotos}</p>
                    <p id='p_temas'>Revisados: {tema.revisados}</p>
                    <p id='p_temas'>Pendientes: {tema.pendientes}</p>
                  </div>
                </article>
              </div>
            ))}

            {!busqueda && (
  <div className='temas_contenedor' onClick={() => handleTemaClick("pendientes")}>
    <article>
      <img
        id='img_temas'
        src="https://backend-prueba-apel.onrender.com/imagenes/general/Temas/hemerografia/.jpg"
        alt="Imagen representativa de Pendientes"
      />
      <div className="contenido_temas">
        <h3>Pendientes</h3>
        <p id='p_temas'>Número de bienes registrados</p>
      </div>
    </article>
  </div>
)}
          </div>
        )}
      </div>
    </main>
  );
};
