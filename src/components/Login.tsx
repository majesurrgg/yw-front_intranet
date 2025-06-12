import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../context/AuthContext';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LoginContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #ffffff;
  overflow: hidden;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
`;

const WaveTop = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
`;

const WaveBottom = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1;
`;

const LoginBox = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  z-index: 2;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Logo = styled.img`
  width: 180px;
  margin: 0 auto 2rem;
  display: block;
  
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #789bfa;
    box-shadow: 0 0 0 3px rgba(120, 155, 250, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #789bfa;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(120, 155, 250, 0.2);

  &:hover {
    background-color: #6384f8;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(120, 155, 250, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(120, 155, 250, 0.2);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  margin: 0.5rem 0;
  font-size: 0.875rem;
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      // Error is handled by the auth context
      console.error('Login failed:', err);
    }
  };

  return (
    <LoginContainer>
      <WaveTop src="/assets/images/wave-top.png" alt="Wave Top" />
      <LoginBox>
        <Logo src="/assets/images/logo-login.png" alt="Logo" />
        <form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Input
            type="email"
            placeholder="Usuario"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </LoginBox>
      <WaveBottom src="/assets/images/wave-bottom.png" alt="Wave Bottom" />
    </LoginContainer>
  );
};

export default Login; 