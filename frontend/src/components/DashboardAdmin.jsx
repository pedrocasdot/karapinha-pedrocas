import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { servicosSolicitados, top5Professionals, faturamento } from '../services/apiService';
import { Circles } from 'react-loader-spinner';

const DashboardAdmin = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [servicos, setServices] = useState([]);
    const [topProfissionais, setTopProfissionais] = useState([]);
    const [loading, setLoading] = useState(true); // Adicione um estado de carregamento

    useEffect(() => {
        AOS.init({
            offset: 200,
            duration: 800,
            easing: 'ease-in-sine',
            delay: 100,
        });

        const fetchData = async () => {
            try {
                const services = await servicosSolicitados();
                const topProfessionals = await top5Professionals();
                const faturamentoKarapinha = await faturamento();
                setServices(services);
                setTopProfissionais(topProfessionals);
                console.log(topProfessionals);
                
                const mockData = {
                    todayRevenue: faturamentoKarapinha[0].valor,
                    yesterdayRevenue: faturamentoKarapinha[1].valor,
                    currentMonthRevenue: faturamentoKarapinha[2].valor,
                    lastMonthRevenue: faturamentoKarapinha[3].valor,
                    mostRequestedService: services[0],
                    leastRequestedService: services[1],
                    top5Professionals: topProfessionals
                };

                setDashboardData(mockData);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false); // Defina o carregamento como falso após a conclusão
            }
        };

        fetchData();
    }, []);

    if (loading) { // Exiba o spinner enquanto estiver carregando
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Circles 
                    height="100"
                    width="100"
                    color="#4fa94d"
                    ariaLabel="circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
            </div>
        );
    }

    if (!dashboardData) {
        return <p>Loading...</p>;
    }

    const revenueData = {
        labels: ['Hoje', 'Ontem', 'Mês Atual', 'Mês Passado'],
        datasets: [
            {
                label: 'Faturamento (KZ)',
                data: [
                    dashboardData.todayRevenue,
                    dashboardData.yesterdayRevenue,
                    dashboardData.currentMonthRevenue,
                    dashboardData.lastMonthRevenue,
                ],
                backgroundColor: ['#4caf50', '#ffeb3b', '#2196f3', '#f44336'],
            },
        ],
    };

    const serviceData = {
        labels: [dashboardData.mostRequestedService.service.serviceName, dashboardData.leastRequestedService.service.serviceName],
        datasets: [
            {
                label: 'Marcações',
                data: [dashboardData.mostRequestedService.solicitacoes, dashboardData.leastRequestedService.solicitacoes],
                backgroundColor: ['#2196f3', '#f44336'],
            },
        ],
    };

    const professionalsData = {
        labels: topProfissionais.map((prof) => prof.profissional.nome),
        datasets: [
            {
                label: 'Solicitações',
                data: topProfissionais.map((prof) => prof.solicitacoes),
                backgroundColor: [
                    '#ff6384',
                    '#36a2eb',
                    '#ffce56',
                    '#4bc0c0',
                    '#9966ff',
                ],
            },
        ],
    };

    return (
        <div className="flex justify-center items-center p-6 mx-auto">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 w-full">
                <div data-aos="fade-up" className="bg-white p-6 rounded-lg shadow-lg w-full h-96">
                    <h2 className="text-xl font-bold mb-2">Faturamento</h2>
                    <div className="w-full h-full">
                        <Bar data={revenueData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="200" className="bg-white p-6 rounded-lg shadow-lg w-full h-96">
                    <h3 className="text-xl font-bold mb-2">Serviço Mais e Menos Solicitados</h3>
                    <div className="w-full h-full">
                        <Pie data={serviceData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="300" className="bg-white p-6 rounded-lg shadow-lg w-full h-96 col-span-1 md:col-span-2 lg:col-span-2">
                    <h2 className="text-xl font-bold mb-2">Top 5 Profissionais</h2>
                    <div className="w-full h-full">
                        <Bar data={professionalsData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;
