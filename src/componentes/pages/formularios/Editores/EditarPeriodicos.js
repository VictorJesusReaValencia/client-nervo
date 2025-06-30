import { useParams, NavLink } from 'react-router-dom';
import { useForm } from '../../../../hooks/useForm';
import { Api } from '../../../../hooks/Api';
import React, { useEffect, useState } from 'react';

export const EditarPeriodicos = () => {
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
    const fetchFoto = async () => {
      const url = `https://backend-prueba-apel.onrender.com/api/periodicos/id/${id}`;
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

  useEffect(() => {
    if (formulario.ciudad && formulario.pais) {
      const instituciones = data[formulario.pais][formulario.ciudad];
      setInstituciones(instituciones);
    }
  }, [formulario.ciudad]);

  const guardar_foto = async (e) => {
    e.preventDefault();
    let nueva_foto = formulario;

    const { datos, cargando } = await Api("https://backend-prueba-apel.onrender.com/api/periodicos/editar/" + id, "PUT", nueva_foto);
    if (datos.status == "success") {
      const fileInput = document.querySelector("#file");
      const formData = new FormData();
      Array.from(fileInput.files).forEach((file, index) => {
        formData.append(`files`, file);
      });
      setSaved("saved");

      const { subida2, cargando2 } = await Api("https://backend-prueba-apel.onrender.com/api/periodicos/editar-imagen/" + id, "POST", formData, true);
      //const { subida, cargando } = await Api("https://backend-google-fnsu.onrender.com/api/periodicos/editar-imagen/" + id, "POST", formData, true);

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
                            <input
                                type='text'
                                id="nombrePeriodicoSelect"
                                name="nombre_periodico"
                                defaultValue={fotografia.nombre_periodico || ''}
                                onChange={cambiado}
                            >
                
                            

                            </input>
                  {/*
   
  
                            <select
                                id="nombrePeriodicoSelect"
                                name="nombre_periodico"
                                value={formulario.nombre_periodico || ''}
                                onChange={cambiado}
                            >
                
                                <option value="">Seleccionar Periódico</option>
                                <option value="El Nacional">El Nacional</option>
                                <option value="El Imparcial">El Imparcial</option>
                                <option value="El Mundo">El Mundo</option>
                                <option value="El Mundo Ilustrado">El Mundo Ilustrado</option>
                                <option value="El País">El País</option>
                                <option value="El Paladín">El Paladín</option>
                                <option value="El Plata">El Plata</option>
                                <option value="El Siglo">El Siglo</option>
                                <option value="El Telégrafo">El Telégrafo</option>
                                <option value="La Defensa">La Defensa</option>
                                <option value="La Gaceta de Guadalajara">La Gaceta de Guadalajara</option>
                                <option value="La Mañana">La Mañana</option>
                                <option value="La Nación">La Nación</option>
                                <option value="La Razón">La Razón </option>
                                <option value="La Prensa">La Prensa</option>
                                <option value="México Libre">México Libre</option>

                            </select>


                            */}
   
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
                        <div className='form-group'>
                            <label htmlFor='file0'>Imagen</label>
                            <input type='file' name='file0' id="file" multiple/>
                        </div>
                        </div>
                        <div className='divisor_form2'>
                       
                       
                     
                        <div className="form-group"id="resumen">
                            <label htmlFor="resumen" id='resumenLabel'>Resumen</label>
                            <textarea
                                type="text"
                                id="resumenInput"
                                name="resumen"
                                placeholder="Resumen"
                                defaultValue={fotografia.resumen || ''}
                                onChange={cambiado}
                            />
                        </div>

                        <div className="form-group"id="transcripcion">
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
            </div>
        </main>
    </div>
);
};
