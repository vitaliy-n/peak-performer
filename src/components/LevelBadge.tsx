import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Crown, Medal, Award, Flame } from 'lucide-react';
import { LEVEL_NAMES } from '../types';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ 
  level, 
  size = 'md', 
  showLabel = false,
  className = '' 
}) => {
  // Determine color and icon based on level tier
  const getLevelConfig = (lvl: number) => {
    if (lvl >= 10) return { color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800', icon: Crown, gradient: 'from-purple-500 to-pink-600' };
    if (lvl >= 8) return { color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800', icon: Trophy, gradient: 'from-amber-400 to-orange-500' };
    if (lvl >= 6) return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-800', icon: Flame, gradient: 'from-red-500 to-orange-600' };
    if (lvl >= 4) return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800', icon: Medal, gradient: 'from-blue-400 to-cyan-500' };
    if (lvl >= 2) return { color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800', icon: Award, gradient: 'from-emerald-400 to-teal-500' };
    return { color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', icon: Star, gradient: 'from-slate-400 to-gray-500' };
  };

  const config = getLevelConfig(level);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-10 h-10 p-2',
    lg: 'w-16 h-16 p-3',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg flex items-center justify-center text-white relative z-10`}
        >
          <Icon className={`${iconSizes[size]}`} />
        </motion.div>
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${config.gradient} blur opacity-40`} />
        
        {/* Level Number Badge */}
        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm z-20">
          {level}
        </div>
      </div>

      {showLabel && (
        <div>
          <p className={`font-bold text-sm ${config.color.replace('text-', 'text-')}`}>
            {LEVEL_NAMES[level]}
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
            Рівень {level}
          </p>
        </div>
      )}
    </div>
  );
};
