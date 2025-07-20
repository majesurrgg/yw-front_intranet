import React, { useState, useEffect, useRef } from 'react';
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
import { postulantsService } from '../services/volunteer-postulation/postulants.service';
import type { Postulant } from '../interfaces/postulant.interface';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GradientTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(90deg, #FF0000 0%, #033ED8 31%, #347FF6 68%, #FDB82D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  
  margin-bottom: 2rem;
  border-radius: 0;
  background-color: #fff;
`;

const DashboardContainer = styled.div`
  padding: 1rem;
  background: #fff;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  h1 {
    color: #333;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatsCard = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.2s;
  text-align: center;
  min-width: 180px;
  &:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.13);
  }
  h2 {
    font-size: 1rem;
    color: #333;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  .number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #1e293b;
    margin-bottom: 0.25rem;
    transition: color 0.3s;
  }
`;

const StatsCardTotal = styled(StatsCard)`
  grid-column: 1 / span 2;
  grid-row: 1 / span 2;
  padding: 2.5rem;
  
  h2 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
  
  .number {
    font-size: 3.5rem;
  }
  
  @media (max-width: 1400px) {
    grid-column: 1 / span 2;
    grid-row: 1 / span 2;
  }
  
  @media (max-width: 1024px) {
    grid-column: 1 / span 2;
    grid-row: 1 / span 2;
  }
  
  @media (max-width: 768px) {
    grid-column: 1 / span 2;
    grid-row: 1 / span 2;
  }
  
  @media (max-width: 480px) {
    grid-column: 1;
    grid-row: 1;
  }
`;

const StatsCardStaff = styled(StatsCard)`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  grid-column: 3;
  grid-row: 1;
  
  @media (max-width: 1400px) {
    grid-column: 3;
    grid-row: 1;
  }
  
  @media (max-width: 1024px) {
    grid-column: 3;
    grid-row: 1;
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 3;
  }
  
  @media (max-width: 480px) {
    grid-column: 1;
    grid-row: 2;
  }
`;

const StatsCardAdviser = styled(StatsCard)`
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  grid-column: 4;
  grid-row: 1;
  
  @media (max-width: 1400px) {
    grid-column: 4;
    grid-row: 1;
  }
  
  @media (max-width: 1024px) {
    grid-column: 1;
    grid-row: 3;
  }
  
  @media (max-width: 768px) {
    grid-column: 2;
    grid-row: 3;
  }
  
  @media (max-width: 480px) {
    grid-column: 1;
    grid-row: 3;
  }
`;

const StatsCardPending = styled(StatsCard)`
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  grid-column: 3;
  grid-row: 2;
  
  h2, .number {
    color: #8b4513;
  }
  
  @media (max-width: 1400px) {
    grid-column: 3;
    grid-row: 2;
  }
  
  @media (max-width: 1024px) {
    grid-column: 2;
    grid-row: 3;
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 4;
  }
  
  @media (max-width: 480px) {
    grid-column: 1;
    grid-row: 4;
  }
`;

const StatsCardApproved = styled(StatsCard)`
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  grid-column: 4;
  grid-row: 2;
  
  h2, .number {
    color: #1a5f7a;
  }
  
  @media (max-width: 1400px) {
    grid-column: 4;
    grid-row: 2;
  }
  
  @media (max-width: 1024px) {
    grid-column: 3;
    grid-row: 3;
  }
  
  @media (max-width: 768px) {
    grid-column: 2;
    grid-row: 4;
  }
  
  @media (max-width: 480px) {
    grid-column: 1;
    grid-row: 5;
  }
`;

const StatsCardRejected = styled(StatsCard)`
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  grid-column: 5;
  grid-row: 2;
  
  h2, .number {
    color: #8b0000;
  }
  
  @media (max-width: 1400px) {
    grid-column: 1;
    grid-row: 3;
  }
  
  @media (max-width: 1024px) {
    grid-column: 1;
    grid-row: 4;
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 5;
  }
  
  @media (max-width: 480px) {
    grid-column: 1;
    grid-row: 6;
  }
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #667eea;
  display: inline-block;
`;

const ChartCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
  
  h3 {
    color: #333;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: 600;
  }
`;

const ResultsSection = styled.div`
  margin-top: 3rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 1.5rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4F46E5;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const SectionSubtitle = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: #222;
  background: #fff;
  border-bottom: 3px solid #667eea;
  padding: 1.2rem 0 1.2rem 0.5rem;
  margin-bottom: 2.2rem;
  letter-spacing: 0.5px;
`;

