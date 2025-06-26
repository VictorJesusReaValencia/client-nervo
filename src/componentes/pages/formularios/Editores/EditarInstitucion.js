import { useParams, NavLink } from 'react-router-dom';
import { useForm } from '../../../../hooks/useForm';
import { Api } from '../../../../hooks/Api';
import React, { useEffect, useState } from 'react';

export const EditarInstitucion = () => {
  const { formulario, enviado, cambiado, resetFormulario, setFormulario } = useForm({})
  //----------------------------------Paises, ciudades e instituciones ----------------------------------//
  const [data, setData] = useState(null);
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [selectedPais, setSelectedPais] = useState('');
  const [selectedCiudad, setSelectedCiudad] = useState('');
  //----------------------------------Formulario y sugerencias ----------------------------------//
  const [selectedImages, setSelectedImages] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);
  const [value, setValue] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [fieldName, setFieldName] = useState('');
  //----------------------------------ChatGPT ----------------------------------//
  const [showModal, setShowModal] = useState(false);
  const [customPromptText, setCustomPromptText] = useState('');
  const [currentField, setCurrentField] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  //----------------------------------Guardar y enviar ----------------------------------//
  const [resultado, setResultado] = useState(false)
  const [fileName, setFileName] = useState('');
  const [saved, setSaved] = useState('not sended');
  const [statuses, setStatuses] = useState({ peticion1: '', peticion2: '', peticion3: '', peticion4: '' });
  const [mensajes, setMensajes] = useState({ mensaje1: '', mensaje2: '', mensaje3: '', mensaje4: '' });
  const [loadingProgress, setLoadingProgress] = useState(0);
  //----------------------------------Observaciones y obtener registro ----------------------------------//
  const { id } = useParams();
  const [fotografia, setFotografia] = useState({});
  const [mostrarObservacion, setMostrarObservacion] = useState(false);
  const [nuevaObservacion, setNuevaObservacion] = useState({
    persona: "",
    tipo_revision: "",
    observacion: ""
  });

  // Este useEffect se encarga de obtener los datos de las instituciones para la parte final del formulario
  // Se hace la peticion la la API y se guardan los datos en data y el primer cammpo en los paises para su seleccion ene l formulario
  useEffect(() => {
    const fetchData = async () => {
      const url = `https://backend-prueba-apel.onrender.com/api/instituciones/listar/todo`;
      try {
        const response = await fetch(url, {
          method: "GET"
        });
        const result = await response.json();
        if (result.status === "success") {
          setData(result.data);
          setPaises(Object.keys(result.data));
        } else {
          // Manejo de error
          console.error("Error al obtener los datos", result.mesage);
        }
      } catch (error) {
        console.error("Error al realizar la petición", error);
      }
    };
    fetchData();
  }, []);
  // Al modificar el campo pais, se actualizan las ciudades y se selecciona la primera si solo hay una
  useEffect(() => {

    if (formulario.pais) {
      const ciudades = Object.keys(data[formulario.pais]);
      setCiudades(ciudades);
      if (ciudades.length === 1) {
        setSelectedCiudad(ciudades[0]);

      } else {
        setSelectedCiudad('');
        setInstituciones([]);
      }
    }
  }, [formulario.pais]);
  // Una vez seleccionado el pais y la ciudad, se cargan las instituciones correspondientes a la ciudad
  useEffect(() => {
    if (formulario.ciudad && formulario.pais) {
      const instituciones = data[formulario.pais][formulario.ciudad];
      setInstituciones(instituciones);
    }
  }, [formulario.ciudad]);
  // Obtiene las sugerencias de autocompletado desde la API cuando el valor del input cambia y tiene mas de 1 caracter
  useEffect(() => {
    if (value.length > 1 && fieldName) {
      const fetchSugerencias = async () => {
        try {
          const response = await fetch(`https://backend-prueba-apel.onrender.com/api/instituciones/search?query=${value}&campo=${fieldName}`);
          if (!response.ok) {
            throw new Error('Error fetching suggestions');
          }
          const data = await response.json();
          setSugerencias(data);
        } catch (err) {
          console.error('Error fetching suggestions:', err);
        }
      };

      fetchSugerencias();
    } else {
      setSugerencias([]);
    }
  }, [value, fieldName]);
  // NO se que hace
  useEffect(() => {
    return () => {
      // Liberar URLs cuando el componente se desmonte o se cambien los PDFs
      pdfUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [pdfUrls]);
  // Aqui manejamos el estado del formlario, reiniciamos la barra de progreso y los mensajes de error dependiendo de cada peticion
  useEffect(() => {
    setSaved("")
    setLoadingProgress(0);
    setStatuses({
      peticion1: '',
      peticion2: '',
      peticion3: '',
      peticion4: ""
    });
    setMensajes({
      mensaje1: '',
      mensaje2: '',
      mensaje3: '',
      mensaje4: ''
    });
  }, [formulario])
  // Aqui obtenemos los datos de la fotografia a editar
  useEffect(() => {
    const fetchFoto = async () => {
      const url = `https://backend-prueba-apel.onrender.com/api/hemerografia/hemero/${id}`;
      const peticion = await fetch(url, {
        method: "GET"
      });

      let datos = await peticion.json();
      if (datos.status === "success") {
        setFotografia(datos.hemero);

      } else {
        // Manejo de error
      }
    };
    fetchFoto();
    if (formulario.pais) {
      const ciudades = Object.keys(data[formulario.pais]);
      setCiudades(ciudades);
      setSaved("");
      if (ciudades.length === 1) {
        setSelectedCiudad(ciudades[0]);
      } else {
        setSelectedCiudad('');
        setInstituciones([]);
      }
    }
  }, [formulario.pais, id]);

  const guardar_foto = async (e) => {
    e.preventDefault();

    let nueva_foto = { ...formulario }; // Clonamos el formulario para evitar modificar el estado directamente
    const revisionesAnteriores = fotografia.revisiones || [];

    // Si se agregó una nueva observación (revisión)
    if (formulario.nueva_revision &&
      formulario.nueva_revision.persona &&
      formulario.nueva_revision.tipo_revision &&
      formulario.nueva_revision.observacion
    ) {
      const nuevaRevision = {
        persona: formulario.nueva_revision.persona,
        fecha: new Date().toISOString(),
        tipo_revision: formulario.nueva_revision.tipo_revision,
        observacion: formulario.nueva_revision.observacion,
        revision_resuelta: formulario.nueva_revision.revision_resuelta || false
      };

      // Combinar revisiones
      nueva_foto.revisiones = [...revisionesAnteriores, nuevaRevision];
    } else {
      // Si no hay nueva revisión, conservar las anteriores
      nueva_foto.revisiones = revisionesAnteriores;
    }

    const { datos, cargando } = await Api(`http://localhost:3900/api/instituciones/editar/${id}`, "PUT", nueva_foto);
    setLoadingProgress(25);
    setStatuses(prev => ({ ...prev, peticion1: datos.status }));
    setMensajes(prev => ({ ...prev, mensaje1: datos.message }));

    if (datos.status === "success") {
      setSaved("saved");

      // Subida de imágenes
      const fileInput = document.querySelector("#file");
      const formData = new FormData();
      Array.from(fileInput.files).forEach((file) => {
        formData.append("files", file);
      });

      const subida2 = await Api(`http://localhost:3900/api/instituciones/editar-imagen/${id}`, "POST", formData, true);
      setLoadingProgress(50);
      setStatuses(prev => ({ ...prev, peticion2: subida2.datos.status }));
      setMensajes(prev => ({ ...prev, mensaje2: subida2.datos.message }));

      // Subida de PDFs
      const pdfInput = document.querySelector("#pdf");
      const pdfFormData = new FormData();
      Array.from(pdfInput.files).forEach((file) => {
        pdfFormData.append("pdfs", file);
      });

      const pdfSubida2 = await Api(`http://localhost:3900/api/instituciones/editar-pdfs/${id}`, "POST", pdfFormData, true);
      setLoadingProgress(100);
      setStatuses(prev => ({ ...prev, peticion4: pdfSubida2.datos.status }));
      setMensajes(prev => ({ ...prev, mensaje4: pdfSubida2.datos.message }));

      setResultado(true);
      setSaved("saved");
    } else {
      setSaved("error");
    }
  };
  const toggleRevisionResuelta = (index) => {
    const nuevasRevisiones = [...(fotografia.revisiones || [])];
    nuevasRevisiones[index].revision_resuelta = !nuevasRevisiones[index].revision_resuelta;

    setFotografia(prev => ({
      ...prev,
      revisiones: nuevasRevisiones
    }));

    setFormulario(prev => ({
      ...prev,
      revisiones: nuevasRevisiones
    }));
  };
  const actualizarObservacion = (index, nuevoTexto) => {
    const nuevasRevisiones = [...(fotografia.revisiones || [])];
    nuevasRevisiones[index].observacion = nuevoTexto;

    setFotografia(prev => ({
      ...prev,
      revisiones: nuevasRevisiones
    }));

    setFormulario(prev => ({
      ...prev,
      revisiones: nuevasRevisiones
    }));
  };
  const eliminarRevision = (index) => {
    const nuevasRevisiones = [...(fotografia.revisiones || [])];
    nuevasRevisiones.splice(index, 1); // Elimina la revisión en ese índice

    setFotografia(prev => ({
      ...prev,
      revisiones: nuevasRevisiones
    }));

    setFormulario(prev => ({
      ...prev,
      revisiones: nuevasRevisiones
    }));
  };

  return (
    <div>
      <main className='main_registro'>
        <div className='contenedor_formulario_foto'>
          <h1>Formulario de registro de bienes editar institucion</h1>
          <div className='frame_botones_registro' id="regresar_boton">
            <NavLink to="/registro">
              <button className="button">Regresar</button>
            </NavLink>
          </div>
          <form onSubmit={guardar_foto}>
            <h2>Campos generales</h2>
            <div className='divisor_form'>
              <div className="form-group" id="nombrePeriodico">
                <label htmlFor="nombrePeriodico">Nombre de la institución</label>
                <input
                  type='text'
                  id="nombrePeriodicoSelect"
                  name="nombre"
                  defaultValue={fotografia.nombre || ''}
                  onChange={cambiado}
                />
              </div>
              <div className="form-group" id="numeroEdicion">
                <label htmlFor="numeroEdicion">Tipo de institución</label>
                <input
                  type="text"
                  id="numeroEdicionInput"
                  name="tipo_institucion"
                  defaultValue={fotografia.tipo_institucion}
                  onChange={cambiado}
                />
              </div>
              <div className="form-group" id="numeroEdicion">
                <label htmlFor="numeroEdicion">Número de registro</label>
                <input
                  type="number"
                  id="numeroEdicionInput"
                  name="numero_registro"
                  defaultValue={fotografia.numero_registro || ''}
                  onChange={cambiado}
                />
              </div>
            </div>
            <div className='divisor_form2'>
              <div className="form-group" id="lugarPublicacion">
                <label htmlFor="encabezado">Maps</label>
                <input
                  type="text"
                  id="lugarPublicacionInput"
                  name="maps"
                  placeholder="Lugar de publicación"
                  defaultValue={fotografia.maps || ''}
                  onChange={cambiado}
                />
              </div>
              <div className="form-group" id="lugarPublicacion">
                <label htmlFor="encabezado">Página</label>
                <input
                  type="text"
                  id="lugarPublicacionInput"
                  name="pagina_web"
                  placeholder="Página web"
                  defaultValue={fotografia.pagina_web || ''}
                  onChange={cambiado}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='file0'>Imagen</label>
                <input type='file' name='file0' id="file" multiple />
              </div>
              <div className="form-group" id="resumen">
                <label htmlFor="resumen" id='resumenLabel'>Notas</label>
                <textarea
                  type="text"
                  id="resumenInput"
                  name="notas_relevantes"
                  placeholder="Resumen"
                  defaultValue={fotografia.notas_relevantes || ''}
                  onChange={cambiado}
                />
              </div>
              <div className="form-group" id="transcripcion">
                <label htmlFor="transcripcion" id="transcripcionLabel">Pendiente</label>
                <textarea
                  type="text"
                  id="transcripcionInput"
                  name="pendiente"
                  defaultValue={fotografia.pendiente || ''}
                  onChange={cambiado}
                />
              </div>
              <div className="form-group">
                <label>País:</label>
                <select
                  id="pais"
                  name='pais'
                  defaultValue={formulario.pais || ''}
                  onChange={cambiado}>

                  <option value={fotografia.pais}>{fotografia.pais}</option>
                  {paises.map((pais) => (
                    <option key={pais} name="paises" value={pais}>
                      {pais}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Ciudad:</label>
                <select
                  id="ciudad"
                  name="ciudad"
                  defaultValue={formulario.ciudad || ''}
                  onChange={cambiado}
                >
                  <option value={fotografia.ciudad}>{fotografia.ciudad}</option>
                  {ciudades.map((ciudad) => (
                    <option key={ciudad} value={ciudad}>
                      {ciudad}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Persona que registra:</label>
                <select name="persona_registra" defaultValue={fotografia.persona_registra || ''} onChange={cambiado}>
                  <option value={fotografia.persona_registra}>{fotografia.persona_registra}</option>
                  <option value="Mayra Fonseca">Mayra</option>
                  <option value="Robin">Robin</option>
                  <option value="Xoely">Xoely</option>
                  <option value="Perla">Perla</option>
                </select>
              </div>
            </div>
            <button className="button" onClick={guardar_foto}>Enviar</button>
            <strong id='saved_text'>{saved === 'saved' ? 'Fotografia registrada correctamente' : ''}</strong>
            <strong id="error_text">{saved === 'error' ? 'No se ha registrado la foto ' : ''}</strong>
            <h3>Historial de Revisiones</h3>
            {(fotografia.revisiones || []).map((rev, index) => (
              <div key={index} className="revision-item">
                <p><strong>Persona:</strong> {rev.persona}</p>
                <p><strong>Fecha:</strong> {new Date(rev.fecha).toLocaleString()}</p>
                <p><strong>Tipo:</strong> {rev.tipo_revision}</p>

                <label>
                  <strong>Observación:</strong>
                  <textarea
                    value={rev.observacion}
                    onChange={(e) => actualizarObservacion(index, e.target.value)}
                  />
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={rev.revision_resuelta}
                    onChange={() => toggleRevisionResuelta(index)}
                  />
                  Resuelta
                </label>

                {/* 🗑️ Botón para eliminar revisión */}
                <button type="button" onClick={() => eliminarRevision(index)} className="btn btn-danger">
                  Eliminar
                </button>

                <hr />
              </div>
            ))}
            <button type="button" onClick={() => setFormulario({
              ...formulario,
              nueva_revision: {
                persona: '',
                tipo_revision: '',
                observacion: '',
                revision_resuelta: false
              }
            })}>
              ➕ Agregar Observación
            </button>

            {formulario.nueva_revision && (
              <div className="bloque-observacion">
                <label>Persona que registra:</label>
                <input
                  type="text"
                  value={formulario.nueva_revision.persona}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      nueva_revision: {
                        ...formulario.nueva_revision,
                        persona: e.target.value
                      }
                    })
                  }
                />

                <label>Tipo de observación:</label>
                <input
                  type="text"
                  value={formulario.nueva_revision.tipo_revision}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      nueva_revision: {
                        ...formulario.nueva_revision,
                        tipo_revision: e.target.value
                      }
                    })
                  }
                />

                <label>Observación:</label>
                <textarea
                  value={formulario.nueva_revision.observacion}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      nueva_revision: {
                        ...formulario.nueva_revision,
                        observacion: e.target.value
                      }
                    })
                  }
                />

                <label>
                  <input
                    type="checkbox"
                    checked={formulario.nueva_revision.revision_resuelta}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        nueva_revision: {
                          ...formulario.nueva_revision,
                          revision_resuelta: e.target.checked
                        }
                      })
                    }
                  />
                  ¿Revisión resuelta?
                </label>
              </div>
            )}

            <strong id='saved_text'>{saved === 'saved' ? 'Fotografia actualizada correctamente' : ''}</strong>
            <strong id="error_text">{saved === 'error' ? 'No se ha registrado la foto ' : ''}</strong>

            <div className="progress-bar">
              <div className="progress" style={{ width: `${loadingProgress}%` }}></div>
              <p className="progress-text">{loadingProgress}%</p>
            </div>
            <div className='mensajes_peticiones'>
              {mensajes.mensaje1 ?
                <div className='mensajes'>
                  <strong id='saved_text'>{statuses.peticion1 === 'success' ? 'Información registrada correctamente' : ''}</strong>
                  <strong id='error_text'>{statuses.peticion1 === 'error' ? 'Error al registrar en base de datos' : ''}</strong>
                  <h4>Mensaje:</h4>
                  <p>{mensajes.mensaje1}</p>
                </div>
                : ""}
              {mensajes.mensaje2 ?
                <div className='mensajes'>
                  <strong id='saved_text'>{statuses.peticion2 === 'success' ? 'Foto subida al servidor Node' : ''}</strong>
                  <strong id='error_text'>{statuses.peticion2 === 'error' ? 'Error al registrar en el servidor node' : ''}</strong>
                  <h4>Mensaje:</h4>
                  <p> {mensajes.mensaje2}</p>
                </div>
                : ""}
              {mensajes.mensaje3 ?
                <div className='mensajes'>
                  <strong id='saved_text'>{statuses.peticion3 === 'success' ? 'Foto subida correctamente a Drive' : ''}</strong>
                  <strong id='error_text'>{statuses.peticion3 === 'error' ? 'Error al subir foto a Drive' : ''}</strong>
                  <h4>Mensaje:</h4>
                  <p>{mensajes.mensaje3}</p>
                </div>
                : ""}
              {mensajes.mensaje4 ?
                <div className='mensajes'>
                  <strong id='saved_text'>{statuses.peticion4 === 'success' ? 'PDFs subida correctamente a Drive' : ''}</strong>
                  <strong id='error_text'>{statuses.peticion4 === 'error' ? 'Error al subir pdf a Drive' : ''}</strong>
                  <h4>Mensaje:</h4>
                  <p> {mensajes.mensaje4}</p>
                </div>
                : ""}
            </div>
            <div className="images-preview">



              {/* Verifica la estructura de fotografia.images */}
              {fotografia.images && fotografia.images.map((image, index) => (
                <div className="image-preview">
                  <div className='marco2'>
                    <img
                      key={index}
                      src={`https://backend-prueba-apel.onrender.com/imagenes/hemerografia/${image.nombre}`}
                      alt={`${image.nombre}`}
                      className='fotografia-img-large'
                    />
                  </div>
                </div>
              ))}
            </div>

            {pdfUrls.length > 0 && (
              <div className="pdf-preview">
                {pdfUrls[0] ? <h1>PDFs subidos</h1> : ""}
                {pdfUrls.map((url, index) => (
                  <div key={index} className="pdf-container">
                    <embed
                      src={url}
                      width="100%"
                      height="500px"
                      type="application/pdf"
                    />
                  </div>
                ))}
              </div>
            )}
          </form>
          <strong id='saved_text'>{saved === 'saved' ? 'Fotografia actualizada correctamente' : ''}</strong>
          <strong id="error_text">{saved === 'error' ? 'No se ha registrado la foto ' : ''}</strong>
          <div className='marco'>
            {fotografia.images && fotografia.images.map((image, index) => (
              <img
                key={index}
                src={`https://backend-prueba-apel.onrender.com/imagenes/instituciones/${image.nombre}`}
                alt={`${image.nombre}`}
                className='fotografia-img-large'
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
