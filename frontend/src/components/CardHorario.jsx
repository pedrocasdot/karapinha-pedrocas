import React, { useEffect } from 'react'
import AOS from 'aos'
import { Link } from 'react-router-dom'
import 'aos/dist/aos.css'

const CardHorario = ({ descricao, preco }) => {
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
            <div data-aos="zoom-in" className='flex flex-col justify-center items-center gap-10 bg-white p-10 rounded-xl md:w-[40%] w-full'>
                <h1 className='text-themeyellow text-4xl font-bold'>
                    HORÁRIO DE SERVIÇO
                </h1>
                <div className='flex flex-col justify-center items-center gap-4'>
                    <p className='text-xl text-black font-lg'>DOMINGO 9:00 - 19:30</p>
                    <p className='text-xl text-black font-lg'>SEGUNDA-FEIRA 9:00 - 19:30</p>
                    <p className='text-xl text-black font-lg'>TERÇA-FEIRA 9:00 - 19:30</p>
                    <p className='text-xl text-black font-lg'>QUARTA-FEIRA 9:00 - 19:30</p>
                    <p className='text-xl text-black font-lg'>QUINTA-FEIRA 9:00 - 19:30</p>
                    <p className='text-xl text-black font-lg'>SEXTA-FEIRA 9:00 - 19:30</p>
                    <p className='text-xl text-black font-lg'>SÁBADO 9:00 - 19:30</p>
                </div>
                <Link to="/login">
                    <button className='px-10 py-4 rounded-xl border-2 border-black text-black font-semibold text-lg hover:bg-black hover:text-white mt-6'>
                        Fazer Marcação
                    </button>
                </Link>

            </div>
        </>
    )
}

export default CardHorario
