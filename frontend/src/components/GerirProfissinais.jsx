import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal'
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import pt from 'date-fns/locale/pt';
import { getAllCategories, getAllProfessionals, registerProfissinal, deleteProfissional, getProfissinalHorarioById } from '../services/apiService';
import { customStyles } from '../services/custom';
// Register Portuguese locale
registerLocale('pt', pt);
setDefaultLocale('pt');


Modal.setAppElement('#root');

const GerirProfissionais = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');
  const [idCard, setIdCard] = useState('');
  const [phone, setPhone] = useState('');
  const [schedules, setSchedules] = useState([null]);
  const [professionals, setProfessionals] = useState([]);
  const [categories, setCategories] = useState([]);


  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleIdCardChange = (e) => {
    setIdCard(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleScheduleChange = (index, date) => {
    const newSchedules = [...schedules];
    newSchedules[index] = date;
    setSchedules(newSchedules);
  };

  const handleAddSchedule = () => {
    setSchedules([...schedules, null]);
  };

  const handleRemoveSchedule = (index) => {
    const newSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(newSchedules);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesFromApi = await getAllCategories();
        setCategories(categoriesFromApi);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    }

    async function fetchProfessionals() {
      try {
        const professionalsFromApi = await getAllProfessionals();
        setProfessionals(professionalsFromApi);
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
      }
    }

    fetchCategories();
    fetchProfessionals();
  }, []);

  const handleAddProfessional = async () => {
    let newProfessional = {
      nome: name,
      categoryId: categories.find(cat => cat.name.toLowerCase() === category.toLowerCase()).id,
      email: email,
      telemovel: phone,
      bi: idCard,
      // horarios: schedules.map(schedule => schedule && schedule.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })),
    };

    try {
      await registerProfissinal(newProfessional);
      const prof = {
        nome: name,
        categoryId: newProfessional.categoryId,
        email: email,
        telemovel: phone,
        bi: idCard,
      };

      setProfessionals([...professionals, prof]);

      setName('');
      setCategory('');
      setEmail('');
      setIdCard('');
      setPhone('');
      setSchedules([null]);
    } catch (error) {
      console.error('Erro ao adicionar profissional:', error);
    }
  };

  const handleDeleteProfessional = async (id) => {
    try {
      await deleteProfissional(id);
      const updatedProfessionals = professionals.filter(professional => professional.id !== id);
      setProfessionals(updatedProfessionals);
      setModalMessage("Profissional foi deletado com sucesso!");
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    } catch (error) {
      setModalMessage("Não foi possível deletar o profissional o profissional");
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
      console.error('Erro ao deletar profissional:', error);
    }
  };

  const startTime = new Date();
  startTime.setHours(9, 0, 0); // Define 09:00 como horário inicial

  const endTime = new Date();
  endTime.setHours(19, 30, 0); // Define 19:30 como horário final

  const CustomDatePickerInput = ({ value, onClick }) => (
    <input
      type="text"
      value={value}
      onClick={onClick}
      readOnly
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  );

  return (
    <div className="flex justify-center items-center w-full">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Gestão de Profissionais</h1>
        <div>
          <div className="mb-4 overflow-y-auto" style={{ maxHeight: '400px', width: '1100px' }}>
            <label className="block text-gray-700 text-sm font-bold mb-2">Profissionais Registrados:</label>
            <table className="min-w-full divide-gray-200" style={{ width: '800px' }}>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Telemóvel</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {professionals.map((professional, index) => (
                  <tr key={index}>
                    <td className="px-8 py-4 whitespace-nowrap">{professional.nome}</td>
                    <td className="px-8 py-4 whitespace-nowrap">{professional.category.name}</td>
                    <td className="px-8 py-4 whitespace-nowrap">{professional.email}</td>
                    <td className="px-8 py-4 whitespace-nowrap">{professional.telemovel}</td>
                    <td className="px-8 py-4 whitespace-nowrap">

                      <button
                        onClick={() => handleDeleteProfessional(professional.id)}
                        className="bg-custombrown hover:bg-custombrown1 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                      >
                        Ver Horário
                      </button>
                      <button
                        onClick={() => handleDeleteProfessional(professional.id)}
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
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nome do Profissional:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Categoria:</label>
                  <select
                    value={category}
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
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
              </form>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Bilhete:</label>
                <input
                  type="text"
                  value={idCard}
                  onChange={handleIdCardChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Telemóvel:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Horários:</label>
                {schedules.map((schedule, index) => (
                  <div key={index} className="flex mb-2">
                    <DatePicker
                      selected={schedule}
                      onChange={(date) => handleScheduleChange(index, date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Hora"
                      dateFormat="HH:mm"
                      locale="pt"
                      minTime={startTime}
                      maxTime={endTime}
                      customInput={<CustomDatePickerInput />}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSchedule(index)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                    >
                      Remover
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddSchedule}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Adicionar Horário
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={handleAddProfessional}
            className="bg-custombrown hover:bg-custombrown1 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
          >
            Registrar
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

export default GerirProfissionais;
