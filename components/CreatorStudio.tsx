import React, { useState } from 'react';
import { Upload, Gamepad2, Image as ImageIcon, Sparkles, X, Code, FileUp, Users, Eye, Trophy } from 'lucide-react';
import { User, GameCategory, Game } from '../types';

interface CreatorStudioProps {
  user: User;
  onClose: () => void;
  onAddGame: (game: Game) => void;
  gamesCount: number;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({ user, onClose, onAddGame, gamesCount }) => {
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<'upload' | 'script'>('upload');
  
  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<GameCategory>(GameCategory.ACTION);
  const [imageUrl, setImageUrl] = useState('');
  const [scriptCode, setScriptCode] = useState('// Digite seu código JavaScript ou HTML aqui...\n\nfunction start() {\n  console.log("Jogo iniciado!");\n}');

  // Mock Stats
  const followers = 1240;
  const views = gamesCount * 150;

  const handlePublish = () => {
      if (!title || !desc) return;

      const newGame: Game = {
          id: `custom-${Date.now()}`,
          title: title,
          description: desc,
          category: category,
          rating: 5.0,
          views: 0,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop', // Fallback image
          releaseDate: 'Hoje'
      };

      onAddGame(newGame);
      onClose();
  };

  return (
    <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full z-10">
         <X size={20} />
      </button>

      {/* Profile Header Stats */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white mb-8 shadow-xl shadow-slate-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
                <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-white/20 shadow-lg" />
                <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-slate-800"></div>
            </div>
            <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold display-font">{user.name}</h2>
                <p className="text-slate-400 text-sm mb-4">Desenvolvedor de Jogos Indie</p>
                
                <div className="flex items-center justify-center md:justify-start gap-6 md:gap-12">
                    <div className="text-center">
                        <div className="text-2xl font-bold flex items-center justify-center gap-2">
                             <Users size={20} className="text-purple-400" /> {followers}
                        </div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Seguidores</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold flex items-center justify-center gap-2">
                             <Trophy size={20} className="text-yellow-400" /> {gamesCount}
                        </div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Jogos Criados</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold flex items-center justify-center gap-2">
                             <Eye size={20} className="text-blue-400" /> {views}
                        </div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Visualizações</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
         <h3 className="text-xl font-bold text-slate-800">Novo Projeto</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Game Source (Upload or Script) */}
        <div className="lg:col-span-7 space-y-4">
           {/* Tabs */}
           <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
               <button 
                  onClick={() => setMode('upload')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'upload' ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >
                   <FileUp size={16} /> Upload Arquivo
               </button>
               <button 
                  onClick={() => setMode('script')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'script' ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >
                   <Code size={16} /> Escrever Script
               </button>
           </div>

           {mode === 'upload' ? (
               <div 
                className={`h-80 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all ${dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'}`}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
               >
                  <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                     <Upload size={40} />
                  </div>
                  <p className="font-bold text-gray-600 text-lg">Arraste a pasta do seu jogo</p>
                  <p className="text-sm text-gray-400 mt-2 mb-6">Suporta HTML5, WebGL, .zip</p>
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 shadow-lg shadow-purple-200">
                    Selecionar do Computador
                  </button>
               </div>
           ) : (
               <div className="h-80 relative">
                   <div className="absolute top-0 right-0 bg-slate-800 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-xl font-mono">JS / HTML</div>
                   <textarea
                     className="w-full h-full bg-slate-900 text-green-400 font-mono text-sm p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                     value={scriptCode}
                     onChange={(e) => setScriptCode(e.target.value)}
                     spellCheck={false}
                   />
               </div>
           )}
        </div>

        {/* Right Side: Metadata Form */}
        <div className="lg:col-span-5 space-y-4">
           <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-full">
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Jogo</label>
                    <input 
                        type="text" 
                        placeholder="Ex: Super Pulo 3D" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-bold text-slate-800" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                    <select 
                        value={category}
                        onChange={e => setCategory(e.target.value as GameCategory)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-slate-700"
                    >
                       {Object.values(GameCategory).filter(c => c !== 'Para Você').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                      <textarea 
                        rows={4} 
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        placeholder="Descreva como jogar..." 
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                      ></textarea>
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Imagem de Capa (URL)</label>
                      <div className="flex gap-2">
                          <input 
                                type="text" 
                                placeholder="https://..." 
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm" 
                            />
                            {imageUrl && <img src={imageUrl} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />}
                      </div>
                  </div>
               </div>

               <div className="flex flex-col gap-3 mt-8">
                  <button 
                    onClick={handlePublish}
                    disabled={!title || !desc}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                  >
                     <Sparkles size={20} /> Publicar Jogo
                  </button>
                  <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 text-sm">Cancelar</button>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};