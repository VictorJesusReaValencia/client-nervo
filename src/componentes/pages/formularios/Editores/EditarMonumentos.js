import { useParams, NavLink } from 'react-router-dom';
import { useForm } from '../../../../hooks/useForm';
import { Api } from '../../../../hooks/Api';
import React, { useEffect, useState } from 'react';

export const EditarMonumentos = () => {
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
          const response = await fetch(`https://backend-prueba-apel.onrender.com/api/monumentos/search?query=${value}&campo=${fieldName}`);
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
      const url = `https://backend-prueba-apel.onrender.com/api/monumentos/icon/${id}`;
      const peticion = await fetch(url, {
        method: "GET"
      });

      let datos = await peticion.json();
      if (datos.status === "success") {
        setFotografia(datos.monu);

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

  const handleSelect = (sugerencia) => {

    const e = { target: { name: fieldName, value: sugerencia } };
    if (fieldName) {
      setFotografia({
        ...fotografia,
        [fieldName]: sugerencia
      })

      setSugerencias([]);
      cambiado(e);


    }
  };
  const handleChange = (e) => {

    if (!e || !e.target) {
      console.error("El evento o el target están indefinidos:", e);
      return;
    }

    const name = e.target.name;
    const value = e.target.value
    setValue(value); // Actualizar el valor del input
    setFieldName(name); // Guardar el nombre del campo para el autocompletado
    cambiado(e); // Actualizar el estado del formulario

  };
  const guardar_foto = async (e) => {   //!ojito aqui
    e.preventDefault();
    let nueva_foto = formulario;

    const { datos, cargando } = await Api("https://backend-prueba-apel.onrender.com/api/monumentos/editar/" + id, "PUT", nueva_foto);
    setLoadingProgress(33); // Incrementa el progreso
    setStatuses(prev => ({ ...prev, peticion1: datos.status }))
    setMensajes(prev => ({ ...prev, mensaje1: datos.message }));
    if (datos.status == "success") {
      const fileInput = document.querySelector("#file");
      const formData = new FormData();
      Array.from(fileInput.files).forEach((file, index) => {
        formData.append(`files`, file);
      });
      setSaved("saved");

      const subida2 = await Api("https://backend-prueba-apel.onrender.com/api/monumentos/editar-imagen/" + id, "POST", formData, true);

      setLoadingProgress(66); // Incrementa el progreso
      setStatuses(prev => ({ ...prev, peticion2: subida2.datos.status }));
      setMensajes(prev => ({ ...prev, mensaje2: subida2.datos.message }));


      const pdfInput = document.querySelector("#pdf");
      const pdfFormData = new FormData();
      Array.from(pdfInput.files).forEach((file) => {
        pdfFormData.append('pdfs', file);
      });

      const pdfSubida2 = await Api(`https://backend-prueba-apel.onrender.com/api/monumentos/editar-pdfs/` + id, "POST", pdfFormData, true);
      setLoadingProgress(100); // Incrementa el progreso
      setStatuses(prev => ({ ...prev, peticion4: pdfSubida2.datos.status }));
      setMensajes(prev => ({ ...prev, mensaje4: pdfSubida2.datos.message }));

      setResultado(true);
      setSaved("saved");
    } else {
      setSaved("error");
    }
  }
  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      setSelectedImages((prevImages) => prevImages.concat(filesArray));
      Array.from(e.target.files).map(
        (file) => URL.revokeObjectURL(file) // Avoid memory leaks
      );
    }
  };
  const handlePDFChange = (e) => {
    const files = e.target.files;
    const newPdfUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setPdfUrls(prevPdfUrls => [...prevPdfUrls, ...newPdfUrls]); // Agrega las nuevas URLs al estado existente
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
  // Función para editar el texto de observación
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
      <main className='main_registro_monumentos'>
        <div className='contenedor_registro_monumentos'>

          <h1>Formulario de registro de Monumentos</h1>

          <form onSubmit={guardar_foto}>


            <div className='divisor_form_hemerografia_1' >
              <div className="form-group" id='titulo_monumentos'>
                <label>Nombre de la obra</label>
                <input
                  id='encabezado'
                  type="textarea"
                  name="titulo"
                  placeholder="Título"
                  value={formulario.titulo || fotografia.titulo}
                  onChange={cambiado} />
              </div>

              <div className="form-group" id="tipo_monumentos">
                <label htmlFor="nombrePeriodico">Tipo de monumento:</label>

                <input
                  type="text"
                  name="tipo_monumento"
                  value={formulario.tipo_monumento || fotografia.tipo_monumento}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {(sugerencias.length > 0 && fieldName === "tipo_monumento") && (
                  <ul className="sugerencias-list">
                    {sugerencias.map((sugerencia, index) => (
                      <li key={index} onClick={() => handleSelect(sugerencia)}>
                        {sugerencia}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="form-group" id='caracteristicas_monumentos'>
                <label>Características físicas :</label>

                <input type="text" className='autor' name="descripcion_fisica" placeholder=""
                  value={formulario.descripcion_fisica || fotografia.descripcion_fisica}
                  onChange={cambiado} />

              </div>

              <div className="form-group" id='autores_monumentos'>
                <label>Autor (es) :</label>
                <input type="text" className='autor' name="autor" placeholder="Autor" value={formulario.autor || ''} onChange={cambiado} />
              </div>

              <div className="form-group" id="ubicacion_monumentos">
                <label id='fecha_publicacionLabel'>Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formulario.ubicacion || fotografia.ubicacion}
                  onChange={cambiado}
                />
              </div>
              <div className="form-group" id='caracteristicas_monumentos' >
                <label htmlFor="columnas">Entidad</label>
                <input
                  type="text"
                  id="columnasInput"
                  name="entidad"
                  placeholder="entidad"
                  value={formulario.entidad || fotografia.entidad}
                  onChange={cambiado}
                />
              </div>

              <div className="form-group" id="inscripciones_monumentos">
                <label id='fecha_publicacionLabel'>Inscripciones</label>
                <input
                  type="text"
                  name="inscripciones"
                  value={formulario.inscripciones || fotografia.inscripciones}
                  onChange={cambiado}
                />
              </div>



              <div className="form-group" id='fecha_monumentos' >
                <label htmlFor="columnas">Fecha de inauguracion</label>
                <input
                  type="date"
                  id="columnasInput"
                  name="fecha_inauguracion"
                  placeholder="evento"
                  defaultValue={fotografia.fecha_inauguracion ? fotografia.fecha_inauguracion.split('T')[0] : ""}
                  onChange={cambiado}
                />
              </div>





              <div className="form-group" id="numeroEdicion">
                <label htmlFor="numeroEdicion">Número de registro</label>
                <input
                  type="number"
                  id="numeroEdicionInput"
                  name="numero_registro"
                  value={formulario.numero_registro || fotografia.numero_registro}
                  onChange={cambiado}
                />
              </div>





            </div>
            <div className='divisor_form_hemerografia_3'>

              <div className='form-group' id='imagenes_hemerografia'>
                <label htmlFor='file0'>Imágenes: </label>
                <input type='file' onChange={handleImageChange} name='file0' id="file" multiple />
              </div>
              <div className="form-group" id='edicion_hemerografia'>
                <label>Edición:</label>
                <select id='hallazgo' name="edicion" defaultValue={fotografia.edicion || ''} onChange={cambiado}>
                  <option value={fotografia.edicion}>{fotografia.edicion}</option>¨
                  <option value="No">No</option>
                  <option value="Sí">Sí</option>
                </select>
              </div>
              <div className='form-group' id='pdf2'>
                <label htmlFor='pdfs'>Pdfs: </label>
                <input type='file' onChange={handlePDFChange} name='pdfs' id='pdf' multiple />
              </div>
              <div className='divisor_form'>


                <div className='divisor_form_hemerografia_3'>


                  <div className="form-group" id="resumen_hemerografia">
                    <p id='resumen_hemerografia_p'>Resumen:</p>

                    <textarea
                      type="text"

                      name="resumen"
                      placeholder="Resumen"
                      defaultValue={fotografia.resumen || ''}
                      onChange={cambiado}
                    />

                  </div>


                  <div className="form-group" id="pendientes_hemerografia">
                    <p id='pendientes_hemerografia_p'>Pendientes:</p>
                    <textarea
                      type="text"
                      id="transcripcionInput"
                      name="pendientes"
                      defaultValue={fotografia.pendientes || ''}
                      onChange={cambiado}
                    />
                  </div>

                  <div className='divisor_form'>
                    <div className="form-group" id="transcripcion_hemerografia">
                      <p>Descripción o contexto</p>

                      <textarea
                        type="text"
                        id="transcripcionInput2"
                        name="transcripcion"
                        defaultValue={fotografia.descripcion_contexto || ''}
                        onChange={cambiado}
                      />
                    </div>
                  </div>



                  <div className="form-group">
                    <label>País:</label>
                    <select
                      id="pais"
                      name='pais'
                      defaultValue={fotografia.pais || ''}
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
                      defaultValue={fotografia.ciudad || ''}
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
                    <label>Institución:</label>
                    <select id="institucion" name='institucion' defaultValue={fotografia.institucion || ""} onChange={cambiado}>
                      <option value={fotografia.institucion}>{fotografia.institucion}</option>
                      {instituciones.map((institucion, index) => (
                        <option key={index} value={institucion}>
                          {institucion}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" id='ubicacion_fisica_documentacion'>
                    <label>Ubicación física:</label>
                    <input type='text'
                      name="ubicacion_fisica"
                      value={formulario.ubicacion_fisica || fotografia.ubicacion_fisica}
                      onChange={handleChange}>

                    </input>
                    {(sugerencias.length > 0 && fieldName === "ubicacion_fisica") && (
                      <ul className="sugerencias-list">
                        {sugerencias.map((sugerencia, index) => (
                          <li key={index} onClick={() => handleSelect(sugerencia)}>
                            {sugerencia}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="form-group" id='coleccion_hemerografia'>
                    <label>Colección:</label>
                    {(sugerencias.length > 0 && fieldName === "coleccion") && (
                      <ul className="sugerencias-list">
                        {sugerencias.map((sugerencia, index) => (
                          <li key={index} onClick={() => handleSelect(sugerencia)}>
                            {sugerencia}
                          </li>
                        ))}
                      </ul>
                    )}
                    <input
                      type='text'
                      name="coleccion"
                      value={formulario.coleccion || fotografia.coleccion}
                      onChange={handleChange}>

                    </input>
                  </div>

                  <div className="form-group">
                    <label>Año de adquisición:</label>
                    <select id='adq' name="fecha_adquisicion" defaultValue={fotografia.fecha_adquisicion} onChange={cambiado} >
                      <option value={fotografia.fecha_adquisicion}>{fotografia.fecha_adquisicion}</option>
                      <option value="2020">2020</option>
                      <option value="2019">2019</option>
                      <option value="2018">2018</option>
                      <option value="2017">2017</option>
                      <option value="2016">2016</option>
                      <option value="2015">2015</option>
                      <option value="2014">2014</option>
                      <option value="2013">2013</option>
                      <option value="2012">2012</option>
                      <option value="2011">2011</option>
                      <option value="2010">2010</option>
                      <option value="2009">2009</option>
                      <option value="2008">2008</option>
                      <option value="2007">2007</option>
                      <option value="2006">2006</option>
                      <option value="2005">2005</option>
                      <option value="2004">2004</option>
                      <option value="2003">2003</option>
                      <option value="2002">2002</option>

                    </select>
                  </div>
                  <div className="form-group" id='tema_hemerografia'>
                    <label>Tema:</label>
                    {(sugerencias.length > 0 && fieldName === "tema") && (
                      <ul className="sugerencias-list">
                        {sugerencias.map((sugerencia, index) => (
                          <li key={index} onClick={() => handleSelect(sugerencia)}>
                            {sugerencia}
                          </li>
                        ))}
                      </ul>
                    )}
                    <input type='text'
                      name="tema"
                      value={formulario.tema || fotografia.tema}
                      onChange={handleChange}>

                    </input>
                  </div>


                  <div className="form-group" id='hallazgo_deocumentacion'>
                    <label>Hallazgo:</label>
                    <select id='hallazgo' name="hallazgo" defaultValue={fotografia.hallazgo} onChange={cambiado}>
                      <option value={fotografia.hallazgo}>{fotografia.hallazgo}</option>
                      <option value="No">No</option>
                      <option value="Sí">Sí</option>
                    </select>
                  </div>

                  <div className="form-group" id='edicion_hemerografia'>
                    <label>Mostrar:</label>
                    <select id='hallazgo' name="mostrar" defaultValue={fotografia.mostrar} onChange={cambiado}>
                      <option value={fotografia.mostrar}>{fotografia.mostrar}</option>
                      <option value="No">No</option>
                      <option value="Sí">Sí</option>
                    </select>
                  </div>
                  <div className="form-group" id='edicion_hemerografia' >
                    <label>Revisado:</label>
                    <select id='hallazgo' name="revisado" defaultValue={fotografia.revisado || ''} onChange={cambiado}>
                      <option value={fotografia.revisado}>{fotografia.revisado}</option>
                      <option value="No">No</option>
                      <option value="Sí">Sí</option>
                    </select>
                  </div>

                  <div className="form-group" id='persona_registra_documentacion'>
                    <label>Persona que registra:</label>
                    <input type='text' name="persona_registra"
                      value={formulario.persona_registra || fotografia.persona_registra}
                      onChange={handleChange}>
                    </input>
                    {(sugerencias.length > 0 && fieldName === "persona_registra") && (
                      <ul className="sugerencias-list">
                        {sugerencias.map((sugerencia, index) => (
                          <li key={index} onClick={() => handleSelect(sugerencia)}>
                            {sugerencia}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <button className="button" onClick={guardar_foto}>Enviar</button>

                <strong id='saved_text'>{saved === 'saved' ? 'Fotografia actualizada correctamente' : ''}</strong>
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


                <div className="images-preview">
                  {/* Verifica la estructura de fotografia.images */}
                  {fotografia.images && fotografia.images.map((image, index) => (
                    <div className="image-preview">
                      <div className='marco2'>
                        <img
                          key={index}
                          src={`https://backend-prueba-apel.onrender.com/imagenes/monumentos/${image.nombre}`}
                          alt={`${image.nombre}`}
                          className='fotografia-img-large'
                        />
                      </div>
                    </div>
                  ))}
                </div>



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
                  {/* Verifica la estructura de fotografia.imagenes_fb */}
                  {fotografia.imagenes_fb && fotografia.imagenes_fb.map((image, index) => (
                    <div className="image-preview">
                      <div className='marco2'>
                        <img
                          key={index}
                          src={`${image.url}`}
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
              </div>
            </div>
          </form>
        </div>
      </main>
      <div className={`modal ${showModal ? 'show' : ''}`}>

      </div>
    </div>
  )
};