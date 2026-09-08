import React from 'react';
import Modalregistrar from '../components/Modalregistrar.jsx';
import { useNavigate } from 'react-router-dom';

export default function Registro({ onRegisterSuccess }) {
  const navigate = useNavigate();

  return (
    <div className="py-10 flex items-center justify-center">
      <Modalregistrar
        isOpen={true}
        onClose={() => navigate('/')}
        onRegisterSuccess={(user) => {
          if (onRegisterSuccess) onRegisterSuccess(user);
          navigate('/');
        }}
      />
    </div>
  );
}
