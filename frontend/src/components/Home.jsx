import React from 'react'
import Header from './Header'
import Hero  from '../sections/Hero'
import Sobre  from '../sections/Sobre'
import Precos  from '../sections/Precos'
import Servicos  from '../sections/Servicos'
import Contacto  from '../sections/Contacto'
import Footer from './Footer'


const Home = () => {
  return (
    <>
        <Header />
        <Hero />
        <Sobre />
        <Precos />
        <Servicos />
        <Contacto />
        <Footer />
    </>
  )
}

export default Home
