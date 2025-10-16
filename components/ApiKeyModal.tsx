import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  onRemove: () => void;
  currentApiKey: string;
}

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .847 0 1.67.127 2.455.364m0 11.291A9.959 9.959 0 0021.542 12c-1.274-4.057-5.064-7-9.542-7a9.953 9.953 0 00-2.455.364m0 11.291L5.125 5.125m13.75 13.75L5.125 5.125" /></svg>;


const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, onRemove, currentApiKey }) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setApiKey(currentApiKey);
    // Reset show state when modal reopens or key changes
    setShowKey(false);
  }, [currentApiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(apiKey);
    onClose();
  };

  const handleRemove = () => {
    if (window.confirm('Tem certeza que deseja remover a chave de API? Você não poderá gerar conteúdo até adicionar uma nova.')) {
      onRemove();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apiKeyModalTitle"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4 animate-fadeIn">
        <h2 id="apiKeyModalTitle" className="text-2xl font-bold font-serif text-brand-blue mb-4">Configurar Chave de API do Gemini</h2>
        <p className="text-brand-dark mb-4 text-sm">
          Para usar este aplicativo, você precisa de uma chave de API do Google Gemini. Sua chave é salva apenas no seu navegador. Obtenha sua chave no{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline hover:text-blue-700">
            Google AI Studio
          </a>.
        </p>
        <div className="mb-6">
          <label htmlFor="apiKeyInput" className="block text-sm font-medium text-brand-dark mb-1">
            Sua Chave de API
          </label>
          <div className="relative">
            <input
              id="apiKeyInput"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
              placeholder="Cole sua chave de API aqui"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-brand-blue"
              aria-label={showKey ? 'Ocultar chave' : 'Mostrar chave'}
            >
              {showKey ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            {currentApiKey && (
              <button
                onClick={handleRemove}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                Remover Chave
              </button>
            )}
          </div>
          <div className="flex justify-end space-x-4 flex-grow">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Salvar Chave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;