import React, { useState, useEffect, useContext, useRef } from 'react';
import jsPDF from 'jspdf';
import TimePicker from 'react-time-picker'; // 
import Modal from 'react-modal';
import logo from '../assets/images/logo.png';
import { UserContext } from '../services/UserContext';
import { customStyles } from '../services/custom';
import {
  getAllProfessionals, getAllCategories, getAllServices, getProfissionalById,
  registerAppointment, getCategoryById, getAllAppointments,
  getServiceById, deleteAppointment, getProfissinalHorarioById
} from '../services/apiService';
import { FaShoppingCart } from 'react-icons/fa';

Modal.setAppElement('#root');

const Marcacao = () => {
  const [category, setCategory] = useState('');
  const [service, setService] = useState('');
  const [services, setServices] = useState([]);
  const [professional, setProfessional] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [bookings, setBookings] = useState([]);
  const [price, setPrice] = useState(0);

  const [categories, setCategories] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [cart, setCart] = useState([]); // Estado do carrinho

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [isCartOpen, setIsCartOpen] = useState(false); // Estado do carrinho expandido
  const cartRef = useRef(null); // Referência para o carrinho

  const { user } = useContext(UserContext);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesFromApi = await getAllCategories();
        setCategories(categoriesFromApi);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    }

    async function fetchMarcacoes() {
      try {
        const marcacoesFromApi = await getAllAppointments();
        marcacoesFromApi.map(async (marcacao) => {
          const prof = await getProfissionalById(marcacao.profissionalId);
          const serv = await getServiceById(marcacao.serviceId);
          const cat = await getCategoryById(serv.categoryId);

          const marcacao_ = {
            id: marcacao.id,
            category: cat.name,
            service: serv.serviceName,
            professional: prof.nome,
            date: marcacao.appointmentDate,
            time: marcacao.time,
            price: serv.price,
            user: user
          };

          const isConflict = bookings.some(
            booking =>
              booking.date === marcacao_.date &&
              booking.time === marcacao_.time
          );


          if (!isConflict && user.id === marcacao.userId) {
            setBookings([...bookings, marcacao_])
          }
        });
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    }

    fetchMarcacoes();
    fetchCategories();
  }, []);

  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    try {
      const idCat = categories.find(cat => cat.name.toLowerCase() === selectedCategory.toLowerCase()).id;
      const servicesFromApi = await getAllServices();
      const services = servicesFromApi.filter(service => service.categoryId === idCat);
      setServices(services);

      const professionalsFromApi = await getAllProfessionals();
      const filteredProfessionals = professionalsFromApi.filter(professional => professional.categoryId === idCat);

      setProfessionals(filteredProfessionals);
    } catch (error) {
      console.error('Erro ao buscar serviços e profissionais da categoria:', error);
    }
  };

  const handleServiceChange = (e) => {
    const selectedService = e.target.value;
    setService(selectedService);

    const selectedServiceObj = services.find(service => service.serviceName.toLowerCase() === selectedService.toLowerCase());
    if (selectedServiceObj) {
      setPrice(selectedServiceObj.price);
    }
  };

  const handleProfessionalChange = (e) => {
    const selectedProfessional = professionals.find(prof => prof.nome === e.target.value);
    const getHorarioProfissional = async () => {
      const horariosFromApi = await getProfissinalHorarioById(selectedProfessional.id);
      setHorarios(horariosFromApi);
      console.log(horarios);
    }

    getHorarioProfissional();
    setProfessional(e.target.value);

  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    console.log('Current date:', currentDate); // Lo
    return currentDate;
  };
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleGeneratePDF = (bookings) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    let totalPrice = 0;

    // Adicionar logo e nome da empresa
    const logoImg = new Image();
    logoImg.src = logo;
    doc.addImage(logoImg, 'PNG', 10, 10, 40, 40);
    doc.setFontSize(18);
    doc.text('KARAPINHA XPTO', 60, 30);

    // Adicionar título da fatura
    doc.setFontSize(16);
    doc.text('Fatura de Agendamentos', 10, 50);

    // Adicionar detalhes da reserva
    bookings.forEach((booking, index) => {
      const y = 70 + (index * 20); // Espaçamento entre os itens
      doc.setFontSize(14);
      doc.text(`Categoria: ${booking.category}`, 10, y);
      doc.text(`Serviço: ${booking.service}`, 10, y + 10);
      doc.text(`Profissional: ${booking.professional}`, 10, y + 20);
      doc.text(`Data: ${booking.date}`, 10, y + 30);
      doc.text(`Hora: ${booking.time}`, 10, y + 40);
      doc.text(`Preço: KZ ${booking.price.toFixed(2)}`, 10, y + 50);
      doc.line(10, y + 55, 200, y + 55); // Linha separadora
      totalPrice += booking.price;
    });

    // Adicionar preço total
    const finalY = 70 + (bookings.length * 20) + 10;
    doc.setFontSize(16);
    doc.text(`Preço Total: KZ ${totalPrice.toFixed(2)}`, 10, finalY);

    // Adicionar detalhes do cliente
    doc.setFontSize(14);
    doc.text(`Cliente: ${user.nomeCompleto}`, 10, finalY + 20);
    doc.text(`Email do Cliente: ${user.enderecoEmail}`, 10, finalY + 30);

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${totalPages}`, doc.internal.pageSize.width - 50, doc.internal.pageSize.height - 10);
    }

    doc.save(`agendamentos-${user.nomeCompleto}.pdf`);
  };

  const handleAddToCart = () => {
    const newBooking = {
      category,
      service,
      professional,
      date,
      time,
      price,
      user
    };

    const isConflict = cart.some(
      booking =>
        booking.date === date &&
        booking.time === time
    );

    if (isConflict) {
      setModalMessage('Já existe uma marcação para essa data e hora.');
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
      return;
    }
    const newBookingExtra = { ...newBooking, idProfissional: 1, idCategory: 1, idService: 1 };

    setCart([...cart, newBookingExtra]);

    setCategory('');
    setServices([]);
    setProfessional('');
    setProfessionals([]);
    setDate('');
    setTime('');
  };

  const handleRemoveFromCart = (index) => {
    const updatedCart = cart.filter((item, i) => i !== index);
    setCart(updatedCart);
  };

  const handleDeleteBooking = async (index) => {
    try {
      await deleteAppointment(bookings[index].id);
      const updatedBookings = bookings.filter((item, i) => i !== index);
      setBookings(updatedBookings);
      setModalMessage("Marcação foi removida com sucesso!");
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    } catch (error) {
      console.log(error);
      setModalMessage("Algum erro aconteceu, não foi possível remover a marcação!");
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    }
  };

  const handleFinalizeBooking = async () => {
    try {
      for (let booking of cart) {
        const newAppointment = {
          serviceId: booking.idService,
          categoryId: booking.idCategory,
          profissionalId: booking.idProfissional,
          status: false,
          time: booking.time,
          appointmentDate: booking.date,
          userId: user.id
        };

        await registerAppointment(newAppointment);
        setBookings([...bookings, booking]);
       
      }
      handleGeneratePDF(bookings);
      setCart([]);
      setModalMessage('Agendamentos realizados com sucesso!');
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    } catch (error) {
      console.error('Erro ao registrar as marcações:', error);
      setModalMessage('Erro ao registrar as marcações. Tente novamente.');
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen]);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-custombrown">Agendamento de Salão de Beleza</h1>
        <div className="relative" ref={cartRef}>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="flex items-center bg-custombrown hover:bg-custombrown1 text-white font-bold px-4 py-2 rounded focus:outline-none"
          >
            <FaShoppingCart className="mr-2" />
            Carrinho ({cart.length})
          </button>
          {isCartOpen && cart.length > 0 && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-10">
              <div className="py-2 px-3 bg-gray-200 text-gray-800 font-semibold">
                Carrinho de Agendamentos
              </div>
              <div className="divide-y">
                {cart.map((booking, index) => (
                  <div key={index} className="py-2 px-3">
                    <p className="text-sm font-medium">{booking.date}, {booking.time}</p>
                    <p className="text-sm">{booking.service}</p>
                    <button
                      className="text-xs text-red-500 mt-1 hover:text-red-700 focus:outline-none"
                      onClick={() => handleRemoveFromCart(index)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleFinalizeBooking}
                className="block w-full py-2 px-4 bg-custombrown text-white text-center font-bold hover:bg-custombrown1 focus:outline-none"
              >
                Finalizar Agendamentos
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">
            Categoria
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="categoria"
            onChange={handleCategoryChange}
            value={category}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category, index) => (
              <option key={index} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>

        {services.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="servico">
              Serviço
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="servico"
              onChange={handleServiceChange}
              value={service}
            >
              <option value="">Selecione um serviço</option>
              {services.map((service, index) => (
                <option key={index} value={service.serviceName}>{service.serviceName}</option>
              ))}
            </select>
          </div>
        )}

        {professionals.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profissional">
              Profissional
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="profissional"
              onChange={handleProfessionalChange}
              value={professional}
            >
              <option value="">Selecione um profissional</option>
              {professionals.map((professional, index) => (
                <option key={index} value={professional.nome}>{professional.nome}</option>
              ))}
            </select>
          </div>
        )}

      

        {professional && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
              Hora
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="time"
              onChange={handleTimeChange}
              value={time}
            >
              <option value="">Selecione um horário</option>
              {horarios.map((horario, index) => (
                <option key={index} value={horario}>{horario}</option>
              ))}
            </select>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="data">
            Data
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="data"
            type="date"
            onChange={handleDateChange}
            value={date}
            min={getCurrentDate()}
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            className="bg-custombrown hover:bg-custombrown1 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Agendar
          </button>
        </div>
      </div>

      {bookings.length > 0 && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-bold mb-4">Suas Marcações</h2>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Categoria</th>
                <th className="px-4 py-2">Serviço</th>
                <th className="px-4 py-2">Profissional</th>
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Hora</th>
                <th className="px-4 py-2">Preço</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index} className="text-gray-700">
                  <td className="border px-4 py-2">{booking.category}</td>
                  <td className="border px-4 py-2">{booking.service}</td>
                  <td className="border px-4 py-2">{booking.professional}</td>
                  <td className="border px-4 py-2">{booking.date}</td>
                  <td className="border px-4 py-2">{booking.time}</td>
                  <td className="border px-4 py-2">KZ {booking.price.toFixed(2)}</td>
                  <td className="border px-4 py-2">
                    {user && (
                      <>
                        <button
                          onClick={() => handleDeleteBooking(index)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleGeneratePDF(booking)}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                        >
                          PDF
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Mensagem do Sistema"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Atenção</h2>
        <p className="text-gray-800 text-center">{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default Marcacao;
