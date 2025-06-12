import React from 'react';
import styled from 'styled-components';

const StaffContainer = styled.div`
  h1 {
    margin-bottom: 2rem;
    color: #333;
  }
`;

const StaffVolunteers: React.FC = () => {
  return (
    <StaffContainer>
      <h1>Voluntarios Staff</h1>
      {/* Add staff volunteers content here */}
    </StaffContainer>
  );
};

export default StaffVolunteers; 