import React, { useState, useEffect } from 'react';
import { getAllAppointments, getUserById, updateAppointment, getServiceById, getCategoryById, getProfissionalById, confirmarMarcacao, reangendarMarcacao} from '../services/apiService';
import Modal from 'react-modal';
import { customStyles } from '../services/custom';
import { ClipLoader } from 'react-spinners';
import RescheduleModal from './RescheduleModal';

Modal.setAppElement('#root');

const ConfirmarMarcacoes = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [detailModalIsOpen, setDetailModalIsOpen] = useState(false);
  const [rescheduleModalIsOpen, setRescheduleModalIsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    async function fetchMarcacoes() {
      try {
        const marcacoes = await getAllAppointments();
        const detailedMarcacoes = await Promise.all(marcacoes.map(async (marcacao) => {
          const user = await getUserById(marcacao.userId);
          const service = await getServiceById(marcacao.serviceId);
          const category = await getCategoryById(service.categoryId);
          const profissional = await getProfissionalById(marcacao.profissionalId);
          return {
            ...marcacao,
            clientEmail: user.enderecoEmail,
            clientName: user.nomeCompleto,
            clientId: user.id,
            serviceId: service.id,
            professionalId: profissional.id,
            serviceName: service.serviceName,
            categoryName: category.name,
            professional: profissional.nome,
            status: marcacao.status,
          };
        }));
        
        const pendingBookings = detailedMarcacoes.filter(booking => booking.status === false);
        console.log(pendingBookings);
        setBookings(pendingBookings);
      } catch (error) {
        console.error('Erro ao buscar marcações:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMarcacoes();
  }, []);

  const handleConfirmBooking = async (index) => {
    setLoading(true);
    const updatedBookings = [...bookings];
    updatedBookings[index].status = true;

    try {
      const booking = updatedBookings[index];
      await confirmarMarcacao(booking.id);

      setModalMessage("A marcação foi confirmada com sucesso!");
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
      setBookings(updatedBookings.filter((_, i) => i !== index));
    } catch (error) {
      setModalMessage("Ocorreu um erro ao confirmar a marcação!");
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailModalIsOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenRescheduleModal = (booking) => {
    setSelectedBooking(booking);
    setRescheduleModalIsOpen(true);
  };

  const handleRescheduleBooking = async (newDate) => {
    if (!newDate.length) {
      setModalMessage("Por favor, selecione uma nova data e hora.");
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
      return;
    }

    setLoading(true);

    try {
      const updatedBooking = {
        ...selectedBooking,
        appointmentDate: newDate,
      };
      await reangendarMarcacao(selectedBooking.id, updatedBooking);
      setBookings(bookings.map(booking => booking.id === selectedBooking.id ? updatedBooking : booking));
      setModalMessage("A marcação foi reagendada com sucesso!");
      setRescheduleModalIsOpen(false);
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    } catch (error) {
      setModalMessage("Ocorreu um erro ao reagendar a marcação!");
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start h-screen mt-4">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Confirmar Pedidos de Marcação</h1>
        <div className="mb-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
          <label className="block text-gray-700 text-sm font-bold mb-2">Pedidos de Marcação:</label>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader size={200} color={"#123abc"} loading={loading} />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Email do Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Serviços</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Profissional</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Hora</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking, index) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.clientEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.serviceName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.professional}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.appointmentDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleConfirmBooking(index)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 disabled:bg-gray-500"
                        disabled={booking.reschedule === true}
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                      >
                        Ver Detalhes
                      </button>
                      <button
                        onClick={() => handleOpenRescheduleModal(booking)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Reagendar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Mensagem do Sistema"
      >
        <div>{modalMessage}</div>
      </Modal>
      <Modal
        isOpen={detailModalIsOpen}
        onRequestClose={() => setDetailModalIsOpen(false)}
        style={customStyles}
        contentLabel="Detalhes da Marcação"
      >
        {selectedBooking && (
          <div>
            <h2 className="text-2xl mx-auto font-bold mb-4">Detalhes da Marcação</h2>
            <p><strong>Nome do Cliente:</strong> {selectedBooking.clientName}</p>
            <p><strong>Email do Cliente:</strong> {selectedBooking.clientEmail}</p>
            <p><strong>Serviço:</strong> {selectedBooking.serviceName}</p>
            <p><strong>Preço:</strong> {selectedBooking.servico.price} AOA</p>
            
            <p><strong>Categoria:</strong> {selectedBooking.categoryName}</p>
            <p><strong>Profissional:</strong> {selectedBooking.professional}</p>
            <p><strong>Data:</strong> {selectedBooking.appointmentDate}</p>
            <p><strong>Hora:</strong> {selectedBooking.time}</p>
            <div className="mt-4">
              <button
                onClick={handlePrint}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Imprimir
              </button>
            </div>
          </div>
        )}
      </Modal>
      <RescheduleModal
        isOpen={rescheduleModalIsOpen}
        onClose={() => setRescheduleModalIsOpen(false)}
        onReschedule={handleRescheduleBooking}
      />
    </div>
  );
};

export default ConfirmarMarcacoes;
