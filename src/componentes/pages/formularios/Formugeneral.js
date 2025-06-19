import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useForm } from '../../../hooks/useForm';
import { Api } from '../../../hooks/Api';




export const Formugeneral = () => {


  const{formulario,enviado, cambiado} = useForm({})
  const [resultado,setResultado] = useState(false)


  const guardar_foto = async(e)=>{
    e.preventDefault()
    let nueva_foto = formulario;
    console.log(nueva_foto)

    const { datos, cargando} = await Api("https://backend-prueba-apel.onrender.com/api/fotografia/registrar-foto", "POST", nueva_foto)

    if (datos.status == "successs"){
      setResultado(true)
    }
    console.log(datos)
  }

  
  return (
    <div>
      <h1>Formulario de registro de bienes</h1>
      <div id="barra">
        <div id="barraicon">
          <NavLink to="/registro">
            <button>Regresar</button>
          </NavLink>
        </div>
      </div>
      <h2>Campos generales</h2>
      <strong>{resultado ?  "Articulo guardado " : "nel prro"}</strong>
      <div id="camposgenerales">
        <form onSubmit={guardar_foto}>
          <div id="tituloyautor">
            <label>Título:</label>
            <input type="text" name="titulo" placeholder="Título"  onChange={cambiado} />
            <label>Autor:</label>
            <input type="text" name="autor" placeholder="Autor" onChange={cambiado} />
          </div>
          
          
          <button onClick={guardar_foto}>Enviar</button>
        </form>

       
      </div>
    </div>
  );
};

