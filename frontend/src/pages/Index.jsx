import React from 'react';
import Main from '../components/Main.jsx';
import Servicios from '../components/Servicios.jsx';

export default function Index({ onOpenLogin, onOpenRegister }) {
  return (
    <div className="w-full min-h-screen space-y-12 pb-12">
      {/* Main Hero & 10-Image Carousel Section */}
      <Main onOpenLogin={onOpenLogin} onOpenRegister={onOpenRegister} />

      {/* Brand Services & Value Propositions */}
      <Servicios />
    </div>
  );
}
