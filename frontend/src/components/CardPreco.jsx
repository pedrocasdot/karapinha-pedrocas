import React, {useEffect} from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const CardPreco = ({descricao, categoria, preco}) => {
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
        <div className='flex justify-between items-center gap-3 border-b-2 border-themeyellow pb-5'>
          <h1 className='text-1xl text-gray-900 font-bold'>{categoria + " - " + descricao}</h1>
          <h1 className='text-1xl text-custombrown font-bold'>{preco} KZ</h1>
        </div>
    </>
  )
}

export default CardPreco
