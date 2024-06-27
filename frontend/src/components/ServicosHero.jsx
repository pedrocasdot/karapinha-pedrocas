import React, {useEffect} from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const ServicosHero = ({imagem, descricao}) => {
    useEffect(() => {
        AOS.init({
            offset: 200,
            duration: 800,
            easing: 'ease-in-sine',
            delay: 100,
        });
    }, []);
  return (
    <>
        <div data-aos="zoom-in" data-aos-delay="200" className='flex flex-col justify-center items-center gap-4'>
            <img src={imagem} alt='' className='size-16 transform hover:scale-105 transition-transform duration-300 cursor-pointer' /> 
            <h1 className='text-2xl text-black font-semibold'>{descricao}</h1>
            <button className='px-10 py-3 bg-black text-white text-md font-semibold rounded-xl hover:bg-custombrown hover:text-white cursor-pointer'>Fazer Marcação</button>
        </div>
    </>
  )
}

export default ServicosHero
