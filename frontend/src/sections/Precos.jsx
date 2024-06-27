import React, { useEffect, useState } from 'react';
import CardPreco from '../components/CardPreco';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getAllServices } from '../services/apiService';  // Importe a função getAllServices

const Pricing = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 800,
      easing: 'ease-in-sine',
      delay: 100,
    });

    // Função para buscar serviços
    const fetchServices = async () => {
      try {
        const fetchedServices = await getAllServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id='pricing' className='w-full md:px-20 px-10 md:py-10 flex flex-col justify-center items-center gap-24'>
      <h1 data-aos="zoom-in" className='text-6xl font-bold text-black text-center'>Os Melhores Preços da Banda</h1>

      <div className='grid md:grid-cols-2 grid-cols-1 justify-center items-center gap-20 w-[85%]'>
        {services.map((service) => (
          <CardPreco
            key={service.id}
            descricao={service.serviceName}
            preco={service.price}
          />
        ))}
      </div>
    </section>
  );
}

export default Pricing;
