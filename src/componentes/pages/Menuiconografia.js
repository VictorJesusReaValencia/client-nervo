import React from 'react'
import { NavLink } from 'react-router-dom'
export const Menuiconografia = () => {
  return (
    <main className='main_registro'>
      <div className='contenedor_main_registro'>
        <h1>Fromulario de registro de bienes</h1>
        
          <div className='frame_botones_icon'>
            <NavLink to="/admin/registro">
              <button>
                Regresar
              </button>
            </NavLink>
            <NavLink to="/admin/registro/fotografia">
              <button>
                Fotografía
              </button>
            </NavLink>
            <NavLink to="/admin/registro/iconografia">
              <button>
                Iconografía
              </button>
            </NavLink>
          </div>
        
      </div>
    </main>
  )
}
