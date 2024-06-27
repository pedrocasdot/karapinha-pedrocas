import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import logo from '../assets/images/logo.png';
import 'aos/dist/aos.css';
import { IoLogIn } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000, // duração da animação em milissegundos
    });

    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { link: 'Sobre ', path: 'about' },
    { link: 'Precos', path: 'pricing' },
  ];

  return (
    <header
      className={`w-full bg-black text-white transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}
      data-aos="fade-down"
      style={{ zIndex: 1000 }}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-2xl font-bold">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-16 md:h-15 lg:h-15 p-2 bg-white rounded-full shadow-lg" />
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link to="/">
            <button className="hover:text-custom-brown">Inicio</button>
          </Link>
          
          <a href="#" className="hover:text-custom-brown">Sobre</a>
          <a href="#" className="hover:text-custom-brown">Preços</a>
          <a href="#" className="hover:text-custom-brown">Serviços</a>
          <a href="#" className="hover:text-custom-brown">Contacto</a>
        </nav>
        <div className="hidden md:flex space-x-4">
          <Link to="/login">
            <button data-aos='zoom-in' className='flex items-center px-10 py-3 bg-black text-white text-md font-semibold rounded-xl hover:bg-custombrown1 bg-custombrown hover:text-white cursor-pointer'>
              <IoLogIn className='mr-2' />Entrar
            </button>
          </Link>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-custom-brown">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <nav className="md:hidden bg-black" data-aos="fade-in">
          <a href="#" className="block py-2 px-4 text-custom-brown">Inicio</a>
          <a href="#" className="block py-2 px-4 text-custom-brown">Sobre Nós</a>
          <a href="#" className="block py-2 px-4 text-custom-brown">Preços</a>
          <a href="#" className="block py-2 px-4 text-custom-brown">Serviços</a>
          <a href="#" className="block py-2 px-4 text-custom-brown">Galeria</a>
          <a href="#" className="block py-2 px-4 text-custom-brown">Contacto</a>
          <div className="flex flex-col space-y-2 mt-2">
            <Link to="/login">
              <button className="bg-custombrown text-white px-4 py-2 rounded hover:bg-opacity-75">Entrar</button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
