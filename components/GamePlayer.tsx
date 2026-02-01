import React, { useState, useEffect, useRef } from 'react';
import { Game, Comment, User } from '../types';
import { ThumbsUp, Share2, Heart, Send, Verified } from 'lucide-react';
import { MOCK_COMMENTS } from '../constants';
import { ActiveGame } from './ActiveGame';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
  deviceType: 'mobile' | 'desktop';
  currentUser: User | null;
  onLoginRequest: () => void;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({ game, onBack, deviceType, currentUser, onLoginRequest }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Simulation of game loading only
  useEffect(() => {
    setIsLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 15;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [game.id]);

  // REMOVED: Bot comment generation interval logic.
  // Comments are now only static or user-generated during the session.

  const handlePostComment = () => {
    if (!currentUser) {
      onLoginRequest();
      return;
    }
    if (!newCommentText.trim()) return;

    const myComment: Comment = {
      id: `me-${Date.now()}`,
      user: currentUser.name,
      avatar: currentUser.avatar,
      text: newCommentText,
      timestamp: 'agora',
      likes: 0,
      verified: currentUser.isAdmin
    };

    setComments(prev => [myComment, ...prev]);
    setNewCommentText('');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-500">
        <button onClick={onBack} className="hover:text-blue-600 transition-colors">Início</button>
        <span>/</span>
        <span className="text-gray-800">{game.category}</span>
        <span>/</span>
        <span className="text-blue-600">{game.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Game Area (Left/Center) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Game Window */}
          <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-200/50 relative aspect-video flex flex-col z-10 ring-4 ring-white">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center w-full h-full bg-slate-900 text-white">
                <img src={game.imageUrl} className="w-24 h-24 rounded-2xl mb-4 shadow-lg object-cover" />
                <h3 className="text-2xl font-bold mb-6 display-font">{game.title}</h3>
                <div className="w-64 h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full relative">
                <ActiveGame category={game.category} deviceType={deviceType} />
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden">
                   <img src={game.imageUrl} className="w-full h-full object-cover" />
                </div>
                <div>
                   <h1 className="text-xl font-bold text-slate-800 leading-none">{game.title}</h1>
                   <p className="text-xs text-gray-500 mt-1">por Comunidade FlashPoki</p>
                </div>
             </div>
             <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors text-gray-600">
                   <ThumbsUp size={20} />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-pink-50 hover:text-pink-600 flex items-center justify-center transition-colors text-gray-600">
                   <Heart size={20} />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600">
                   <Share2 size={20} />
                </button>
             </div>
          </div>

          {/* Game Description */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-lg mb-2 text-slate-800">Sobre o Jogo</h3>
             <p className="text-gray-600 leading-relaxed mb-4">{game.description}</p>
             <div className="flex flex-wrap gap-2">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold"># {game.category}</span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-bold"># Grátis</span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-bold"># Browser</span>
             </div>
          </div>

        </div>

        {/* Sidebar (Comments & Social) - Right */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Comment Box */}
           <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-lg text-slate-800">Comentários</h3>
              </div>

              {/* Feed */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                 {comments.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">
                        Seja o primeiro a comentar!
                    </div>
                 ) : comments.map(c => (
                    <div key={c.id} className="flex gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                       <img src={c.avatar} className="w-10 h-10 rounded-full bg-gray-200 object-cover border-2 border-white shadow-sm" />
                       <div className="flex-1">
                          <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none">
                             <div className="flex justify-between items-center mb-1">
                                <span className={`font-bold text-sm flex items-center gap-1 ${c.verified ? 'text-blue-600' : 'text-slate-700'}`}>
                                   {c.user}
                                   {c.verified && <Verified size={12} fill="#2563eb" color="white" />}
                                </span>
                                <span className="text-[10px] text-gray-400">{c.timestamp}</span>
                             </div>
                             <p className="text-sm text-gray-600 leading-snug">{c.text}</p>
                          </div>
                          <div className="flex gap-3 mt-1 ml-2">
                             <button className="text-xs font-bold text-gray-400 hover:text-blue-500">Curtir</button>
                             <button className="text-xs font-bold text-gray-400 hover:text-blue-500">Responder</button>
                          </div>
                       </div>
                    </div>
                 ))}
                 <div ref={commentsEndRef}></div>
              </div>

              {/* Input Area */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                 <div className="flex gap-2">
                    <img 
                      src={currentUser?.avatar || "https://ui-avatars.com/api/?name=Guest"} 
                      className="w-8 h-8 rounded-full bg-gray-200"
                    />
                    <div className="flex-1 relative">
                       <input 
                          type="text" 
                          placeholder={currentUser ? "Escreva algo..." : "Faça login para comentar"} 
                          className="w-full bg-gray-100 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                          disabled={!currentUser}
                          onClick={() => !currentUser && onLoginRequest()}
                       />
                       <button 
                         onClick={handlePostComment}
                         className="absolute right-1 top-1 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                       >
                          <Send size={14} />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};