function useCountUp(end: number, duration = 1200) {
  const [value, setValue] = React.useState(0);
  const ref = useRef<number | null>(null);
  React.useEffect(() => {
    let start = 0;
    const step = (timestamp: number) => {
      if (ref.current === null) ref.current = timestamp;
      const progress = Math.min((timestamp - ref.current) / duration, 1);
      setValue(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    };
    setValue(0);
    ref.current = null;
    requestAnimationFrame(step);
    // eslint-disable-next-line
  }, [end]);
  return value;
}

const Dashboard: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Postulant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch volunteers data
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await postulantsService.getPostulants(1, 1000); // Get all volunteers
        setVolunteers(response.data);
      } catch (err) {
        setError('Error al cargar los datos de voluntarios');
        console.error('Error fetching volunteers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  // Filter active volunteers (statusVolunteer = 'APPROVED')
  const activeVolunteers = volunteers.filter(v => v.statusVolunteer === 'APPROVED');
  
  // Calculate statistics
  const totalVolunteers = volunteers.length;
  const staffVolunteers = volunteers.filter(v => v.typeVolunteer === 'STAFF').length;
  const adviserVolunteers = volunteers.filter(v => v.typeVolunteer === 'ADVISER').length;
  const pendingVolunteers = volunteers.filter(v => v.statusVolunteer === 'PENDING').length;
  const approvedVolunteers = volunteers.filter(v => v.statusVolunteer === 'APPROVED').length;
  const rejectedVolunteers = volunteers.filter(v => v.statusVolunteer === 'REJECTED').length;

  // Get area names mapping
  const getAreaName = (areaId: number) => {
    const areas: { [key: number]: string } = {
      1: 'Talento & Desarrollo Organizacional',
      2: 'Cultura & Comunicación Interna',
      3: 'Imagen Institucional & Relaciones Públicas',
      4: 'Alianzas Organizacionales',
      5: 'Convenios & Patrocinios Estratégicos',
      6: 'Marketing & Contenidos',
      7: 'Arte & Cultura',
      8: 'Asesoría a Colegios Nacionales',
      9: 'Bienestar Psicológicos',
      10: 'Gestión de Comunidades',
      11: 'Innovación & Calidad'
    };
    return areas[areaId] || `Área ${areaId}`;
  };

  // Generate area data for chart
  const generateAreaData = () => {
    const areaCounts: { [key: string]: number } = {};
    
    volunteers.forEach(volunteer => {
      const areaName = getAreaName(volunteer.idPostulationArea);
      areaCounts[areaName] = (areaCounts[areaName] || 0) + 1;
    });

    const labels = Object.keys(areaCounts);
    const data = Object.values(areaCounts);
    
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#4F46E5',
          '#F59E0B',
          '#EC4899',
          '#10B981',
          '#6366F1',
          '#8B5CF6',
          '#EF4444',
          '#06B6D4',
          '#84CC16',
          '#F97316',
          '#8B5A2B'
        ],
        borderWidth: 0
      }]
    };
  };

  // Generate university data for chart
  const generateUniversityData = () => {
    const universityCounts: { [key: string]: number } = {};
    
    volunteers.forEach(volunteer => {
      if (volunteer.programsUniversity) {
        universityCounts[volunteer.programsUniversity] = (universityCounts[volunteer.programsUniversity] || 0) + 1;
      }
    });

    const labels = Object.keys(universityCounts);
    const data = Object.values(universityCounts);
    
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#4F46E5',
          '#F59E0B',
          '#EC4899',
          '#10B981',
          '#6366F1',
          '#8B5CF6',
          '#EF4444',
          '#06B6D4',
          '#84CC16',
          '#F97316'
        ],
        borderWidth: 0
      }]
    };
  };

  // Generate monthly data for chart
  const generateMonthlyData = () => {
    const monthlyCounts = new Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    
    volunteers.forEach(volunteer => {
      const postulationDate = new Date(volunteer.datePostulation);
      if (postulationDate.getFullYear() === currentYear) {
        const month = postulationDate.getMonth();
        monthlyCounts[month]++;
      }
    });

    const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    return {
      labels,
      datasets: [{
        label: 'Voluntarios',
        data: monthlyCounts,
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderColor: '#4F46E5',
        borderWidth: 2,
        borderRadius: 8,
      }]
    };
  };

  // Generate area data for active volunteers chart
  const generateActiveAreaData = () => {
    const areaCounts: { [key: string]: number } = {};
    
    activeVolunteers.forEach(volunteer => {
      const areaName = getAreaName(volunteer.idPostulationArea);
      areaCounts[areaName] = (areaCounts[areaName] || 0) + 1;
    });

    const labels = Object.keys(areaCounts);
    const data = Object.values(areaCounts);
    
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#10B981',
          '#F59E0B',
          '#EC4899',
          '#6366F1',
          '#8B5CF6',
          '#EF4444',
          '#06B6D4',
          '#84CC16',
          '#F97316',
          '#8B5A2B',
          '#4F46E5'
        ],
        borderWidth: 0
      }]
    };
  };

  // Generate university data for active volunteers chart
  const generateActiveUniversityData = () => {
    const universityCounts: { [key: string]: number } = {};
    
    activeVolunteers.forEach(volunteer => {
      if (volunteer.programsUniversity) {
        universityCounts[volunteer.programsUniversity] = (universityCounts[volunteer.programsUniversity] || 0) + 1;
      }
    });

    const labels = Object.keys(universityCounts);
    const data = Object.values(universityCounts);
    
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#10B981',
          '#F59E0B',
          '#EC4899',
          '#6366F1',
          '#8B5CF6',
          '#EF4444',
          '#06B6D4',
          '#84CC16',
          '#F97316'
        ],
        borderWidth: 0
      }]
    };
  };

  // Generate monthly data for active volunteers chart
  const generateActiveMonthlyData = () => {
    const monthlyCounts = new Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    
    activeVolunteers.forEach(volunteer => {
      const postulationDate = new Date(volunteer.datePostulation);
      if (postulationDate.getFullYear() === currentYear) {
        const month = postulationDate.getMonth();
        monthlyCounts[month]++;
      }
    });

    const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    return {
      labels,
      datasets: [{
        label: 'Voluntarios Activos',
        data: monthlyCounts,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: '#10B981',
        borderWidth: 2,
        borderRadius: 8,
      }]
    };
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  // Animaciones de conteo para stats
  const totalVolunteersCount = useCountUp(totalVolunteers);
  const staffVolunteersCount = useCountUp(staffVolunteers);
  const adviserVolunteersCount = useCountUp(adviserVolunteers);
  const pendingVolunteersCount = useCountUp(pendingVolunteers);
  const approvedVolunteersCount = useCountUp(approvedVolunteers);
  const rejectedVolunteersCount = useCountUp(rejectedVolunteers);

  if (loading) {
    return (
      <DashboardContainer>
        <GradientTitle>Dashboard</GradientTitle>
       
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <GradientTitle>Dashboard</GradientTitle>
        <Header>
          <h1>Dashboard</h1>
          <p>Datos del voluntariado</p>
        </Header>
        <ErrorMessage>{error}</ErrorMessage>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <GradientTitle>Dashboard</GradientTitle>
      <Header>
       
        <SectionTitle>Periodo {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</SectionTitle>
      </Header>

      <StatsGrid>
        <StatsCard>
          <h2>Total de Voluntarios</h2>
          <div className="number">{totalVolunteersCount}</div>
        </StatsCard>
        <StatsCard>
          <h2>Staff</h2>
          <div className="number">{staffVolunteersCount}</div>
        </StatsCard>
        <StatsCard>
          <h2>Asesores</h2>
          <div className="number">{adviserVolunteersCount}</div>
        </StatsCard>
        <StatsCard>
          <h2>Pendientes</h2>
          <div className="number">{pendingVolunteersCount}</div>
        </StatsCard>
        <StatsCard>
          <h2>Aprobados</h2>
          <div className="number">{approvedVolunteersCount}</div>
        </StatsCard>
        <StatsCard>
          <h2>Rechazados</h2>
          <div className="number">{rejectedVolunteersCount}</div>
        </StatsCard>
      </StatsGrid>

      <ResultsSection>
        <SectionTitle>Resultados de Postulaciones</SectionTitle>
        <ResultsGrid>
          <ChartCard>
            <h3>Voluntarios por Área</h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={generateAreaData()} options={doughnutOptions} />
            </div>
          </ChartCard>

          <ChartCard>
            <h3>Voluntarios por Universidad</h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={generateUniversityData()} options={doughnutOptions} />
            </div>
          </ChartCard>

          <ChartCard>
            <h3>Voluntarios por Mes ({new Date().getFullYear()})</h3>
            <div style={{ height: '300px' }}>
              <Bar data={generateMonthlyData()} options={barOptions} />
            </div>
          </ChartCard>
        </ResultsGrid>
      </ResultsSection>

      <ResultsSection>
        <SectionTitle>Resultados Voluntariado (Voluntarios Activos)</SectionTitle>
        <ResultsGrid>
          <ChartCard>
            <h3>Voluntarios Activos por Área</h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={generateActiveAreaData()} options={doughnutOptions} />
            </div>
          </ChartCard>

          <ChartCard>
            <h3>Voluntarios Activos por Universidad</h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={generateActiveUniversityData()} options={doughnutOptions} />
            </div>
          </ChartCard>

          <ChartCard>
            <h3>Voluntarios Activos por Mes ({new Date().getFullYear()})</h3>
            <div style={{ height: '300px' }}>
              <Bar data={generateActiveMonthlyData()} options={barOptions} />
            </div>
          </ChartCard>
        </ResultsGrid>
      </ResultsSection>
    </DashboardContainer>
  );
};

export default Dashboard; 