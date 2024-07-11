import React, { useState } from 'react';
import Modal from 'react-modal';

const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '400px',
    width: '100%',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: 'none',
  },
};

const RescheduleModal = ({ isOpen, onClose, onReschedule }) => {
  const [newDate, setNewDate] = useState('');

  const handleReschedule = () => {
    console.log(newDate)
    if (!newDate.length) {
      alert("Por favor, selecione uma nova data e hora.");
      return;
    }
    onClose();
    onReschedule(newDate);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customModalStyles}
      contentLabel="Reagendar Marcação"
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Reagendar Marcação</h2>
        <label className="block text-gray-700 text-sm font-bold mb-2">Nova Data:</label>
        <input
          type="date"
          value={newDate}
          min={getCurrentDate()}
          onChange={(e) => setNewDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        />
        <div className="flex justify-center">
          <button
            onClick={handleReschedule}
            className="bg-custombrown hover:bg-custombrown1 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Salvar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RescheduleModal;
