import React from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardContainer = styled.div`
  padding: 1rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  h1 {
    color: #333;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }
`;

const StatsCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  h2 {
    color: #666;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .number {
    color: #333;
    font-size: 2rem;
    font-weight: bold;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ChartCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h3 {
    color: #333;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    text-align: center;
  }
`;

const Dashboard: React.FC = () => {
  // Datos estáticos para los gráficos
  const areaData = {
    labels: ['Arte y Cultura', 'Asesoría Colegios', 'Bienestar Psicológico'],
    datasets: [{
      data: [30, 45, 25],
      backgroundColor: [
        '#4F46E5',
        '#F59E0B',
        '#EC4899'
      ],
      borderWidth: 0
    }]
  };

  const universityData = {
    labels: ['UTP', 'UTEC', 'USMP', 'PUCP', 'UCSM', 'UCSP'],
    datasets: [{
      data: [20, 15, 12, 18, 10, 8],
      backgroundColor: [
        '#4F46E5',
        '#F59E0B',
        '#EC4899',
        '#10B981',
        '#6366F1',
        '#8B5CF6'
      ],
      borderWidth: 0
    }]
  };

  const monthlyData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [{
      label: 'Voluntarios',
      data: [45, 52, 57, 48, 55, 50, 42, 49, 53, 57, 55, 60],
      backgroundColor: '#4F46E5',
    }]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <h1>Dashboard</h1>
        <p>Datos del voluntariado periodo - marzo</p>
      </Header>

      <StatsCard>
        <h2>Total de Voluntarios</h2>
        <div className="number">57</div>
      </StatsCard>

      <ChartsGrid>
        <ChartCard>
          <h3>Voluntarios por Área</h3>
          <Doughnut data={areaData} options={doughnutOptions} />
        </ChartCard>

        <ChartCard>
          <h3>Voluntarios por Universidad</h3>
          <Doughnut data={universityData} options={doughnutOptions} />
        </ChartCard>

        <ChartCard style={{ gridColumn: '1 / -1' }}>
          <h3>Cantidad de Voluntarios Registrados</h3>
          <Bar data={monthlyData} options={barOptions} />
        </ChartCard>
      </ChartsGrid>
    </DashboardContainer>
  );
};

export default Dashboard; 