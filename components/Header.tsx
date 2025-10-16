
import React from 'react';

const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

interface HeaderProps {
    onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-brand-blue text-white py-6 shadow-lg">
      <div className="container mx-auto text-center px-4 relative">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-gold">
          Gerador Bíblico de Conteúdo para YouTube
        </h1>
        <p className="text-lg mt-2 text-gray-200">
          Transforme passagens bíblicas em conteúdo impactante
        </p>
         <div className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2">
            <button 
                onClick={onOpenSettings}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Configurações"
            >
                <SettingsIcon />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;