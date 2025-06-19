import React from 'react'
import { Header } from '../Header'
import { Footer } from '../Footer'
import { Navigate, Outlet } from 'react-router-dom'
import { Nav } from './Nav'
import useAuth from '../../../hooks/useAuth'

export const PrivateLayout = () => {
  const {auth, loading} = useAuth();

  if(loading){
    return<h1>Cargando</h1>
  }else{
  return (
    <div>
        <Header/>
        <Nav/>
        {auth._id  ?<Outlet/>
        :<Navigate to={"/login"}/>
        }
        <Footer/>
    </div>
  )
}
}