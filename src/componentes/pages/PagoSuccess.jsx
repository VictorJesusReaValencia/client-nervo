import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const PagoSuccess = () => {
 const [mensaje, setMensaje] = useState('Confirmando pago...');
  
  useEffect(() => {
    const actualizarRol = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMensaje("Error: no hay token disponible.");
        return;
      }

      try {
        const response = await fetch('https://backend-prueba-apel.onrender.com/api/user/actualizar-rol', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        });

        const data = await response.json();

        if (data.status === 'success') {
          setMensaje('¡Gracias por tu suscripción! Tu cuenta ahora es premium.');
        } else {
          console.error('Error al actualizar el rol:', data.message);
          setMensaje('Error al actualizar el rol. Intenta más tarde.');
        }
      } catch (error) {
        console.error('Error en fetch:', error);
        setMensaje('Error al conectar con el servidor.');
      }
    };

    actualizarRol();
  }, []);

  return (
    <main className='main_album'>
      <div className='container_fotografia'>
        <h1>{mensaje}</h1>
      </div>
    </main>
  );
};