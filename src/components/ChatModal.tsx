import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User } from 'lucide-react';
import { ChatMessage, ChatService } from '../services/chat';
import { SocialPlayer } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { id: string; username?: string };
  targetUser: SocialPlayer;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  targetUser
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unsubscribe: any;
    const initChat = async () => {
      if (isOpen && currentUser.id && targetUser.id) {
        const id = await ChatService.getOrCreateChat(currentUser.id, targetUser.id);
        setChatId(id);
        unsubscribe = ChatService.subscribeToMessages(id, (newMsgs) => {
          setMessages(newMsgs);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        });
      }
    };
    initChat();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isOpen, currentUser.id, targetUser.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !chatId) return;

    const msg = text;
    setText('');
    try {
      await ChatService.sendMessage(chatId, currentUser.id, msg);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 sm:items-center">
      <div className="w-full h-full max-h-[85vh] sm:h-auto sm:max-h-[600px] sm:max-w-md bg-[#080c12] sm:rounded-2xl border border-white/10 flex flex-col shadow-2xl overflow-hidden animate-slide-up-mobile sm:animate-zoom-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#0d141e] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/20 overflow-hidden shrink-0">
              <img src={targetUser.avatar} alt={targetUser.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase font-display">{targetUser.name}</h2>
              <p className="text-[10px] text-neutral-400 font-mono-stat">{targetUser.tag}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
              <User className="w-8 h-8 opacity-50" />
              <p className="text-xs font-mono-stat text-center">Nenhuma mensagem ainda.<br/>Mande um salve!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-yellow-500/20 text-emerald-100 border border-yellow-500/30 rounded-br-sm' : 'bg-[#151f2b] text-white border border-white/10 rounded-bl-sm'}`}>
                    {msg.text}
                    <div className={`text-[9px] mt-1 opacity-50 ${isMe ? 'text-right text-emerald-200' : 'text-left text-neutral-400'}`}>
                      {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-[#0d141e] border-t border-white/10 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:hover:bg-yellow-500 text-black font-black transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
