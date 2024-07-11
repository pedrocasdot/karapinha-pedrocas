import React, { useState, useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ptBR } from 'date-fns/locale'; // Importa a localização em português

import { format , isAfter} from 'date-fns';
import { getAllAppointments } from '../services/apiService';
import ClipLoader from 'react-spinners/ClipLoader';

const ConsultarAgendaMensal = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [data, setData] = useState([]); // Adicionando estado para armazenar dados da tabela
  const [markedDates, setMarkedDates] = useState(new Set()); // Adiciona estado para armazenar datas com marcações

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const marcacoes = await getAllAppointments();
        

        const currentDate = new Date();
        const marcacoesPendentes = marcacoes.filter(marcacao_ => 
          marcacao_.status === true && isAfter(new Date(marcacao_.appointmentDate), currentDate)
        );
        
        setAppointments(marcacoesPendentes);
    
        const datesWithAppointments = new Set(
          marcacoesPendentes.map(appointment => format(new Date(appointment.appointmentDate), 'yyyy-MM-dd'))
        );
        setMarkedDates(datesWithAppointments);
      } catch (error) {
        console.error('Erro ao buscar marcações:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  // Função para obter marcações para a data selecionada
  const getAppointmentsForDate = async (date) => {
    const novaData = formatDate(date);
    let pattern = [];
    setLoadingDetail(true);
    try {
      const appointmentsForDate = appointments.filter(appointment => appointment.appointmentDate === novaData);
      pattern = appointmentsForDate.map(appointment => ({
        clientName: appointment.user.nomeCompleto,
        serviceName: appointment.servico.serviceName,
        professional: appointment.profissional.nome,
        time: appointment.time
      }));
    } catch (error) {
      console.error('Erro ao buscar marcações para o dia:', error);
    } finally {
      setLoadingDetail(false);
      setData(pattern); // Atualiza o estado com os dados da tabela
    }
  };

  const formatDate = (date) => {
    return format(date, 'yyyy-MM-dd');
  };

  useEffect(() => {
    getAppointmentsForDate(selectedDate); // Atualiza os dados da tabela quando a data selecionada muda
  }, [selectedDate]);

  const columns = useMemo(
    () => [
      {
        Header: 'Hora',
        accessor: 'time',
      },
      {
        Header: 'Cliente',
        accessor: 'clientName',
      },
      {
        Header: 'Profissional',
        accessor: 'professional',
      },
      {
        Header: 'Serviço',
        accessor: 'serviceName',
      },
    ],
    []
  );

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = format(date, 'yyyy-MM-dd');
      return markedDates.has(dateString) ? 'bg-blue-200 text-blue-800 rounded-full' : null;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto flex flex-col lg:flex-row lg:space-x-8 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Calendário */}
        <div className="lg:w-1/2 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-center">Agenda Mensal</h1>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            locale={ptBR}
            tileClassName={tileClassName} 
            className="w-full rounded-lg border border-gray-300 shadow-md"
          />
        </div>

        {/* Tabela de Marcações */}
        <div className="lg:w-1/2 p-6 bg-white rounded-lg shadow-lg">
          {loadingDetail ? (
            <div className="flex justify-center items-center h-32">
              <ClipLoader size={50} color={"#123abc"} loading={loadingDetail} />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4">
                Marcações para {format(selectedDate, 'dd/MM/yyyy')}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      {columns.map((column) => (
                        <th key={column.accessor} className="p-3 text-left text-sm font-semibold uppercase tracking-wider">
                          {column.Header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        {columns.map((column) => (
                          <td key={column.accessor} className="p-3 text-sm text-gray-700">
                            {row[column.accessor] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length === 0 && (
                  <p className="text-center text-gray-500 mt-4">Nenhuma marcação para esta data.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultarAgendaMensal;
