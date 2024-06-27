import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import mainImage from '../assets/images/hero.jpg'
import ServicosHero from '../components/ServicosHero'
import { FaLocationDot } from 'react-icons/fa6'
import { MdOutlinePhoneAndroid } from 'react-icons/md'
import { FaHeadphones } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import tesoura from '../assets/images/sissor.png'
import cabeloHomem from '../assets/images/menshair.png'
import podador from '../assets/images/trimmer.png'
import cabeloFeminino from '../assets/images/womenhair.png'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Hero = () => {
    useEffect(() => {
        AOS.init({
            offset: 200,
            duration: 800,
            easing: 'ease-in-sine',
            delay: 100,
        });
    }, []);

    return (
    <div>
        <>
            <section id ='hero' className='w-full md:px-[120px] mt-20 px-10 flex flex-col md:flex-row justify-center items-center gap-20'>
                <div id ='content-box' className='flex flex-col justify-center items-start gap-10'>
                    <h1 data-aos="zoom-in" className='text-2xl text-black font-semibold'>
                        SEJA BEM-VINDO
                    </h1>
                    <h1 data-aos="zoom-in" className='text-6xl text-custombrown font-bold'>
                        KARAPINHA <br></br> o melhor salão da <br></br> banda
                    </h1>
                    <div data-aos ="slide-up" id='icon-list' className='flex flex-col justify-center items-start gap-6'>
                        <div id='icon-box' className='flex justify-center items-center gap-3'>
                            <FaLocationDot className='text-black size-6' />
                            <h1 className='text-xl text-gray-800 font-semibold'>Angola, Luanda, Centralidade do Kilamba, Bloco D21 Apt 74</h1>
                        </div>
                        <div id='icon-box' className='flex justify-center items-center gap-3'>
                            <MdOutlinePhoneAndroid className='text-black size-6' />
                            <h1 className='text-xl text-gray-800 font-semibold'>+244 945402382</h1>
                        </div>
                        <div id='icon-box' className='flex justify-center items-center gap-3'>
                            <MdEmail className='text-black size-6' />
                            <h1 className='text-xl text-gray-800 font-semibold'>karapinhaxpto@karapinha.com</h1>
                        </div>
                      
                    </div>
                    <Link to="/login">
                        <button data-aos ='zoom-in' className='px-10 py-4 rounded-xl border-2 border-black text-black font-semibold text-lg hover:bg-black hover:text-white'>
                            Fazer Login
                        </button>
                    </Link>
                </div>
                <div data-aos ="zoom-in" id='image-box' className='md:w-[50%] w-full mt-15'>
                    <img src={mainImage} alt='' className='rounded-md w-full md:h-[700px] h-[450px]'></img>
                </div>
            </section>

            <section className='grid grid-cols-1 md:grid-cols-4 justify-center items-start w-full md:px-[120px] px-10 py-10 gap-10'>
                <ServicosHero imagem={tesoura} descricao="Corte de Cabelo Regular" />
                <ServicosHero imagem={cabeloHomem} descricao="Cabelo Homem" />
                <ServicosHero imagem={podador} descricao="Fazer a barba" />
                <ServicosHero imagem={cabeloFeminino} descricao="Cabelo Feminino" />
            </section>
        </>
    </div>
  )
}

export default Hero
