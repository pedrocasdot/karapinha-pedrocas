import React, { useState, useEffect, useContext, useRef } from 'react';
import jsPDF from 'jspdf';
import Modal from 'react-modal';
import logo from '../assets/images/logo.png';
import { UserContext } from '../services/UserContext';
import { customStyles } from '../services/custom';
import {
  getAllProfessionals, getAllCategories, getAllServices, getProfissionalById,
  registerAppointment, getCategoryById, getAllAppointments,
  getServiceById, deleteAppointment
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
          if (!isConflict) {
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
    setProfessional(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleGeneratePDF = (booking) => {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Adicionar logo e nome da empresa
    const logoImg = new Image();
    logoImg.src = logo;
    doc.addImage(logoImg, 'PNG', 10, 10, 40, 40);
    doc.setFontSize(18);
    doc.text('KARAPINHA XPTO', 60, 30);

    // Adicionar detalhes da reserva
    doc.setFontSize(14);
    doc.text(`Categoria: ${booking.category}`, 10, 60);
    doc.text(`Serviço: ${booking.service}`, 10, 70);
    doc.text(`Profissional: ${booking.professional}`, 10, 80);
    doc.text(`Data: ${booking.date}`, 10, 90);
    doc.text(`Hora: ${booking.time}`, 10, 100);
    doc.text(`Preço: KZ ${price.toFixed(2)}`, 10, 110);
    doc.text(`Cliente: ${user.nomeCompleto}`, 10, 120);
    doc.text(`Email do Cliente: ${user.enderecoEmail}`, 10, 130);

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${totalPages}`, doc.internal.pageSize.width - 50, doc.internal.pageSize.height - 10);
    }

    doc.save('agendamento.pdf');
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

    setCart([...cart, newBooking]);

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
  const handleDeleteBooking = async(index) => {
    try{
      await deleteAppointment(bookings.at(index).id);
      const updatedBookings = bookings.filter((item, i) => i !== index);
      setBookings(updatedBookings);
      setModalMessage("Marcação foi removida com sucesso!");
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    }catch(error){
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
          serviceId: services.find(ser => ser.serviceName.toLowerCase() === booking.service.toLowerCase()).id,
          categoryId: categories.find(cat => cat.name.toLowerCase() === booking.category.toLowerCase()).id,
          profissionalId: professionals.find(prof => prof.nome.toLowerCase() === booking.professional.toLowerCase()).id,
          status: false,
          time: booking.time,
          appointmentDate: booking.date,
          userId: user.id
        };

        await registerAppointment(newAppointment);
        setBookings([...bookings, booking]);
        handleGeneratePDF(booking);
      }

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
    <div className="flex justify-center items-center h-screen">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">Agendamento de Salão de Beleza</h1>
          <div className="relative" ref={cartRef}>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative bg-custombrown text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              <FaShoppingCart />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
            {isCartOpen && (
              <div className="absolute right-0 w-64 bg-white shadow-lg rounded p-4 mt-2 z-10">
                <h2 className="text-lg font-bold mb-2">Itens no Carrinho:</h2>
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <div>
                      <p>{item.service} com {item.professional}</p>
                      <p>{item.date} às {item.time}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(index)}
                      className="bg-red-500 text-white rounded px-2 py-1"
                    >
                      Remover
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleFinalizeBooking}
                  className="bg-custombrown1  text-white font-bold py-2 px-4 rounded mt-2"
                >
                  Finalizar Agendamentos
                </button>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-4 overflow-y-auto" style={{ maxHeight: '400px', width: '1100px' }}>
            <label className="block text-white text-sm font-bold mb-2">Marcações Agendadas:</label>
            <table className="min-w-full divide-gray-200" style={{ width: '800px' }}>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Serviço</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Profissional</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Hora</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings
                  .filter(book => book.user.id == user.id)
                  .map((booking, index) => (
                    <tr key={index}>
                      <td className="px-8 py-4 whitespace-nowrap">{booking.category}</td>
                      <td className="px-8 py-4 whitespace-nowrap">{booking.service}</td>
                      <td className="px-8 py-4 whitespace-nowrap">{booking.professional}</td>
                      <td className="px-8 py-4 whitespace-nowrap">{booking.date}</td>
                      <td className="px-8 py-4 whitespace-nowrap">{booking.time}</td>
                      <td className="px-8 py-4 whitespace-nowrap">KZ {booking.price.toFixed(2)}</td>
                      <td className="px-8 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteBooking(index)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                        >
                          Excluir
                        </button>
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <form>
                <div className="mb-4">
                  <label className="block text-white text-sm font-bold mb-2">Categoria:</label>
                  <select
                    onChange={handleCategoryChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>
                {category && (
                  <>
                    <div className="mb-4">
                      <label className="block text-white text-sm font-bold mb-2">Serviços:</label>
                      <select
                        onChange={handleServiceChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required>
                        <option value="">Selecione um serviço</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.serviceName}>{service.serviceName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-white text-sm font-bold mb-2">Profissional:</label>
                      <select
                        onChange={handleProfessionalChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      >
                        <option value="">Selecione um profissional</option>
                        {professionals.map((professional) => (
                          <option key={professional.id} value={professional.nome}>{professional.nome}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </form>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2">Data:</label>
                <input
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="time-picker" className="block text-white text-sm font-bold mb-2">Hora:</label>
                <input
                  id='time-picker'
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
          </div>

        </div>
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={handleAddToCart}
            className="bg-custombrown hover:bg-custombrown1 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
          >
            Adicionar ao Carrinho
          </button>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={customStyles}
          contentLabel="Mensagem do Sistema"
        >
          <div>{modalMessage}</div>
        </Modal>
      </div>
    </div>
  );
};

export default Marcacao;

