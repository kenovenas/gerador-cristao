import React, { useState } from 'react';
import type { GeneratedContent } from '../types';
import CopyButton from './CopyButton';
import AutoResizeTextarea from './AutoResizeTextarea';

const RegenerateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0119.5 19.5M20 20l-1.5-1.5A9 9 0 004.5 4.5" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

interface ResultSectionProps {
  icon: React.ReactNode;
  title: string;
  sectionKey: keyof GeneratedContent;
  content: string | string[];
  onContentChange: (sectionKey: keyof GeneratedContent, index: number | null, value: string) => void;
  onRegenerate: (sectionKey: keyof GeneratedContent, idea: string) => void;
  isRegenerating: boolean;
}

const ResultSection: React.FC<ResultSectionProps> = ({ icon, title, sectionKey, content, onContentChange, onRegenerate, isRegenerating }) => {
  const [showRegenerateInput, setShowRegenerateInput] = useState(false);
  const [regenerationIdea, setRegenerationIdea] = useState('');

  const handleRegenerateSubmit = () => {
    onRegenerate(sectionKey, regenerationIdea);
    setShowRegenerateInput(false);
    setRegenerationIdea('');
  };

  const isList = Array.isArray(content);
  const isTagsSection = sectionKey === 'tags';
  
  const textToCopy = isTagsSection 
    ? (content as string[]).join(', ') 
    : isList 
    ? (content as string[]).join('\n') 
    : (content as string);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-brand-gold">{icon}</span>
          <h3 className="text-xl font-serif font-bold text-brand-blue ml-3">{title}</h3>
        </div>
        <button
          onClick={() => setShowRegenerateInput(prev => !prev)}
          disabled={isRegenerating}
          className="p-2 rounded-full hover:bg-brand-blue/10 text-brand-blue transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Regenerar ${title}`}
        >
          {isRegenerating ? <SpinnerIcon /> : <RegenerateIcon />}
        </button>
      </div>

      {isList && !isTagsSection ? (
        <ul className="list-inside space-y-2 text-brand-dark">
          {(content as string[]).map((item, index) => (
            <li key={index} className="flex items-center group gap-2">
              <span className="text-gray-400">&#8226;</span>
              <input
                type="text"
                value={item}
                onChange={(e) => onContentChange(sectionKey, index, e.target.value)}
                className="w-full bg-transparent focus:bg-yellow-50 focus:outline-none rounded-md p-1 -ml-1 transition-colors"
              />
              <CopyButton
                textToCopy={item}
                iconOnly
                className="p-1.5 rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-700 opacity-0 group-hover:opacity-100 focus:opacity-100"
              />
            </li>
          ))}
        </ul>
      ) : isTagsSection ? (
         <AutoResizeTextarea
            value={(content as string[]).join(', ')}
            onChange={(e) => onContentChange(sectionKey, null, e.target.value)}
            className="w-full text-brand-dark whitespace-pre-wrap leading-relaxed bg-transparent focus:bg-yellow-50 focus:outline-none rounded-md p-1 -m-1 transition-colors"
        />
      ) : (
        <AutoResizeTextarea
            value={content as string}
            onChange={(e) => onContentChange(sectionKey, null, e.target.value)}
            className="w-full text-brand-dark whitespace-pre-wrap leading-relaxed bg-transparent focus:bg-yellow-50 focus:outline-none rounded-md p-1 -m-1 transition-colors"
        />
      )}

      {showRegenerateInput && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md border animate-fadeIn">
          <label htmlFor={`regenerate-idea-${sectionKey}`} className="block text-sm font-medium text-brand-dark mb-1">
            Ideias para a nova geração (opcional)
          </label>
          <AutoResizeTextarea
            id={`regenerate-idea-${sectionKey}`}
            value={regenerationIdea}
            onChange={(e) => setRegenerationIdea(e.target.value)}
            rows={1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue resize-none overflow-hidden"
            placeholder="Ex: Tornar mais formal, adicionar um versículo..."
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
                onClick={() => setShowRegenerateInput(false)}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
                Cancelar
            </button>
            <button
                onClick={handleRegenerateSubmit}
                className="px-3 py-1 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-blue-800 transition-colors"
            >
                Gerar novamente
            </button>
          </div>
        </div>
      )}

      {(!isList || isTagsSection) && <CopyButton textToCopy={textToCopy} />}
    </div>
  );
};

export default ResultSection;