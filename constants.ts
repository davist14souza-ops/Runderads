import { Game, GameCategory } from './types';

export const MOCK_GAMES: Game[] = [
  {
    id: 'g1',
    title: 'Neon Racer Overdrive',
    description: 'Acelere em pistas de neon futuristas, evite obstáculos e bata recordes de velocidade.',
    category: GameCategory.RACING,
    rating: 4.8,
    views: 12500,
    imageUrl: 'https://images.unsplash.com/photo-1547924667-62d38959518c?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2024-03-01'
  },
  {
    id: 'g2',
    title: 'Ninja Fruit Samurai',
    description: 'Use sua katana para cortar frutas voadoras, mas cuidado com as bombas!',
    category: GameCategory.ACTION,
    rating: 4.6,
    views: 8900,
    imageUrl: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2024-02-15'
  },
  {
    id: 'g3',
    title: 'Kingdom Defense',
    description: 'Posicione torres estratégicas para defender seu castelo de hordas de monstros.',
    category: GameCategory.STRATEGY,
    rating: 4.9,
    views: 21000,
    imageUrl: 'https://images.unsplash.com/photo-1533236897111-3e94666b2edf?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2024-03-05'
  },
  {
    id: 'g4',
    title: 'Candy Bubble Pop',
    description: 'Combine 3 ou mais bolhas da mesma cor para estourá-las antes que a tela encha.',
    category: GameCategory.PUZZLE,
    rating: 4.5,
    views: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1515524738708-327f6b0037b7?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2023-12-15'
  },
  {
    id: 'g5',
    title: 'Zombie Apocalypse Z',
    description: 'Sobreviva o máximo que puder em uma cidade infestada por zumbis.',
    category: GameCategory.ACTION,
    rating: 4.7,
    views: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1599413697940-57173e659325?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2024-02-28'
  },
  {
    id: 'g6',
    title: 'Mystic Forest RPG',
    description: 'Explore uma floresta mágica, lute contra criaturas e suba de nível.',
    category: GameCategory.RPG,
    rating: 4.9,
    views: 6700,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2024-01-15'
  },
  {
    id: 'g7',
    title: 'Farm Tycoon 3D',
    description: 'Gerencie sua fazenda, plante colheitas e cuide dos animais para lucrar.',
    category: GameCategory.STRATEGY,
    rating: 4.4,
    views: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2023-11-10'
  },
  {
    id: 'g8',
    title: 'Moto Xtreme Stunts',
    description: 'Faça manobras insanas com sua moto em pistas cheias de loops e fogo.',
    category: GameCategory.RACING,
    rating: 4.3,
    views: 5500,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2024-03-12'
  },
  {
    id: 'g9',
    title: 'Chess Master Online',
    description: 'Desafie sua mente no jogo de tabuleiro mais antigo e estratégico do mundo.',
    category: GameCategory.PUZZLE,
    rating: 4.6,
    views: 9200,
    imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2024-01-05'
  },
  {
    id: 'g10',
    title: 'Sniper Elite Ops',
    description: 'Complete missões furtivas eliminando alvos à longa distância.',
    category: GameCategory.ACTION,
    rating: 4.7,
    views: 11000,
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2024-02-10'
  },
  {
    id: 'g11',
    title: 'Space Invaders Redux',
    description: 'A versão moderna do clássico arcade. Defenda a galáxia!',
    category: GameCategory.ACTION,
    rating: 4.5,
    views: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1614730341194-75c60740a2d3?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2023-10-20'
  },
  {
    id: 'g12',
    title: 'Sudoku Genius',
    description: 'Relaxe e exercite seu cérebro com milhares de quebra-cabeças numéricos.',
    category: GameCategory.PUZZLE,
    rating: 4.2,
    views: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1634153098595-568eb2203106?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2023-09-15'
  }
];

export const MOCK_COMMENTS = [
  { id: 'c1', user: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff', text: 'Bem-vindo ao novo FlashBack Arcade! Divirta-se.', timestamp: 'Fixado', likes: 999, verified: true },
];
