import React from 'react';
import { Game } from '../types';
import { Users, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { SteamHoverTracker } from './SteamHoverTracker';

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-surface rounded-xl overflow-hidden transition-all duration-300 border border-outline/5"
    >
      <div className="aspect-video w-full relative overflow-hidden">
        <SteamHoverTracker appId={game.id} title={game.title} imageUrl={game.image} />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-4 left-4 glass-panel px-3 py-1 rounded-full flex items-center gap-2">
          <Users className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-bold tracking-widest uppercase">{game.players}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-6 h-6 text-on-primary fill-current" />
          </div>
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold font-headline mb-3 text-on-surface">{game.title}</h3>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{game.description}</p>
        {game.whyFun && (
          <div className="bg-background/50 p-4 rounded-xl border-l-2 border-primary/30">
            <span className="text-[10px] font-black text-primary uppercase tracking-tighter mb-1 block">Why it's fun with friends</span>
            <p className="text-xs text-on-surface/80 italic">"{game.whyFun}"</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
