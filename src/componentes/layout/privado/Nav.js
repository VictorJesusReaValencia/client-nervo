import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export const Nav = () => {
  const navigate = useNavigate();

  return (
    <nav id="nav2">
      <button className="back-button" onClick={() => navigate(-1)}>←</button>
      <ul>
        <li>
          <NavLink to="/admin/inicio">Inicio</NavLink>
        </li>
        <li>
          <NavLink to="/admin/acervo">Acervo</NavLink>
        </li>
       
        <li>
          <NavLink to="/admin/instituciones">Instituciones</NavLink>
        </li>
        <li>
          <NavLink to="/admin/Tienda">Videos</NavLink>
        </li>
         <li>
          <NavLink to="/admin/Tienda">Tienda</NavLink>
        </li>
        <li>
          <NavLink to="/admin/registro">Yo te bendigo vida</NavLink>
        </li>
        <li>
          <NavLink to="/admin/logout">Logout</NavLink>
        </li>
      </ul>
    </nav>
  );
};
