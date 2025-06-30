import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';

export const Register = () => {
  const { formulario, cambiado, resetFormulario } = useForm({});
  const [saved, setSaved] = useState("not sended");

  const saveUser = async (e) => {
    e.preventDefault();
    let newUser = formulario;
    console.log(newUser);
    const request = await fetch("https://backend-prueba-apel.onrender.com/api/user/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: { "Content-Type": "application/json" }
    });

    const data = await request.json();

    if (data.status === "success") {
      setSaved("saved");
      resetFormulario(); // Resetea el formulario después de un registro exitoso
    } else {
      setSaved("error");
    }

    console.log(data);
  };

  return (
    <main id="main2">
      <div id='container2'>
        <h1>Registrar</h1>
        <NavLink to="/login">
          <button>Regresar</button>
        </NavLink>
        <strong>{saved === "saved" ? "Usuario registrado correctamente" : ""}</strong>
        <strong>{saved === "error" ? "Usuario No registrado" : ""}</strong>
        <form className='register-form'>
          <div className='form-group'>
            <label htmlFor='nombre'>Nombre</label>
            <input
              type='text'
              name='nombre'
              value={formulario.nombre || ''}
              onChange={cambiado}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='surname'>Apellidos</label>
            <input
              type='text'
              name='surname'
              value={formulario.surname || ''}
              onChange={cambiado}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Usuario</label>
            <input
              type='email'
              name='email'
              value={formulario.email || ''}
              onChange={cambiado}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Contraseña</label>
            <input
              type='password'
              name='password'
              value={formulario.password || ''}
              onChange={cambiado}
            />
          </div>

          <button className="button" onClick={saveUser}>Enviar</button>
        </form>
      </div>
    </main>
  );
};
