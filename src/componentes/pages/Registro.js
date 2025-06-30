import React from 'react'
import { NavLink } from 'react-router-dom'

export const Registro = () => {
  return (
    <main className='main_registro'>
      <div className="contenedor_main_registro">
        <h1>Fromulario de registro de bienes</h1>
        <div className='frame_botones_registro'>
        
          <NavLink to="/admin/registro/fotografia">
            <button>
              Fotografia
            </button>
          </NavLink>
          <NavLink to="/admin/registro/iconografia">
            <button>
              Iconografia
            </button>
          </NavLink>
          <NavLink to="/admin/registro/libros">
            <button>
              Libros
            </button>
          </NavLink>
          <NavLink to="/admin/registro/periodicos">
            <button>
              Publicaciones periódicas
            </button>
          </NavLink>
          <NavLink to="/admin/registro/correspondencia">
            <button>
              Correspondencia
            </button>
          </NavLink>
          <NavLink to="/admin/registro/documentacion">
            <button>
              Documentación
            </button>
          </NavLink>
          <NavLink to="/admin/registro/objetos">
            <button>
              Objetos personales
            </button>
          </NavLink>
          <NavLink to="/admin/registro/partituras">
            <button>
              Partituras
            </button>
          </NavLink>
          <NavLink to="/admin/registro/monumentos">
            <button>
              Monumentos
            </button>
          </NavLink>
          <NavLink to="/admin/registro/audiovisuales">
            <button>
              Audiovisuales
            </button>
          </NavLink>
          
          <NavLink to="/admin/registro/instituciones">
            <button>
              Instituciones
            </button>
          </NavLink>

          <NavLink to="/admin/registro/periodicos2">
            <button>
              Periódicos
            </button>
          </NavLink>
        </div>

      </div>

    </main>
  )
}
