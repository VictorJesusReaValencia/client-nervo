import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';
import axios from 'axios';

export const RegFotografia = () => {
  const { formulario, cambiado } = useForm({});
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [selectedCiudad, setSelectedCiudad] = useState('');
  const [data, setData] = useState(null);
  const [transcripcion, setTranscripcion] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://backend-prueba-apel.onrender.com/api/instituciones/listar/todo`;
      try {
        const response = await fetch(url, { method: "GET" });
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

  useEffect(() => {
    if (formulario.ciudad && formulario.pais) {
      const instituciones = data[formulario.pais][formulario.ciudad];
      setInstituciones(instituciones);
    }
  }, [formulario.ciudad]);

  const handleTranscripcion = async (e) => {
    e.preventDefault();
    const fileInput = document.querySelector("#file");
    console.log(fileInput)
    const formData = new FormData();
    if (fileInput.files.length > 0) {
      formData.append('file', fileInput.files[0]);

      try {
        const response = await axios.post('http://localhost:3900/api/fotografia/gpt/gpt/transcripcion', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data)
        if (response.data && response.data.transcription) {
          setTranscripcion(response.data.transcription);
        } else {
          console.error("No se encontró el campo 'transcripcion' en la respuesta.");
        }
      } catch (error) {
        console.error('Error al hacer la petición:', error);
      }
    } else {
      console.error("No se seleccionó ningún archivo.");
    }
  };

  return (
    <div>
      <main className='main_registro'>
        <div className='contenedor_formulario_foto'>
          <div>
            <h1>Formulario de registro de bienes</h1>
            <div className='frame_botones_registro' id="regresar_boton">
              <NavLink to="/registro">
                <button className="button">Regresar</button>
              </NavLink>
            </div>

            <form>
              <h2>Campos generales</h2>

              <div className='divisor_form'>
                {/* Otros campos de formulario */}
                
                <div className='form-group'>
                  <label htmlFor='file'>Imagen</label>
                  <input type='file' name='file' id="file" />
                </div>

                {/* Botón para transcribir */}
                <button className="button" onClick={handleTranscripcion}>Transcribir</button>

                {/* Mostrar la transcripción */}
                {transcripcion && (
                  <div>
                    <h3>Transcripción:</h3>
                    <p>{transcripcion}</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
