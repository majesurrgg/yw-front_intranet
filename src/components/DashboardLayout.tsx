import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
    padding-top: 4rem;
  }
`;

const DashboardLayout: React.FC = () => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default DashboardLayout; 