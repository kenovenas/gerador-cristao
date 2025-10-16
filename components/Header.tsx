
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-blue text-white py-6 shadow-lg">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-gold">
          Gerador Bíblico de Conteúdo para YouTube
        </h1>
        <p className="text-lg mt-2 text-gray-200">
          Transforme passagens bíblicas em conteúdo impactante
        </p>
      </div>
    </header>
  );
};

export default Header;
