
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-12 text-center">
      <div className="w-16 h-16 border-4 border-brand-blue border-t-brand-gold rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-brand-blue font-serif">
        Gerando conteúdo teológico...
      </p>
    </div>
  );
};

export default LoadingSpinner;
