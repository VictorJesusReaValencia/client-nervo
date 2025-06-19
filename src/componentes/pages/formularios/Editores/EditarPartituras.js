import { useParams, NavLink } from 'react-router-dom';
import { useForm } from '../../../../hooks/useForm';
import { Api } from '../../../../hooks/Api';
import React, { useEffect, useState } from 'react';

export const EditarPartituras = () => {
  const { formulario, enviado, cambiado, resetFormulario, setFormulario } = useForm({});
  const [resultado, setResultado] = useState(false);
  const [fileName, setFileName] = useState('');
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [selectedPais, setSelectedPais] = useState('');
  const [selectedCiudad, setSelectedCiudad] = useState('');
  const [saved, setSaved] = useState('not sended');
  const { id } = useParams();
  const [fotografia, setFotografia] = useState({});
  const [data, setData] = useState(null);
  const [statuses, setStatuses] = useState({ peticion1: '', peticion2: '', peticion3: '', peticion4: '' });
  const [mensajes, setMensajes] = useState({ mensaje1: '', mensaje2: '', mensaje3: '', mensaje4: '' });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [customPromptText, setCustomPromptText] = useState('');
  const [currentField, setCurrentField] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);
  const [value, setValue] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [fieldName, setFieldName] = useState('');
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
          console.error("Error al obtener los datos", result.message);
        }
      } catch (error) {
        console.error("Error al realizar la petición", error);
      }
    };
    fetchData();
  }, []);
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
  useEffect(() => {
    const fetchFoto = async () => {
      const url = `https://backend-prueba-apel.onrender.com/api/partituras/icon/${id}`;
      const peticion = await fetch(url, {
        method: "GET"
      });

      let datos = await peticion.json();
      if (datos.status === "success") {
        setFotografia(datos.part);
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

  useEffect(() => {
    if (formulario.ciudad && formulario.pais) {
      const instituciones = data[formulario.pais][formulario.ciudad];
      setInstituciones(instituciones);
    }
  }, [formulario.ciudad]);
  useEffect(() => {
    return () => {
      // Liberar URLs cuando el componente se desmonte o se cambien los PDFs
      pdfUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [pdfUrls]);
  useEffect(() => {
    if (value.length > 1 && fieldName) {
      const fetchSugerencias = async () => {
        try {
          const response = await fetch(`https://backend-prueba-apel.onrender.com/api/partituras/search?query=${value}&campo=${fieldName}`);
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
    let nueva_foto = formulario;

    const { datos, cargando } = await Api("https://backend-prueba-apel.onrender.com/api/partituras/editar/" + id, "PUT", nueva_foto);
    setLoadingProgress(25); // Incrementa el progreso
    setStatuses(prev => ({ ...prev, peticion1: datos.status }))
    setMensajes(prev => ({ ...prev, mensaje1: datos.message }));
    if (datos.status == "success") {
      const fileInput = document.querySelector("#file");
      const formData = new FormData();
      Array.from(fileInput.files).forEach((file, index) => {
        formData.append(`files`, file);
      });
      setSaved("saved");

      const subida2 = await Api("https://backend-prueba-apel.onrender.com/api/partituras/registrar-imagen/" + id, "POST", formData, true);

      setLoadingProgress(50); // Incrementa el progreso
      setStatuses(prev => ({ ...prev, peticion2: subida2.datos.status }));
      setMensajes(prev => ({ ...prev, mensaje2: subida2.datos.message }));

      const subida = await Api("https://backend-google-fnsu.onrender.com/api/partituras/editar-imagen/" + id, "POST", formData, true);
      setLoadingProgress(75); // Incrementa el progreso
      setStatuses(prev => ({ ...prev, peticion3: subida.datos.status }));
      setMensajes(prev => ({ ...prev, mensaje3: subida.datos.message }));
      const pdfInput = document.querySelector("#pdf");
      const pdfFormData = new FormData();
      Array.from(pdfInput.files).forEach((file) => {
        pdfFormData.append('pdfs', file);
      });

      //const { pdfSubida } = await Api(`https://backend-prueba-apel.onrender.com/api/partituras/registrar-pdf/${datos.publicacionGuardada._id}`, "POST", pdfFormData, true);
      const pdfSubida2 = await Api(`https://backend-google-fnsu.onrender.com/api/partituras/registrar-pdf/` + id, "POST", pdfFormData, true);
      setLoadingProgress(100); // Incrementa el progreso
      setStatuses(prev => ({ ...prev, peticion4: pdfSubida2.datos.status }));
      setMensajes(prev => ({ ...prev, mensaje4: pdfSubida2.datos.message }));

      setResultado(true);
      setSaved("saved");
    } else {
      setSaved("error");
    }
  }
  const handleAutoComplete = async (field, promptId) => {
    const fileInput = document.querySelector("#file");
    if (fileInput.files.length > 0) {
      const formData = new FormData();
      formData.append('file', fileInput.files[0]);

      const { datos } = await Api(`http://localhost:3900/api/hemerografia/gpt/image-text/${promptId}`, "POST", formData, true);
      if (datos && datos.message) {
        cambiado({ target: { name: field, value: datos.message } });
      }
    } else {
      alert("Por favor selecciona una imagen primero.");
    }
  };
  const handleAutoCompleteSelect = async (field, promptId) => {
    const fileInput = document.querySelector("#file");
    if (fileInput.files.length > 0) {
      const formData = new FormData();
      formData.append('file', fileInput.files[0]);

      const { datos } = await Api(`http://localhost:3900/api/hemerografia/gpt/image-text/${promptId}`, "POST", formData, true);
      if (datos && datos.message) {
        // Validar que el mensaje sea una opción válida del select
        const opcionesValidas = ['notas', 'articulos', 'cronicas', 'frases', 'poesia', 'pendiente', 'noticias', 'cuento'];
        const generoSugerido = datos.message.toLowerCase();

        if (opcionesValidas.includes(generoSugerido)) {
          cambiado({ target: { name: field, value: datos.message } });
        } else {
          alert("El género sugerido no es válido para este campo.");
        }
      }
    } else {
      alert("Por favor selecciona una imagen primero.");
    }
  };
  const handleEditPromptAndAutoComplete = async (field, prompt) => {
    setCurrentField(field);
    setOriginalPrompt(prompt);
    setCustomPromptText(prompt);
    setShowModal(true);
  };
  const handleModalSubmit = () => {
    handleAutoComplete(currentField, customPromptText);
    setShowModal(false);
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

  return (
    <div>
      <main className='main_registro_monumentos'>
        <div className='contenedor_registro_monumentos'>
          <h1>Formulario de registro de bienes</h1>
          <div className='frame_botones_registro' id="regresar_boton">
            <NavLink to="/registro">
              <button className="button">Regresar</button>
            </NavLink>
          </div>
          <form onSubmit={guardar_foto}>
            <h2>Campos generales</h2>
            <div className='divisor_form'>
              <div className="form-group" id="nombrePeriodico">
                <label htmlFor="nombrePeriodico">Periódico</label>
                <select
                  id="nombrePeriodicoSelect"
                  name="nombre_periodico"
                  defaultValue={fotografia.nombre_periodico}
                  onChange={cambiado}
                >
                  <option value={fotografia.nombre_periodico}>{fotografia.nombre_periodico}</option>
                  <option value="El Nacional">El Nacional</option>
                </select>
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
              <div className="form-group" id="FechaPublicacion">
                <label id='fecha_publicacionLabel'>Fecha de publicación</label>
                <input
                  type="date"
                  name="fecha_publicacion"
                  defaultValue={fotografia.fecha_publicacion}
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
              <div className="form-group">
                <label>Encabezado</label>
                <input id='encabezado' type="textarea" name="encabezado" placeholder="Título" defaultValue={fotografia.encabezado || ''} onChange={cambiado} />
              </div>
              <div className="form-group" id='autor'>
                <label>Autor:</label>
                <input type="text" className='autor' name="autor" placeholder="Autor" defaultValue={fotografia.autor || ''} onChange={cambiado} />
              </div>
              <div className="form-group">
                <label htmlFor="nombreSeudonimos">Seudónimo</label>
                <select
                  id="nombreSeudonimos"
                  name="seudonimos"
                  defaultValue={fotografia.seudonimos || ''}
                  onChange={cambiado}
                >
                  <option value={fotografia.seudonimos}>{fotografia.seudonimos}</option>
                  <option value="Amado Nervo">Amado Nervo</option>
                  <option value="Román">Román</option>
                  <option value="Rip-Rip">Rip-Rip</option>
                  <option value="Tricio">Tricio</option>
                  <option value="Benedictus">Benedictus</option>
                  <option value="Joie">Joie</option>
                  <option value="Versión española de Amado Nervo">Versión española de Amado Nervo</option>
                  <option value="X.Y.Z">X.Y.Z</option>
                </select>
              </div>
              <div className="form-group">
                <label>Sección</label>
                <select
                  id="generoPeriodistico"
                  name="seccion"
                  value={formulario.seccion || ''}
                  onChange={cambiado}
                >
                  <option value={fotografia.seccion}>{fotografia.seccion}</option>
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
                  <option value="NA">NA</option>

                </select>
              </div>
            </div>
            <div className='divisor_form_hemerografia_3'>

<div className="form-group" id="resumen_hemerografia">
  <p id='resumen_hemerografia_p'>Resumen:</p>

  <div className='botonesIA_resumen_hemerografia'>

    <img src='https://backend-prueba-apel.onrender.com/imagenes/general/ai.png   ' onClick={() => handleAutoComplete('resumen', 'Dame un resumen de este periódico')}></img>
    <img src='https://backend-prueba-apel.onrender.com/imagenes/general/chat-gpt.png ' onClick={() => handleEditPromptAndAutoComplete('resumen', 'Dame un resumen de este periódico')}></img>
  </div>

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
    <div className='botonesIA_resumen_hemerografia'>

      <img src='https://backend-prueba-apel.onrender.com/imagenes/general/ai.png   ' onClick={() => handleAutoComplete('transcripcion', 'Dame la transcripcion de este periodico')}></img>
      <img src='https://backend-prueba-apel.onrender.com/imagenes/general/chat-gpt.png ' onClick={() => handleEditPromptAndAutoComplete('transcripcion', 'Dame la transcripcion de este periodico')}></img>



    </div>
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
      <div className={`modal ${showModal ? 'show' : ''}`}>
        <div className="modal-content">
          <h2>Edita el prompt</h2>
          <div className='contenido_editar_prompt'>
            <div className="image-preview_editar_prompt">
              <div className='marco2'>
                <img src={selectedImages[0]} />
              </div>
            </div>
            <div className='textarea_editar_prompt'>
              <textarea
                value={customPromptText}
                onChange={(e) => setCustomPromptText(e.target.value)}
              />
            </div>
            <div className="modal-buttons">
              <button onClick={handleModalSubmit}>Aceptar</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>


      </div>

    </div>
  );
};
