import React from 'react';
import { Monitor, Smartphone, Cpu } from 'lucide-react';

interface IntroScreenProps {
  onSelect: (device: 'mobile' | 'desktop') => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f1a] flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-12 animate-in fade-in zoom-in duration-700">
        
        {/* Title */}
        <div className="space-y-4">
           <h1 className="text-4xl md:text-6xl font-bold italic tracking-tighter">
            <span className="text-white retro-font drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">FLASHBACK</span>
            <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">ARCADE</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-mono">
            INITIALIZING SYSTEM... SELECT YOUR INTERFACE
          </p>
        </div>

        {/* Device Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4 md:px-20">
          
          {/* Mobile / Android Option */}
          <button 
            onClick={() => onSelect('mobile')}
            className="group relative bg-slate-800 hover:bg-fuchsia-900/40 border-2 border-slate-600 hover:border-fuchsia-500 rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(217,70,239,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="p-6 bg-slate-900 rounded-full border border-slate-700 group-hover:border-fuchsia-500 transition-colors">
                <Smartphone size={48} className="text-gray-300 group-hover:text-fuchsia-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">ANDROID / MOBILE</h3>
                <p className="text-sm text-gray-400">
                  Ativar controles de toque na tela. Interface otimizada para dedos.
                </p>
              </div>
            </div>
          </button>

          {/* PC / Desktop Option */}
          <button 
            onClick={() => onSelect('desktop')}
            className="group relative bg-slate-800 hover:bg-cyan-900/40 border-2 border-slate-600 hover:border-cyan-500 rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="p-6 bg-slate-900 rounded-full border border-slate-700 group-hover:border-cyan-500 transition-colors">
                <Monitor size={48} className="text-gray-300 group-hover:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">PC / DESKTOP</h3>
                <p className="text-sm text-gray-400">
                  Jogar com Teclado e Mouse. Experiência clássica de navegador.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-center gap-2 text-gray-600 font-mono text-xs">
          <Cpu size={14} />
          <span>v2.0.16 build 8940 | SERVER STATUS: ONLINE</span>
        </div>
      </div>
    </div>
  );
};
