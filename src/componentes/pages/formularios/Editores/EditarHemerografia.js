import { useParams, NavLink } from 'react-router-dom';
import { useForm } from '../../../../hooks/useForm';
import { Api } from '../../../../hooks/Api';
import React, { useEffect, useState } from 'react';

export const EditarHemerografia = () => {
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
          const response = await fetch(`https://backend-prueba-apel.onrender.com/api/hemerografia/search?query=${value}&campo=${fieldName}`);
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

    const { datos, cargando } = await Api(`http://localhost:3900/api/hemerografia/editar/${id}`, "PUT", nueva_foto);
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

      const subida2 = await Api(`http://localhost:3900/api/hemerografia/editar-imagen/${id}`, "POST", formData, true);
      setLoadingProgress(50);
      setStatuses(prev => ({ ...prev, peticion2: subida2.datos.status }));
      setMensajes(prev => ({ ...prev, mensaje2: subida2.datos.message }));

      // Subida de PDFs
      const pdfInput = document.querySelector("#pdf");
      const pdfFormData = new FormData();
      Array.from(pdfInput.files).forEach((file) => {
        pdfFormData.append("pdfs", file);
      });

      const pdfSubida2 = await Api(`http://localhost:3900/api/hemerografia/editar-pdfs/${id}`, "POST", pdfFormData, true);
      setLoadingProgress(100);
      setStatuses(prev => ({ ...prev, peticion4: pdfSubida2.datos.status }));
      setMensajes(prev => ({ ...prev, mensaje4: pdfSubida2.datos.message }));

      setResultado(true);
      setSaved("saved");
    } else {
      setSaved("error");
    }
  };

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
      <main className='main_registro'>
        <div className='contenedor_registro_hemerografia'>
          <h1>Formulario de edición de Hemerografía</h1>

          <form onSubmit={guardar_foto}>

            <div className='divisor_form_hemerografia_1'>
              <div className="form-group" id="periodico_hemerografia">
                <label htmlFor="nombrePeriodico">Periódico:</label>

                <input
                  type="text"
                  name="nombre_periodico"
                  value={formulario.nombre_periodico || fotografia.nombre_periodico} // Solo manejar el valor desde `value`
                  onChange={handleChange}
                  autoComplete="off"
                />
                {(sugerencias.length > 0 && fieldName === "nombre_periodico") && (
                  <ul className="sugerencias-list">
                    {sugerencias.map((sugerencia, index) => (
                      <li key={index} onClick={() => handleSelect(sugerencia)}>
                        {sugerencia}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="form-group" id="numeroEdicion">
                <label htmlFor="numeroEdicion">Número de edición</label>
                <input
                  type="number"
                  id="numeroEdicionInput"
                  name="numero_edicion"
                  defaultValue={fotografia.numero_edicion}
                  onChange={cambiado}
                />
              </div>
              <div className="form-group" id="numeroEdicion">
                <label htmlFor="numeroEdicion">Número de carpeta</label>
                <input
                  type="number"
                  id="numeroEdicionInput"
                  name="numero_carpeta"
                  defaultValue={fotografia.numero_carpeta}
                  onChange={cambiado}
                />
              </div>
              <div className="form-group" id="FechaPublicacion">
                <label id='fecha_publicacionLabel'>Fecha de publicación</label>
                <input
                  type="date"
                  name="fecha_publicacion"
                  defaultValue={fotografia.fecha_publicacion ? fotografia.fecha_publicacion.split('T')[0] : ""}
                  onChange={cambiado}
                />
              </div>
              <div className="form-group" id="numero_edicion_hemerografia">
                <label htmlFor="numeroEdicion">Número de registro</label>
                <input
                  type="number"
                  id="numeroEdicionInput"
                  name="numero_registro"
                  defaultValue={fotografia.numero_registro || ''}
                  onChange={cambiado}
                />
              </div>
              <div className="form-group" id='encabezado_hemerografia'>
                <label>Encabezado:</label>

                <input type="text" name="encabezado" placeholder="Encabezado" defaultValue={fotografia.encabezado || ''} onChange={cambiado} />

              </div>
              <div className="form-group" id='autor_hemerografia'>
                <label>Autor:</label>
                <input type="text" className='autor' name="autor" placeholder="Autor" defaultValue={fotografia.autor || ''} onChange={cambiado} />
              </div>
              <div className="form-group" id='seudonimo_hemerografia'>
                <label htmlFor="nombreSeudonimos">Seudónimo:</label>

                <input
                  type='text'
                  id="nombreSeudonimos"
                  name="seudonimos"
                  value={formulario.seudonimos || fotografia.seudonimos}
                  onChange={handleChange}
                >


                </input>

                {(sugerencias.length > 0 && fieldName === "seudonimos") && (
                  <ul className="sugerencias-list">
                    {sugerencias.map((sugerencia, index) => (
                      <li key={index} onClick={() => handleSelect(sugerencia)}>
                        {sugerencia}
                      </li>
                    ))}
                  </ul>
                )}

              </div>
              <div className="form-group" id='seccion_hemerografia'>
                <label>Sección:</label>

                <input
                  type='text'
                  id="generoPeriodistico"
                  name="seccion"
                  value={formulario.seccion || fotografia.seccion}
                  onChange={handleChange}
                >

                  {/*
                                         <option value="">Seleccionar sección</option>
                                    <option value="Fuegos Fatuos">Fuegos Fatuos</option>
                                    <option value="Pimientos dulces">Pimietos dulces</option>
                                    <option value="Página literaria">Página literaria</option>
                                    <option value="Literatura">Literatura</option>
                                    <option value="Actualidades europeas">Actualidades europeas</option>
                                    <option value="Asuntos femeninos">Asuntos femeninos</option>
                                    <option value="Actualidades literarias">Actualidades literarias</option>
                                    <option value="Actualidades madrileñas">Actualidades madrileñas</option>
                                    <option value="La varita de la virtud">La varita de la virtud</option>
                                    <option value="Desde parís">Desde parís</option>
                                    <option value="Desde Madrid">Desde Madrid</option>

                                    <option value="Actualidades">Actualidades</option>
                                    <option value="Actualidades españolas">Actualidades españolas</option>
                                    <option value="Plaso ibañes">Plaso ibañes</option>
                                    <option value="El Imparcial">"El Imparcial"</option>
                                    <option value="De Amado Nervo">De Amado Nervo</option>
                                    <option value="La literatura maravillosa">La literatura maravillosa</option>
                                    <option value="Crónicas frívolas">Crónicas frívolas</option>
                                    <option value="Literatura nacional">Literatura nacional</option>
                                    <option value="Sociales">Sociales</option>
                                    <option value="Poesía">Poesía</option>
                                    <option value="Literaria">Literaria</option>


                                    <option value="NA">NA</option>
                                    */}


                </input>
                {(sugerencias.length > 0 && fieldName === "seccion") && (
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

            <div className='divisor_form_hemerografia_2'>
              <div className="form-group" id='paginas_hemerografia'>
                <label htmlFor="pagina">Página(s):</label>
                <input
                  type="text"

                  name="numero_paginas"
                  placeholder="Página(s)"
                  defaultValue={fotografia.numero_paginas}
                  onChange={cambiado}
                />
              </div>
              <div className="form-group" id='columnas_hemerografia' >
                <label htmlFor="columnas">Columnas:</label>
                <input
                  type="text"

                  name="columnas"
                  placeholder="Columnas"
                  defaultValue={fotografia.columnas || ''}
                  onChange={cambiado}
                />
              </div>
              <div className="form-group" id='genero_hemerografia'>
                <label>Género periodístico:</label>

                <input
                  type='text'
                  id="generoPeriodistico"
                  name="genero_periodistico"
                  value={formulario.genero_periodistico || fotografia.genero_periodistico}
                  onChange={handleChange}
                >
                  {/*
                          <option value="">Seleccionar género</option>
                      <option value="notas">Notas</option>
                      <option value="articulos">Artículos</option>
                      <option value="cronicas">Crónicas</option>
                      <option value="frases">Frases</option>
                      <option value="poesia">Poesía</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="noticias">Noticias</option>
                      <option value="cuento">Cuento</option>
                      */}

                </input>
                {(sugerencias.length > 0 && fieldName === "genero_periodistico") && (
                  <ul className="sugerencias-list">
                    {sugerencias.map((sugerencia, index) => (
                      <li key={index} onClick={() => handleSelect(sugerencia)}>
                        {sugerencia}
                      </li>
                    ))}
                  </ul>
                )}

              </div>
              <div className="form-group" id="lugar_publicacion_hemerografia">
                <label htmlFor="encabezado">Lugar de publicación:</label>
                <input
                  type="text"

                  name="lugar_publicacion"
                  placeholder="Lugar de publicación"
                  defaultValue={fotografia.lugar_publicacion || ''}
                  onChange={cambiado}
                />
              </div>
              <div className="form-group" id="periodicidad">
                <label htmlFor="tipoPublicacion">Periodicidad</label>
                <select
                  type="text"
                  id="periodicidadInput"
                  name="periodicidad"
                  placeholder="Tipo de publicación"
                  defaultValue={fotografia.periodicidad || ''}
                  onChange={cambiado}
                >
                  <option value={fotografia.periodicidad}>{fotografia.periodicidad}</option>
                  <option value="Diaria">Diaria</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Mensual">Mensual</option>
                </select>
              </div>
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
            </div>
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
                  name="pendiente"
                  defaultValue={fotografia.pendiente || ''}
                  onChange={cambiado}
                />
              </div>
              <div className='divisor_form'>
                <div className="form-group" id="transcripcion_hemerografia">
                  <p>Transcripciòn</p>

                  <textarea
                    type="text"
                    id="transcripcionInput2"
                    name="transcripcion"
                    defaultValue={fotografia.transcripcion || ''}
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
        </div>
      </main>

    </div>
  );
};