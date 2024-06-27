import React, { useState, useEffect } from 'react';
import { getAllAppointments, getUserById, updateAppointment, getServiceById, getCategoryById, getProfissionalById } from '../services/apiService';
import Modal from 'react-modal'
import { customStyles } from '../services/custom';

Modal.setAppElement('#root');


const ConfirmarMarcacoes = () => {
  const [bookings, setBookings] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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
            categoryName: category.nome,
            professional: profissional.nome,
            status: marcacao.status,
          };
        }));
        const pendingBookings = detailedMarcacoes.filter(booking => booking.status === false);
        setBookings(pendingBookings);
      } catch (error) {
        console.error('Erro ao buscar marcações:', error);
    }
    }

    fetchMarcacoes();
  }, []);

  const handleConfirmBooking = async (index) => {
    const updatedBookings = [...bookings];
    updatedBookings[index].status = true;

    const bookingToUpdate = {
      id: updatedBookings[index].id,
      serviceId: updatedBookings[index].serviceId,
      userId: updatedBookings[index].userId,
      profissionalId: updatedBookings[index].professionalId,
      time: updatedBookings[index].time,
      appointmentDate: updatedBookings[index].appointmentDate,
      status: true,
    };

    try {
      await updateAppointment(bookingToUpdate);
      const booking = updatedBookings[index];
      const emailContent = `
        Sua marcação foi confirmada!
        Categoria: ${booking.categoryName}
        Serviços: ${booking.serviceName}
        Profissional: ${booking.professional}
        Data: ${booking.appointmentDate}
        Hora: ${booking.time}
      `;
      // await sendEmail({
      //   to: booking.clientEmail,
      //   subject: 'Confirmação de Marcação',
      //   text: emailContent,
      // });
      //console.log(`Email sent to ${booking.clientEmail}: ${emailContent}`);
      setModalMessage("A marcação foi comfirmada com sucesso!");
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);

      setBookings(updatedBookings.filter((_, i) => i !== index));
    } catch (error) {
      setModalMessage("Ocorreu um erro ao confirmar a marcação!");
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 300);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Confirmar Pedidos de Marcação</h1>
        <div className="mb-4 overflow-y-auto" style={{ maxHeight: '400px', width: '1100px' }}>
          <label className="block text-gray-700 text-sm font-bold mb-2">Pedidos de Marcação:</label>
          <table className="min-w-full divide-gray-200" style={{ width: '800px' }}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Email do Cliente</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Serviços</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Profissional</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Hora</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking, index) => (
                <tr key={booking.id}>
                  <td className="px-8 py-4 whitespace-nowrap">{booking.clientEmail}</td>
                  <td className="px-8 py-4 whitespace-nowrap">{booking.serviceName}</td>
                  <td className="px-8 py-4 whitespace-nowrap">{booking.professional}</td>
                  <td className="px-8 py-4 whitespace-nowrap">{booking.appointmentDate}</td>
                  <td className="px-8 py-4 whitespace-nowrap">{booking.time}</td>
                  <td className="px-8 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleConfirmBooking(index)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                      disabled={booking.status !== false}
                    >
                      Confirmar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
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
    </div>
  );
};

export default ConfirmarMarcacoes;