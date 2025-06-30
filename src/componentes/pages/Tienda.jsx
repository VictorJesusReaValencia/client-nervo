import React from 'react';

export const Tienda = () => {
  const planes = [
    {
      nombre: 'Membresía Básica',
      descripcion: 'Accede a los contenidos disponibles del último mes.',
      precio: '$100 MXN / mes',
    },
    {
      nombre: 'Membresía Premium',
      descripcion: 'Accede a todo el contenido, sin restricciones.',
      precio: '$150 MXN / mes',
    },
    {
      nombre: 'Membresía Avanzada',
      descripcion: 'Incluye acceso anticipado y funciones exclusivas.',
      precio: '$200 MXN / mes',
    },
  ];

  const iniciarCompra = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('https://backend-prueba-apel.onrender.com/api/user/stripe/suscripcion-prueba', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const data = await response.json();
      if (data.id) {
        console.log("Redirigiendo a Stripe con la sesión:", data.url);
        window.location.href = `${data.id.url}`;
      } else {
        console.error("No se pudo obtener la sesión de Stripe.");
      }
    } catch (error) {
      console.error("Error al iniciar la compra:", error);
    }
  };

  return (
    <main id='main2'>
      <div className='contenedor_cronologia'>
        <h1>Tienda de Membresías</h1>
        {planes.map((plan, index) => (
          <article className='cronologia_item' key={index} onClick={iniciarCompra} style={{ cursor: 'pointer' }}>
            <h2>{plan.nombre}</h2>
            <p>{plan.descripcion}</p>
            <strong>{plan.precio}</strong>
          </article>
        ))}
      </div>
    </main>
  );
};
