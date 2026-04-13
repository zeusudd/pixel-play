import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Search, 
  Trophy, 
  Clock, 
  Heart, 
  ChevronLeft,
  Grid3X3,
  Brain,
  Bomb,
  Square,
  Hash,
  Table,
  Type,
  Zap,
  Layout,
  Activity,
  Bird,
  MessageSquare,
  Footprints,
  Music,
  Layers,
  Star
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { GAMES } from './constants';
import { GameMetadata } from './types';

// Game Imports
import Snake from './games/Snake';
import TicTacToe from './games/TicTacToe';
import MemoryMatch from './games/MemoryMatch';
import Minesweeper from './games/Minesweeper';
import Tetris from './games/Tetris';
import Game2048 from './games/Game2048';
import Sudoku from './games/Sudoku';
import Hangman from './games/Hangman';
import WhackAMole from './games/WhackAMole';
import Breakout from './games/Breakout';
import Pong from './games/Pong';
import FlappyBird from './games/FlappyBird';
import Wordle from './games/Wordle';
import DinoRun from './games/DinoRun';
import SimonSays from './games/SimonSays';
import TowerBlocks from './games/TowerBlocks';

const ICON_MAP: Record<string, any> = {
  Snake: Gamepad2,
  Grid3X3,
  Brain,
  Bomb,
  Square,
  Hash,
  Table,
  Type,
  Zap,
  Layout,
  Activity,
  Bird,
  MessageSquare,
  Footprints,
  Music,
  Layers,
};

const GAME_COMPONENTS: Record<string, React.ComponentType> = {
  snake: Snake,
  tictactoe: TicTacToe,
  memory: MemoryMatch,
  minesweeper: Minesweeper,
  tetris: Tetris,
  '2048': Game2048,
  sudoku: Sudoku,
  hangman: Hangman,
  whackamole: WhackAMole,
  breakout: Breakout,
  pong: Pong,
  flappy: FlappyBird,
  wordle: Wordle,
  dino: DinoRun,
  simon: SimonSays,
  tower: TowerBlocks,
};

export default function App() {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const selectedGame = useMemo(() => 
    GAMES.find(g => g.id === selectedGameId), 
  [selectedGameId]);

  const SelectedGameComponent = selectedGameId ? GAME_COMPONENTS[selectedGameId] : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!selectedGameId ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* Header */}
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                      <Gamepad2 className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                      Pixel<span className="text-indigo-500">Play</span>
                    </h1>
                  </div>
                  <p className="text-slate-400 font-medium">Your ultimate arcade destination.</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <Input 
                      placeholder="Search games..." 
                      className="pl-10 w-full md:w-[300px] bg-slate-900/50 border-slate-800 focus:border-indigo-500 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </header>

              {/* Categories */}
              <Tabs defaultValue="All" className="w-full" onValueChange={setActiveCategory}>
                <TabsList className="bg-slate-900/50 border border-slate-800 p-1 h-auto flex-wrap justify-start">
                  {['All', 'Arcade', 'Puzzle', 'Logic', 'Memory'].map((cat) => (
                    <TabsTrigger 
                      key={cat} 
                      value={cat}
                      className="px-6 py-2 rounded-md data-active:bg-indigo-600 data-active:text-white transition-all"
                    >
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Game Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game, index) => {
                  const Icon = ICON_MAP[game.icon] || Gamepad2;
                  return (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className="group relative overflow-hidden bg-slate-900/40 border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer h-full flex flex-col"
                        onClick={() => setSelectedGameId(game.id)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <CardHeader className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-slate-800 group-hover:bg-indigo-600 transition-colors`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <Badge variant="outline" className="bg-slate-950/50 border-slate-800 text-slate-400">
                              {game.difficulty}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {game.title}
                          </CardTitle>
                          <CardDescription className="text-slate-400 line-clamp-2">
                            {game.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="mt-auto relative z-10">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              {game.category}
                            </span>
                            <div className="flex items-center gap-1 text-amber-400">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs font-bold">4.8</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-20">
                  <div className="inline-block p-4 bg-slate-900 rounded-full mb-4">
                    <Gamepad2 className="w-12 h-12 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-400">No games found</h3>
                  <p className="text-slate-500">Try adjusting your search or category filter.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="game-view"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                  onClick={() => setSelectedGameId(null)}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Arcade
                </Button>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <h2 className="text-2xl font-black tracking-tight uppercase italic text-white">
                      {selectedGame?.title}
                    </h2>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                      {selectedGame?.category} • {selectedGame?.difficulty}
                    </p>
                  </div>
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    {selectedGame && React.createElement(ICON_MAP[selectedGame.icon] || Gamepad2, { className: "w-5 h-5 text-white" })}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 min-h-[500px] flex items-center justify-center shadow-2xl backdrop-blur-sm">
                {SelectedGameComponent && <SelectedGameComponent />}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900/40 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      High Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-black">12,450</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/40 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      Time Played
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-black">2h 45m</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/40 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" />
                      Favorites
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-black">1.2k</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-600 text-sm font-medium">
            © 2026 PixelPlay Arcade. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
