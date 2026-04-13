export interface GameMetadata {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Arcade' | 'Puzzle' | 'Logic' | 'Classic';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export type GameState = 'idle' | 'playing' | 'paused' | 'gameover';
