import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaChartBar, 
  FaChalkboardTeacher, 
  FaBars, 
  FaTimes, 
  FaUserPlus, 
  FaPowerOff, 
  FaUser, 
  FaHandsHelping 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/roles.enum';
import type { UserRoleType } from '../types/roles.enum';

interface MenuItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  roles?: UserRoleType[];
}

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  background: #1a1a1a;
  height: 100vh;
  width: 250px;
  position: fixed;
  left: 0;
  top: 0;
  transition: all 0.3s ease-in-out;
  z-index: 1000;
  display: flex;
  flex-direction: column;

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

interface NavItemProps {
  $active: boolean;
}

const NavItem = styled.li<NavItemProps>`
  a {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    color: #e0e0e0;
    text-decoration: none;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;
    background-color: ${({ $active }) => ($active ? '#2a2a2a' : 'transparent')};
    border-left-color: ${({ $active }) => ($active ? '#4a90e2' : 'transparent')};

    &:hover {
      background-color: #2a2a2a;
      border-left-color: #4a90e2;
    }

    svg {
      margin-right: 12px;
      font-size: 1.1rem;
    }
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

const LogoutButton = styled.button`
  margin-top: auto;
  margin-bottom: 1rem;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  padding: 0.75rem 1rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: #b91c1c;
  }
`;

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const menuItems: MenuItem[] = [
    { 
      path: '/dashboard', 
      icon: <FaChartBar />, 
      label: 'Dashboard',
      roles: [UserRole.ADMIN, UserRole.AREAS_STAFF]
    },
    { 
      path: '/postulantes',
      icon: <FaUserPlus />,
      label: 'Postulantes',
      roles: [UserRole.ADMIN]//puede UserRole.AREAS_STAFF??
    },
    { 
      path: '/staff',
      icon: <FaHandsHelping />,
      label: 'Voluntarios Staff',
      roles: [UserRole.ADMIN]
    },
    { 
      path: '/asesores',
      icon: <FaChalkboardTeacher />,
      label: 'Voluntarios Asesores',
      roles: [UserRole.ADMIN]
    },
    { 
      path: '/beneficiaries',
      icon: <FaUser />,
      label: 'Beneficiarios',
      roles: [UserRole.ADMIN, UserRole.AREAS_STAFF]
    },
    { 
      path: '/perfil', 
      icon: <FaUser />, 
      label: 'Perfil',
      roles: [UserRole.ADMIN, UserRole.AREAS_STAFF]
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || (userRole && item.roles.includes(userRole as UserRoleType))
  );

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
          {filteredMenuItems.map((item) => (
            <NavItem 
              key={item.path} 
              $active={location.pathname === item.path}
              onClick={() => setIsOpen(false)}
            >
              <Link to={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </NavItem>
          ))}
        </NavList>
        
        <LogoutButton onClick={handleLogout}>
          <FaPowerOff />
          <span>Cerrar Sesión</span>
        </LogoutButton>
      </SidebarContainer>
    </>
  );
};

export default Sidebar; 