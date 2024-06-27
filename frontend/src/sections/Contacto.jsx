import React, { useEffect } from 'react';
import AOS from 'aos';
import sobre from '../assets/images/about-1.jpg'
import 'aos/dist/aos.css';

const Contact = () => {
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 800,
      easing: 'ease-in-sine',
      delay: 100,
    });
  }, []);

  return (
    <section 
      id="contact" 
      className="w-full md:px-20 px-10 md:py-20 py-10 flex flex-col justify-center items-center relative"
      style={{ backgroundImage: `url(${sobre})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 w-full flex flex-col justify-center items-center">
        <h1 data-aos="fade-up" className="text-6xl font-bold text-white text-center mb-10">Entre em Contato</h1>
        
        <form className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="200">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nome</label>
            <input type="text" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Seu Nome" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Seu Email" />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Mensagem</label>
            <textarea id="message" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="5" placeholder="Sua Mensagem"></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-custombrown hover:bg-custombrown1 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Enviar</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Contact;
