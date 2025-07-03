import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaChartBar, FaUsers, FaChalkboardTeacher, FaBars, FaTimes, FaUserPlus } from 'react-icons/fa';

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  background: #1a1a1a;
  height: 100vh;
  width: 250px;
  position: fixed;
  left: 0;
  top: 0;
  transition: all 0.3s ease-in-out;
  z-index: 1000;

  @media (max-width: 768px) {
    transform: translateX(${({ isOpen }) => (isOpen ? '0' : '-100%')});
  }
`;

const LogoContainer = styled.div`
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #333;
`;

const Logo = styled.img`
  width: -webkit-fill-available;
  height: auto;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 1rem 0;
`;

const NavItem = styled.li<{ active?: boolean }>`
  padding: 0.75rem 1.5rem;
  margin: 0.5rem 0;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ active }) => (active ? '#333' : 'transparent')};

  &:hover {
    background: #333;
  }

  a {
    color: white;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
`;

const ToggleButton = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1001;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  display: none;
  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { path: '/dashboard', icon: <FaChartBar />, label: 'Dashboard' },
    { path: '/postulantes', icon: <FaUserPlus />, label: 'Administrar Postulantes' },
    { path: '/staff', icon: <FaUsers />, label: 'Voluntarios Staff' },
    { path: '/asesores', icon: <FaChalkboardTeacher />, label: 'Voluntarios Asesores' },
  ];

  return (
    <>
      <ToggleButton onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </ToggleButton>
      
      <Overlay isOpen={isOpen} onClick={toggleSidebar} />
      
      <SidebarContainer isOpen={isOpen}>
        <LogoContainer>
          <Logo src="/assets/images/logo_sidebar.png" alt="Logo Yachay Wasi" />
        </LogoContainer>
        
        <NavList>
          {menuItems.map((item) => (
            <NavItem 
              key={item.path} 
              active={location.pathname === item.path}
              onClick={() => setIsOpen(false)}
            >
              <Link to={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </NavItem>
          ))}
        </NavList>
      </SidebarContainer>
    </>
  );
};

export default Sidebar; 