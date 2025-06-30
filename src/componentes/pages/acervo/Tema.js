import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/AuthProvider';

export const Tema = ({
  apiBaseUrl,             // Ej: "https://.../api/hemerografia"
  campoNombre,            // Ej: "nombre_periodico" o "titulo_libro"
  rutaDetalle,
  rutaEditar,               // Ej: "/admin/hemerografia"
  componenteDetalle: ComponenteDetalle, // Componente React opcional
  campoImagen = "imagenes_fb",          // Por defecto "imagenes_fb"
}) => {
  const [registros, setRegistros] = useState([]);
  const [nombre, setNombre] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    obtenerRegistros();
  }, [id]);

  const obtenerRegistros = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/tema/${id}`);
      const datos = await res.json();

      if (datos.status === "success") {
        let items = datos.fotos || datos.items || [];

        if (auth?.role === "gratis") {
          const hoy = new Date();
          const hace30Dias = new Date(hoy.setDate(hoy.getDate() - 30));

          items = items.filter(item => {
            if (!item.fecha_registro) return true;
            const fecha = new Date(item.fecha_registro);
            return fecha < hace30Dias;
          });
        }

        setRegistros(items);
        if (items.length > 0 && campoNombre && items[0][campoNombre]) {
          setNombre(items[0][campoNombre]);
        }
      } else {
        console.error("❌ Error al obtener registros:", datos.message);
      }
    } catch (error) {
      console.error("❌ Error de red:", error);
    }
  };

  const handleClick = (item) => {
    navigate(`${rutaDetalle}/${item._id}`);
  };

  const handleDelete = async (event, idItem) => {
    event.stopPropagation();
    try {
      const res = await fetch(`${apiBaseUrl}/borrar/${idItem}`, { method: "DELETE" });
      const datos = await res.json();
      if (datos.status === "success") {
        obtenerRegistros();
      } else {
        console.error('❌ Error al eliminar:', datos.message);
      }
    } catch (error) {
      console.error('❌ Error de red al eliminar:', error);
    }
  };

  const handleEdit = (event, idItem) => {
    event.stopPropagation();
    navigate(`${rutaEditar}/${idItem}`);
  };

  return (
    <main className='main_album'>
      <div className='container_fotografia'>
        <h1>{nombre}</h1>
        {ComponenteDetalle && <ComponenteDetalle />}
        <div className='fotografias-container'>
          {registros.map((item) => {
            const imagen = item[campoImagen]?.[0]?.url || null;
            const pendiente = item.pendiente?.trim();
            const revisado = item.revisado?.trim();
            const tieneRevisionNoResuelta = item.revisiones?.some(rev => rev.revision_resuelta === false);

            let claseEstado = '';
            if (pendiente) claseEstado = 'pendiente';
            else if (tieneRevisionNoResuelta) claseEstado = 'revision-no-resuelta';
            else if (revisado !== 'Sí') claseEstado = 'no-revisado';
            else claseEstado = 'revisado';

            return (
              <div
                key={item._id}
                className={`hemerografia-item ${claseEstado}`}
                onClick={() => handleClick(item)}
              >
                {imagen ? (
                  <img src={imagen} className='fotografia-img' alt={`Item ${item.numero_registro}`} />
                ) : (
                  <p>No hay imagen</p>
                )}
                <p className='numero_foto'>{item.numero_registro}</p>
                {pendiente && <p className='pendiente-text'>Pendiente: {pendiente}</p>}

                <button onClick={(e) => handleEdit(e, item._id)}>Editar</button>
                <button onClick={(e) => handleDelete(e, item._id)}>Borrar</button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};
