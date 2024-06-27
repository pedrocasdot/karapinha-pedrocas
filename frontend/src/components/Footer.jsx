import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">Karapinha</h2>
          <p className="text-sm">O melhor salão da banda.</p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end">
          <a href="#" className="text-sm mx-2 hover:text-gray-400">Sobre</a>
            <a href="#" className="text-sm mx-2 hover:text-gray-400">Serviços</a>
            <a href="#" className="text-sm mx-2 hover:text-gray-400">Contato</a>
        </div>
        <div className="mt-4 md:mt-0">
          <p className="text-sm">&copy; {new Date().getFullYear()} Karapinha. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
