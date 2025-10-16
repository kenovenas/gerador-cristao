import React from 'react';
import CopyButton from './CopyButton';

interface ResultSectionProps {
  icon: React.ReactNode;
  title: string;
  content: string | string[];
  textToCopyOverride?: string;
}

const ResultSection: React.FC<ResultSectionProps> = ({ icon, title, content, textToCopyOverride }) => {
  const contentString = Array.isArray(content) ? content.join('\n') : content;
  const textToCopy = textToCopyOverride ?? contentString;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center mb-4">
        <span className="text-brand-gold">{icon}</span>
        <h3 className="text-xl font-serif font-bold text-brand-blue ml-3">{title}</h3>
      </div>
      {Array.isArray(content) ? (
        <ul className="list-disc list-inside space-y-2 text-brand-dark">
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-brand-dark whitespace-pre-wrap leading-relaxed">{content}</p>
      )}
      <CopyButton textToCopy={textToCopy} />
    </div>
  );
};

export default ResultSection;