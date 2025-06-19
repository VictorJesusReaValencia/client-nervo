import React from 'react'
import logo from "../../img/logo fundacion nuevo-02.png"

import { NavLink } from 'react-router-dom'
export const Header = () => {
  return (
    <header id="header">
        <div className="header-container">
            <img src={logo} alt="logo" className="header-logo"/>
            <h1 className="header-title">
                <NavLink to={"inicio"} >
                     Amado Nervo 
                </NavLink>
            </h1>
        </div>
    </header>
);

}
