import React from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { Login } from '../componentes/layout/publico/Login'
import { Register } from '../componentes/layout/publico/Register'
import { Header } from '../componentes/layout/Header'
import { PublicLayout2 } from '../componentes/layout/publico/PublicLayout2'

export const Routing = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={Header}>
                <Route index element={<Login/>}/>
                <Route path='login' element={<Login/>}/>
                <Route path='registro' element={<Register/>}/>

            </Route>
        </Routes>
    </BrowserRouter>
  )
}
