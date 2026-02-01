import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface GoogleLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const GoogleLogin: React.FC<GoogleLoginProps> = ({ isOpen, onClose, onLogin }) => {
  const [step, setStep] = useState<'method' | 'email' | 'register'>('method');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleFakeGoogleLogin = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
        const user: User = {
            name: 'Usuário Google',
            email: 'usuario@gmail.com',
            avatar: 'https://ui-avatars.com/api/?name=Google+User&background=0D8ABC&color=fff',
            isAdmin: false
        };
        onLogin(user);
        onClose();
        setIsLoading(false);
    }, 1500);
  };

  const handleRegister = () => {
      if(!name || !email) return;
      setIsLoading(true);
      setTimeout(() => {
        const user: User = {
            name: name,
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`,
            isAdmin: false
        };
        onLogin(user);
        onClose();
        setIsLoading(false);
      }, 1500);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-bold">Autenticando...</p>
            </div>
        ) : (
            <>
                <div className="flex flex-col items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Entrar na Conta</h2>
                    <p className="text-sm text-gray-500">Salve seu progresso e crie jogos</p>
                </div>

                {step === 'method' && (
                    <div className="space-y-4">
                        <button 
                            onClick={handleFakeGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition-all shadow-sm"
                        >
                            {/* Google Icon SVG */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Continuar com Google
                        </button>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase">Ou entre com email</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <button 
                            onClick={() => setStep('email')}
                            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-blue-200 shadow-lg"
                        >
                            <Mail size={20} />
                            Usar Email
                        </button>
                    </div>
                )}

                {step === 'email' && (
                     <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="seu@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Senha</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                        </div>
                        <button 
                             onClick={() => alert("Login com email simulado! Use o Google para testar rápido.")}
                             className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Entrar
                        </button>
                        <div className="text-center">
                            <button onClick={() => setStep('register')} className="text-sm text-blue-600 font-bold hover:underline">
                                Não tem conta? Cadastre-se
                            </button>
                        </div>
                        <button onClick={() => setStep('method')} className="w-full text-gray-400 text-sm">Voltar</button>
                     </div>
                )}

                {step === 'register' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Seu Nome (Público)</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: MasterGamer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button 
                             onClick={handleRegister}
                             disabled={!name || !email}
                             className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            Criar Conta Grátis
                        </button>
                        <button onClick={() => setStep('email')} className="w-full text-gray-400 text-sm">Voltar para Login</button>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};