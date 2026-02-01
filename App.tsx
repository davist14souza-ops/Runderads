import React, { useState } from 'react';
import { Gamepad2, Search, Menu, UserCircle2, PlusCircle, LogOut, Sparkles } from 'lucide-react';
import { MOCK_GAMES } from './constants';
import { Game, GameCategory, User } from './types';
import { GamePlayer } from './components/GamePlayer';
import { ChatWidget } from './components/ChatWidget';
import { IntroScreen } from './components/IntroScreen';
import { GoogleLogin } from './components/GoogleLogin';
import { CreatorStudio } from './components/CreatorStudio';

const App: React.FC = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop' | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeCategory, setActiveCategory] = useState<GameCategory>(GameCategory.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dynamic Game State
  const [allGames, setAllGames] = useState<Game[]>(MOCK_GAMES);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showCreatorStudio, setShowCreatorStudio] = useState(false);

  const handleAddGame = (newGame: Game) => {
    setAllGames(prev => [newGame, ...prev]);
    alert("Jogo publicado com sucesso! Ele apareceu na lista.");
  };

  const filteredGames = allGames.filter(game => {
    const matchesCategory = activeCategory === GameCategory.ALL || game.category === activeCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredGames = allGames.slice(0, 3);

  // Show Intro Screen until device is selected
  if (!deviceType) {
    return <IntroScreen onSelect={setDeviceType} />;
  }

  return (
    <div className="min-h-screen bg-[#f3f5f7] pb-20 selection:bg-blue-200">
      
      <GoogleLogin 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLogin={setCurrentUser} 
      />

      {/* Modern Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-3 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Top Row: Brand & User Actions */}
            <div className="flex items-center justify-between w-full md:w-auto">
              {/* Brand */}
              <div 
                className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform" 
                onClick={() => { setSelectedGame(null); setShowCreatorStudio(false); }}
              >
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-300">
                  <span className="font-bold text-xl display-font">P</span>
                </div>
                <span className="text-2xl font-black text-slate-800 tracking-tight display-font">
                  Poki<span className="text-blue-500">Clone</span>
                </span>
              </div>

              {/* User / Actions (Mobile Only View) */}
              <div className="flex md:hidden items-center gap-2">
                {currentUser ? (
                   <button 
                     onClick={() => { setShowCreatorStudio(true); setSelectedGame(null); }}
                     className="bg-purple-100 text-purple-700 p-2 rounded-full"
                   >
                     <PlusCircle size={24} />
                   </button>
                ) : (
                  <button onClick={() => setIsLoginOpen(true)}>
                    <UserCircle2 size={28} className="text-slate-700" />
                  </button>
                )}
              </div>
            </div>

            {/* Prominent Search Bar */}
            <div className="flex-1 w-full md:max-w-2xl order-3 md:order-2">
              <div className="relative group shadow-sm hover:shadow-md transition-shadow rounded-full">
                <input 
                  type="text"
                  placeholder="🔍 Encontre um jogo..."
                  className="w-full bg-gray-100 border-2 border-transparent focus:border-blue-500 rounded-full py-3 md:py-3.5 pl-12 pr-4 text-base font-bold text-gray-700 transition-all focus:bg-white outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              </div>
            </div>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center gap-3 order-2 md:order-3">
              {currentUser ? (
                <div className="flex items-center gap-3">
                    <button 
                      onClick={() => { setShowCreatorStudio(true); setSelectedGame(null); }}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-full font-bold text-sm transition-colors shadow-lg shadow-purple-200"
                    >
                      <PlusCircle size={18} /> Criar Jogo
                    </button>
                    
                    <div className="flex items-center gap-2 bg-gray-100 pl-1 pr-3 py-1.5 rounded-full border border-gray-200">
                      <img src={currentUser.avatar} className="w-9 h-9 rounded-full bg-white shadow-sm" />
                      <span className="text-sm font-bold text-gray-700 max-w-[100px] truncate">{currentUser.name}</span>
                    </div>
                    <button 
                      onClick={() => setCurrentUser(null)} 
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Sair"
                    >
                      <LogOut size={20} />
                    </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-slate-300 transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <UserCircle2 size={18} />
                  Entrar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        
        {/* VIEW: Creator Studio */}
        {showCreatorStudio && currentUser ? (
          <CreatorStudio 
            user={currentUser} 
            onClose={() => setShowCreatorStudio(false)} 
            onAddGame={handleAddGame}
            gamesCount={allGames.filter(g => g.id.startsWith('custom-')).length}
          />
        ) :
        
        /* VIEW: Game Player */
        selectedGame ? (
          <GamePlayer 
            game={selectedGame} 
            onBack={() => setSelectedGame(null)} 
            deviceType={deviceType}
            currentUser={currentUser}
            onLoginRequest={() => setIsLoginOpen(true)}
          />
        ) : (
          /* VIEW: Home Grid */
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {Object.values(GameCategory).map((cat) => (
                 <button
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                     activeCategory === cat 
                       ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
                       : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                   }`}
                 >
                   {cat}
                 </button>
              ))}
            </div>

            {/* Featured Hero (Only All/Empty Search) */}
            {activeCategory === GameCategory.ALL && !searchTerm && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredGames.map((game, i) => (
                     <div 
                       key={game.id}
                       onClick={() => setSelectedGame(game)}
                       className={`relative group cursor-pointer overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${i === 0 ? 'md:col-span-2 md:row-span-2 min-h-[400px]' : 'min-h-[190px]'}`}
                     >
                        <img src={game.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 p-6 flex flex-col justify-end">
                           <span className="bg-white/20 backdrop-blur-md text-white w-fit px-3 py-1 rounded-lg text-xs font-bold mb-2 border border-white/30">{game.category}</span>
                           <h3 className={`font-bold text-white leading-tight display-font ${i === 0 ? 'text-4xl' : 'text-xl'}`}>{game.title}</h3>
                        </div>
                     </div>
                  ))}
               </div>
            )}

            {/* Game Grid */}
            <div>
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                 <h2 className="text-2xl font-bold text-slate-800 display-font">
                   {activeCategory === GameCategory.ALL ? 'Novidades Quentes' : activeCategory}
                 </h2>
                 {activeCategory === GameCategory.ALL && (
                    <span className="text-sm text-gray-400 font-bold ml-auto">{allGames.length} Jogos</span>
                 )}
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  
                  {/* CREATE GAME SHORTCUT CARD */}
                  <div 
                    onClick={() => {
                        if (currentUser) {
                            setShowCreatorStudio(true);
                            setSelectedGame(null);
                        } else {
                            setIsLoginOpen(true);
                        }
                    }}
                    className="group cursor-pointer flex flex-col h-full"
                  >
                       <div className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 hover:border-purple-500 transition-all flex flex-col items-center justify-center relative mb-3">
                           <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform text-purple-600">
                               <Sparkles size={28} />
                           </div>
                           <span className="font-bold text-purple-700 group-hover:text-purple-900">Publicar Jogo</span>
                           <span className="text-[10px] text-purple-400 font-bold mt-1 uppercase tracking-wide">Área do Criador</span>
                       </div>
                       <h3 className="font-bold text-slate-400 text-sm px-1">Novo Projeto</h3>
                  </div>

                  {filteredGames.map((game) => (
                     <div 
                       key={game.id}
                       onClick={() => setSelectedGame(game)}
                       className="group cursor-pointer"
                     >
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all relative mb-3 bg-white border border-gray-100">
                           <img src={game.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm">
                              ⭐ {game.rating}
                           </div>
                           
                           {/* Hover Overlay */}
                           <div className="absolute inset-0 bg-blue-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="bg-white text-blue-600 p-3 rounded-full shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                                 <Gamepad2 size={24} fill="currentColor" />
                              </div>
                           </div>
                        </div>
                        <h3 className="font-bold text-slate-700 text-sm truncate group-hover:text-blue-600 transition-colors px-1">{game.title}</h3>
                        <p className="text-xs text-gray-400 px-1">{game.category}</p>
                     </div>
                  ))}
               </div>
            </div>

          </div>
        )}
      </main>
      
      {/* Bot Widget kept as is */}
      <ChatWidget />
      
    </div>
  );
};

export default App;