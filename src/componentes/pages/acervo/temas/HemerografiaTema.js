import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PeriodicoDetalle } from '../detalles/PeriodicoDetalle';
import AuthContext from '../../../../context/AuthProvider';

export const HemerografiaTema = () => {
  const [fotos, setFotos] = useState([]);
  const [nombrePeriodico, setNombrePeriodico] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    getFotos();
  }, [id]);

  const getFotos = async () => {
    const url = `https://backend-prueba-apel.onrender.com/api/hemerografia/tema/${id}`;
    const peticion = await fetch(url, { method: "GET" });
    const datos = await peticion.json();

    if (datos.status === "success") {
      let registros = datos.fotos;

      if (auth?.role === "gratis") {
        const hoy = new Date();
        const hace30Dias = new Date(hoy.setDate(hoy.getDate() - 30));

        // Solo incluir registros con fecha > 30 días o sin fecha
        registros = registros.filter(foto => {
          if (!foto.fecha_registro) return true;
          const fecha = new Date(foto.fecha_registro);
          return fecha < hace30Dias;
        });
      }

      setFotos(registros);
      if (registros.length > 0) {
        setNombrePeriodico(registros[0].nombre_periodico);
      }
    } else {
      console.error('Error fetching photos:', datos.message);
    }
  };

  const handleFotoClick = (fotografia) => {
    navigate(`/admin/hemerografia/${fotografia._id}`);
  };

  const handleDeleteClick = async (event, fotografiaId) => {
    event.stopPropagation();
    const url = `https://backend-prueba-apel.onrender.com/api/hemerografia/${fotografiaId}`;
    const peticion = await fetch(url, { method: "DELETE" });
    const datos = await peticion.json();
    if (datos.status === "success") {
      getFotos();
    } else {
      console.error('Error deleting photo:', datos.message);
    }
  };

  const handleEditClick = (event, fotografiaId) => {
    event.stopPropagation();
    navigate(`/admin/editar/hemerografia/${fotografiaId}`);
  };

  return (
    <main className='main_album'>
      <div className='container_fotografia'>
        <h1>{nombrePeriodico}</h1>
        <PeriodicoDetalle />
        <div className='fotografias-container'>
          {fotos.map((fotografia) => {
            const firstImage = fotografia.imagenes_fb?.[0]?.url || null;
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
                {firstImage ? (
                  <img src={firstImage} className='fotografia-img' alt={`Foto ${fotografia.numero_registro}`} />
                ) : (
                  <p>No hay imagen disponible</p>
                )}

                <p className='numero_foto'>{fotografia.numero_registro}</p>
                {pendiente && <p className='pendiente-text'>Pendiente: {pendiente}</p>}

                <button onClick={(event) => handleEditClick(event, fotografia._id)}>Editar</button>
                <button onClick={(event) => handleDeleteClick(event, fotografia._id)}>Borrar</button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};