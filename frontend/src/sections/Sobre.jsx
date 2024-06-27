import React, { useEffect } from 'react'
import sobre from '../assets/images/about-1.jpg'
import { FaAngleDoubleRight } from 'react-icons/fa'
import CardHorario from '../components/CardHorario'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Sobre = () => {

    useEffect(() => {
        AOS.init({
            offset: 200,
            duration: 800,
            easing: 'ease-in-sine',
            delay: 100,
        });
    }, []);
    return (
        <section id='about' className='w-full md:px-20 px-10 md:py-20 py-10 flex flex-col md:flex-row justify-center items-center bg-cover bg-center' style={{ backgroundImage: `url(${sobre})` }}>
            <CardHorario />
            <div data-aos='slide-up' data-aos-delay="200" className='md:w-[40%] w-full flex flex-col justify-center items-center gap-6 h-fit'>
                <h1 className='text-6xl text-white font-bold text-center'>Sobre Nós</h1>
                <p className='text-2xl font-semibold text-white text-center'>A Karapinha é o melhor salão de beleza de angola, oferecemos os melhores serviços</p>
            </div>
        </section>
    )
}

export default Sobre
