import React, { useState, useEffect } from 'react';
import type { GeneratedContent, Conversation, UserInput } from './types';
import { generateYouTubeContent } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ResultSection from './components/ResultSection';
import HistorySidebar from './components/HistorySidebar';
import AutoResizeTextarea from './components/AutoResizeTextarea';

// Icons
const ScriptIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const TitleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z M17 11h.01M17 7h5a2 2 0 012 2v5a2 2 0 01-2 2h-5a2 2 0 01-2-2V9a2 2 0 012-2z M7 17h.01M7 13h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5a2 2 0 012-2z" /></svg>;
const DescriptionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const ThumbnailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    theme: 'Números 13 – Os espias e a Terra Prometida',
    tone: 'Inspirador e devocional',
    audience: 'Jovens cristãos e líderes de célula',
    creativeIdea: 'Mostrar como a fé vence o medo e a incredulidade',
    titleIdeas: '',
    descriptionIdeas: '',
    thumbnailIdeas: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<GeneratedContent | null>(null);
  
  const [history, setHistory] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('youtubeBibleGeneratorHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('youtubeBibleGeneratorHistory', JSON.stringify(history));
    } catch(e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  const handleInputChange = (field: keyof UserInput, value: string) => {
    setUserInput(prev => ({ ...prev, [field]: value }));
  };

  const handleNewConversation = () => {
    setUserInput({
      theme: '',
      tone: '',
      audience: '',
      creativeIdea: '',
      titleIdeas: '',
      descriptionIdeas: '',
      thumbnailIdeas: '',
    });
    setActiveContent(null);
    setActiveConversationId(null);
    setError(null);
  };
  
  const handleSelectConversation = (id: string) => {
    const conversation = history.find(c => c.id === id);
    if (conversation) {
      setUserInput(conversation.input);
      setActiveContent(conversation.content);
      setActiveConversationId(id);
      setError(null);
    }
  };

  const handleDeleteConversation = (id: string) => {
    setHistory(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      handleNewConversation();
    }
  };

  const handleGenerate = async () => {
    if (!userInput.theme || !userInput.tone || !userInput.audience) {
      setError('Por favor, preencha os campos obrigatórios.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setActiveContent(null);

    try {
      const result = await generateYouTubeContent(
        userInput.theme, 
        userInput.tone, 
        userInput.audience, 
        userInput.creativeIdea, 
        userInput.titleIdeas, 
        userInput.descriptionIdeas, 
        userInput.thumbnailIdeas
      );
      
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: userInput.theme.substring(0, 40) + (userInput.theme.length > 40 ? '...' : ''),
        timestamp: Date.now(),
        input: userInput,
        content: result,
      };

      setHistory(prev => [newConversation, ...prev]);
      setActiveContent(result);
      setActiveConversationId(newConversation.id);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!activeContent) return;
    
    let fullText = `Gerador Bíblico de Conteúdo para YouTube\n`;
    fullText += `Tema: ${userInput.theme}\n\n`;
    
    fullText += `📜 Roteiro Narrativo\n====================\n${activeContent.script}\n\n`;
    fullText += `🏷️ Títulos Sugeridos\n====================\n${activeContent.titles.join('\n')}\n\n`;
    fullText += `🔖 Tags Otimizadas\n====================\n${activeContent.tags.join(', ')}\n\n`;
    fullText += `📄 Descrição (SEO)\n====================\n${activeContent.description}\n\n`;
    fullText += `🖼️ Prompts para Thumbnails\n====================\n${activeContent.thumbnailPrompts.join('\n')}\n\n`;
    
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'conteudo_biblico_gerado.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderInput = (id: keyof UserInput, label: string, required = true, isTextArea = false) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-brand-dark mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextArea ? (
         <AutoResizeTextarea
          id={id}
          value={userInput[id]}
          onChange={(e) => handleInputChange(id, e.target.value)}
          rows={id.includes('Ideas') ? 1 : 2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue resize-none overflow-hidden"
          placeholder={`Ex: ${label.split('(')[0].trim()}`}
        />
      ) : (
        <input
          type="text"
          id={id}
          value={userInput[id]}
          onChange={(e) => handleInputChange(id, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
          placeholder={`Ex: ${label.split('(')[0].trim()}`}
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen font-sans bg-brand-light">
      <Header />
      <div className="flex-grow flex flex-col md:flex-row">
        <HistorySidebar 
            history={history}
            activeConversationId={activeConversationId}
            onNewConversation={handleNewConversation}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
        />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput('theme', '📖 Tema ou passagem bíblica', true, true)}
              {renderInput('tone', '🎭 Tom ou estilo desejado')}
              {renderInput('audience', '👥 Público-alvo')}
              {renderInput('creativeIdea', '💡 Ideia criativa (opcional)', false, true)}
            </div>

            <div className="col-span-1 md:col-span-2 mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-brand-dark mb-2 font-serif">Sugestões de SEO (Opcional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {renderInput('titleIdeas', 'Ideias para Títulos', false, true)}
                  {renderInput('descriptionIdeas', 'Ideias para Descrição', false, true)}
                  {renderInput('thumbnailIdeas', 'Ideias para Thumbnails', false, true)}
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-8 py-3 bg-brand-gold text-brand-dark font-bold text-lg rounded-md hover:bg-yellow-500 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
              >
                {isLoading ? 'Gerando...' : 'Gerar Conteúdo Completo'}
              </button>
            </div>
          </div>

          {error && <div className="mt-8 max-w-4xl mx-auto p-4 bg-red-100 text-red-700 border border-red-400 rounded-md text-center">{error}</div>}
          {isLoading && <LoadingSpinner />}

          {activeContent && (
            <div className="mt-12 max-w-4xl mx-auto animate-fadeIn">
              <div className="flex justify-end mb-4">
                  <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                  >
                  <DownloadIcon />
                  Baixar tudo em .txt
                  </button>
              </div>
              <ResultSection 
                icon={<ScriptIcon />} 
                title="📜 Roteiro Narrativo" 
                content={activeContent.script}
              />
              <ResultSection icon={<TitleIcon />} title="🏷️ Títulos Sugeridos" content={activeContent.titles} />
              <ResultSection icon={<TagIcon />} title="🔖 Tags Otimizadas" content={activeContent.tags.join(', ')} />
              <ResultSection icon={<DescriptionIcon />} title="📄 Descrição (SEO)" content={activeContent.description} />
              <ResultSection icon={<ThumbnailIcon />} title="🖼️ Prompts para Thumbnails" content={activeContent.thumbnailPrompts} />
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;
