import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';
import useAuth from '../../../hooks/useAuth';

export const Login = () => {
  const { setAuth } = useAuth();
  const { formulario, cambiado } = useForm({});
  const [saved, setSaved] = useState('not sended');

  const saveUser = async (e) => {
    e.preventDefault();
    let newUser = formulario;
    const request = await fetch('https://backend-prueba-apel.onrender.com/api/user/login', {
      method: 'POST',
      body: JSON.stringify(newUser),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await request.json();
    if (data.status === 'success') {
      setSaved('saved');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth(data.user); // Update the auth context

      
    } else {
      setSaved('error');
    }
  };

  return (
    <main id="main2">
      <div id='container2'>
        <h1>Login</h1>
        <NavLink to="/registrar">
          <button>
            Regresar
          </button>
        </NavLink>
        <strong>{saved === 'saved' ? 'Usuario registrado correctamente' : ''}</strong>
        <strong>{saved === 'error' ? 'Usuario No registrado ' : ''}</strong>
        <form className='register-form'>
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
