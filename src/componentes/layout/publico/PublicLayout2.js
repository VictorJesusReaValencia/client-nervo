import React from 'react'
import { Header } from '../Header'
import { Nav } from '../Nav'
import { Footer } from '../Footer'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'

export const PublicLayout2 = () => {
  const {auth} = useAuth();

  console.log(auth)
  return (
    <div>
        <Header/>
        <Nav/>
        {!auth._id  ?<Outlet/>
        :<Navigate to={"/admin"}/>
        }
        <Footer/>
    </div>
  )
}