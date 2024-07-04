import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import AOS from 'aos';
import 'aos/dist/aos.css';

const DashboardAdmin = () => {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        AOS.init({
            offset: 200,
            duration: 800,
            easing: 'ease-in-sine',
            delay: 100,
        });

        // Simulando a chamada da API com dados fictícios
        const fetchData = async () => {
            const mockData = {
                todayRevenue: 1000,
                yesterdayRevenue: 900,
                currentMonthRevenue: 20000,
                lastMonthRevenue: 18000,
                mostRequestedService: 'Corte de Cabelo',
                leastRequestedService: 'Pintura de Unhas',
                top5Professionals: [
                    { name: 'Celita Domingos', requests: 45 },
                    { name: 'Luena Pedro', requests: 40 },
                    { name: 'Angelo Pedro', requests: 38 },
                    { name: 'Haxi Pedro', requests: 35 },
                    { name: 'Adilson Pedro', requests: 30 },
                ],
            };

            setDashboardData(mockData);
        };

        fetchData();
    }, []);

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
        labels: ['Escovinho Cheio', 'Manicure'],
        datasets: [
            {
                label: 'Marcações',
                data: [20, 10],
                backgroundColor: ['#2196f3', '#f44336'],
            },
        ],
    };

    const professionalsData = {
        labels: dashboardData.top5Professionals.map((prof) => prof.name),
        datasets: [
            {
                label: 'Solicitações',
                data: dashboardData.top5Professionals.map((prof) => prof.requests),
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
        <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 p-6  mx-auto">
                <div data-aos="fade-up" className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-2">Faturamento</h2>
                    <div className="h-64">
                        <Bar data={revenueData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="200" className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-2">Serviço Mais e Menos Solicitados</h3>
                    <div className="h-64">
                        <Pie data={serviceData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div data-aos="fade-up" data-aos-delay="300" className="bg-white p-6 rounded-lg shadow-lg col-span-1 md:col-span-2 lg:col-span-1">
                    <h2 className="text-xl font-bold mb-2">Top 5 Profissionais</h2>
                    <div className="h-64">
                        <Bar data={professionalsData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;
