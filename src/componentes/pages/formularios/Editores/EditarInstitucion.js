import { useParams, NavLink } from 'react-router-dom';
import { useForm } from '../../../../hooks/useForm';
import { Api } from '../../../../hooks/Api';
import React, { useEffect, useState } from 'react';

export const EditarInstitucion = () => {
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
          console.error("Error al obtener los datos", result.message);
        }
      } catch (error) {
        console.error("Error al realizar la petición", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFoto = async () => {
      const url = `https://backend-prueba-apel.onrender.com/api/instituciones/${id}`;
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
    if (formulario.pais && data) {
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
  }, [formulario.pais, id, data]);

  useEffect(() => {
    if (formulario.ciudad && formulario.pais && data) {
      const instituciones = data[formulario.pais][formulario.ciudad];
      setInstituciones(instituciones);
    }
  }, [formulario.ciudad, formulario.pais, data]);

  const guardar_foto = async (e) => {
    e.preventDefault();
    let nueva_foto = formulario;

    if (fotografia.nombre !== nueva_foto.nombre) {
      const tiposBienes = [
        "fotografia",
        "hemerografia",
        "libros",
        "iconografia",
        "monumentos",
        "partituras",
        "documentacion",
        "correspondencia"
      ];
    
      const actualizaciones = tiposBienes.map(tipo => {
        return fetch(`https://backend-prueba-apel.onrender.com/api/${tipo}/actualizar-institucion/${fotografia.nombre}/${nueva_foto.nombre}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          }
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Error al actualizar en ${tipo}: ${response.statusText}`);
          }
          return response.json();
        });
      });
    
      try {
        await Promise.all(actualizaciones);
        console.log("Todas las instituciones actualizadas correctamente");
      } catch (error) {
        console.error("Error al actualizar las instituciones en los diferentes tipos de bienes", error);
        setSaved("error");
        return;
      }
    }
    

    const { datos, cargando } = await Api("https://backend-prueba-apel.onrender.com/api/instituciones/editar/" + fotografia._id, "PUT", nueva_foto);
    if (datos.status === "success") {
      const fileInput = document.querySelector("#file");
      const formData = new FormData();
      Array.from(fileInput.files).forEach((file, index) => {
        formData.append(`files`, file);
      });
      setSaved("saved");

      //const { subida2, cargando2 } = await Api("https://backend-prueba-apel.onrender.com/api/instituciones/registrar-imagen/" + fotografia._id, "POST", formData, true);
      const { subida, cargando } = await Api("https://backend-prueba-apel.onrender.com/api/instituciones/editar-imagen/" + fotografia._id, "POST", formData, true);

      setResultado(true);
      setSaved("saved");
    } else {
      setSaved("error");
    }
  }

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
