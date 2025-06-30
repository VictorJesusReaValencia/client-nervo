import React, { useEffect } from 'react'
import useAuth from '../../../hooks/useAuth'
import { Navigate, useNavigate } from 'react-router-dom'

export const Logout = () => {

    const {setAuth} = useAuth()
    const navigate = useNavigate();

    useEffect(()=>{
        localStorage.clear()

        setAuth({})
        navigate("/login")
    })

  return (
    <h1>Cerrando sesion...</h1>
  )
}
