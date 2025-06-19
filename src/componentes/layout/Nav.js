import React from 'react'
import { NavLink, Router } from 'react-router-dom'

export const Nav = () => {
  return (
    <nav id="nav">
            <ul>
        <li>
          <NavLink to="/inicio">
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/acervo">
            Acervo
          </NavLink>
        </li>
        <li>
          <NavLink to="/croonologia">
            Croonología
          </NavLink>
        </li>
        <li>
          <NavLink to="/instituciones">
            Instituciones
          </NavLink>
        </li>
        <li>
          <NavLink to="/login">
            Yo te bendigo vida
          </NavLink>
        </li>
      </ul>
        </nav>
    )
}
