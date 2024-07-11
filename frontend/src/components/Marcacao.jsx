import React, { useState, useEffect, useContext, useRef } from 'react';
import jsPDF from 'jspdf';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TimePicker from 'react-time-picker';
import Modal from 'react-modal';
import logo from '../assets/images/logo.png';
import { UserContext } from '../services/UserContext';
import { customStyles } from '../services/custom';
import {
  getAllProfessionals, getAllCategories, getAllServices, getProfissionalById,
  registerAppointment, getCategoryById, getAllAppointments,
  getServiceById, deleteAppointment, getProfissinalHorarioById, confirmarReagendamento
} from '../services/apiService';
import { FaShoppingCart } from 'react-icons/fa';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './MyDocument';
import 'jspdf-autotable'; 
import ClipLoader from 'react-spinners/ClipLoader';

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
  const [cart, setCart] = useState([]); 

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [isCartOpen, setIsCartOpen] = useState(false); 
  const cartRef = useRef(null); 

  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true); 

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
        const userMarcacoesPendentes = marcacoesFromApi.filter(marcacao => marcacao.userId === user.id && marcacao.status === false);
        setBookings(userMarcacoesPendentes);
      } catch (error) {
        console.error('Erro ao buscar marcacoes:', error);
      } finally {
        setLoading(false); 
      }
    }

    fetchMarcacoes();
    fetchCategories();
  }, [user.id]);



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
    return currentDate;
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleGeneratePDF = (bookings) => {
    const doc = new jsPDF();
    let yOffset = 10;


    const img = new Image();
    img.src = logo;
    doc.addImage(img, 'PNG', 15, 10, 30, 30);

    doc.setFontSize(10);
    doc.text(`Fatura de Agendamentos para ${user.nomeCompleto}`, 55, 25);

    yOffset += 40; // Ajuste a altura conforme necessário
    // Cabeçalhos da tabela
    const headers = [['Categoria', 'Serviço', 'Profissional', 'Data', 'Hora', 'Preço']];
    const data = bookings.map(booking => [
      booking.category,
      booking.service,
      booking.professional,
      booking.date,
      booking.time,
      `KZ ${booking.price.toFixed(2)}`
    ]);

    
    doc.autoTable({
      startY: yOffset,
      head: headers,
      body: data,
      theme: 'grid',
      styles: { fontSize: 12 },
    });

    // Adiciona rodapé opcional
    const totalPrice = bookings.reduce((total, booking) => total + booking.price, 0);
    doc.text(`Total: KZ ${totalPrice.toFixed(2)}`, 15, doc.autoTable.previous.finalY + 10);

    
    doc.save(`agendamentos-${user.nomeCompleto}.pdf`);
  };

  const handleAddToCart = () => {
    const selectedCategoryObj = categories.find(cat => cat.name.toLowerCase() === category.toLowerCase());
    const selectedServiceObj = services.find(ser => ser.serviceName.toLowerCase() === service.toLowerCase());
    const selectedProfessionalObj = professionals.find(prof => prof.nome.toLowerCase() === professional.toLowerCase());

    const newBooking = {
      category,
      service,
      professional,
      date,
      time,
      price,
      user,
      idCategory: selectedCategoryObj ? selectedCategoryObj.id : null,
      idService: selectedServiceObj ? selectedServiceObj.id : null,
      idProfissional: selectedProfessionalObj ? selectedProfessionalObj.id : null
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

  const handleConfirmarReagendamento = async (index) => {
    try {
      await confirmarReagendamento(bookings[index].id);
      bookings[index].reschedule = false;
      setBookings(bookings);
      setModalMessage("A confirmação de reagendamento foi feita com sucesso!");
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    } catch (error) {
      console.log(error);
      setModalMessage("Algum erro aconteceu, não foi possível confirmar o reagendamento!");
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    }
  };

  const handleFinalizeBooking = async () => {
    setLoading(true); 
    setIsCartOpen(false);
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

        const newBooking = await registerAppointment(newAppointment);

        setBookings([...bookings, newBooking]);
      }

      handleGeneratePDF(cart); 
      setCart([]);
      
      setModalMessage('Agendamentos realizados com sucesso!');
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    } catch (error) {
      
      console.error('Erro ao registrar as marcações:', error);
      setModalMessage('Erro ao registrar as marcações. Tente novamente.');
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    } finally {
      setLoading(false); 
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
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <ClipLoader color="#4A90E2" loading={loading} size={50} />
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

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
                <td className="border px-4 py-2">{booking.servico.category.name}</td>
                <td className="border px-4 py-2">{booking.servico.serviceName}</td>
                <td className="border px-4 py-2">{booking.profissional.nome}</td>
                <td className="border px-4 py-2">{booking.appointmentDate}</td>
                <td className="border px-4 py-2">{booking.time}</td>
                <td className="border px-4 py-2">KZ {booking.servico.price.toFixed(2)}</td>
                <td className="border px-4 py-2">
                  {user && booking.reschedule === false ? (
                    <>
                      <button
                        onClick={() => handleDeleteBooking(index)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : 
                  <>
                      <button
                        onClick={() => handleDeleteBooking(index)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                      >
                        Cancelar
                      </button>

                      <button
                        onClick={() => handleConfirmarReagendamento(index)}
                        className="bg-custombrown hover:bg-custombrown1 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                      >
                        Confirmar Reagendamento
                      </button>
                    </>
                  
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
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
