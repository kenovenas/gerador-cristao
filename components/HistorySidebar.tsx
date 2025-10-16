import React from 'react';
import type { Conversation } from '../types';

interface HistorySidebarProps {
  history: Conversation[];
  activeConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

const NewChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  activeConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
}) => {
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent onSelectConversation from firing
    if (window.confirm('Tem certeza que deseja apagar esta conversa?')) {
        onDeleteConversation(id);
    }
  };

  return (
    <aside className="w-full md:w-72 bg-brand-blue/90 text-white flex flex-col p-2">
      <button
        onClick={onNewConversation}
        className="flex items-center justify-center w-full px-4 py-2 mb-4 text-sm font-semibold bg-brand-gold text-brand-dark rounded-md hover:bg-yellow-500 transition-colors"
      >
        <NewChatIcon />
        Nova Conversa
      </button>
      <div className="flex-grow overflow-y-auto">
        <h2 className="text-xs font-bold uppercase text-gray-300 px-2 mb-2">Histórico</h2>
        <nav>
          <ul>
            {history.map((conv) => (
              <li key={conv.id} className="mb-1">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectConversation(conv.id);
                  }}
                  className={`flex items-center justify-between w-full p-2 text-left text-sm rounded-md transition-colors ${
                    activeConversationId === conv.id
                      ? 'bg-brand-gold/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <span className="truncate flex-grow pr-2">{conv.title}</span>
                  <button
                    onClick={(e) => handleDelete(e, conv.id)}
                    className="p-1 rounded-full hover:bg-red-500/50 text-gray-300 hover:text-white transition-colors flex-shrink-0"
                    aria-label="Apagar conversa"
                  >
                    <TrashIcon />
                  </button>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default HistorySidebar;
