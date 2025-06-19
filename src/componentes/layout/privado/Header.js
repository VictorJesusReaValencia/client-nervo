import React from 'react'
import logo from "../../img/logo fundacion nuevo-02.png"
import { NavLink } from 'react-router-dom'

export const Header = () => {
  return (
    <header id="header">
            <div id="logo">
              <img src={logo} alt="logo"/>
            </div>
            <h1>
                <NavLink to={"inicio"} >
                     Amado Nervo 
                </NavLink>
            </h1>
            <div className='clearfix'>
              
            </div>
        </header>
  )
}