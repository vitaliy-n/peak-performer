import React from 'react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Trophy, Lock, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { LEVEL_NAMES, LEVEL_POINTS } from '../types';

export const Achievements: React.FC = () => {
  const { achievements, user } = useStore();

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  const earnedPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);

  const currentLevel = user?.level || 1;
  const currentPoints = user?.totalPoints || 0;
  const nextLevelPoints = LEVEL_POINTS[currentLevel + 1] || LEVEL_POINTS[10];
  const currentLevelPoints = LEVEL_POINTS[currentLevel];
  const progressToNextLevel = ((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  const categories = [
    { key: 'habits', label: 'Звички', icon: '🔄' },
    { key: 'goals', label: 'Цілі', icon: '🎯' },
    { key: 'productivity', label: 'Продуктивність', icon: '⚡' },
    { key: 'mindfulness', label: 'Усвідомленість', icon: '🧘' },
    { key: 'reading', label: 'Читання', icon: '📚' },
    { key: 'special', label: 'Особливі', icon: '🌟' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Досягнення</h1>
        <p className="text-gray-500 mt-1">
          Геміфікація: Відстежуйте свій прогрес та розблоковуйте нагороди
        </p>
      </div>

      {/* Level Progress */}
      <Card className="mb-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0">
        <CardContent className="py-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold">{currentLevel}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{LEVEL_NAMES[currentLevel]}</h2>
              <p className="text-purple-200 mb-3">
                {currentPoints.toLocaleString()} XP / {nextLevelPoints.toLocaleString()} XP
              </p>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, progressToNextLevel)}%` }}
                />
              </div>
              <p className="text-sm text-purple-200 mt-2">
                {(nextLevelPoints - currentPoints).toLocaleString()} XP до наступного рівня
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{unlockedAchievements.length}</p>
              <p className="text-purple-200">з {achievements.length}</p>
              <p className="text-sm mt-1">досягнень</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="py-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
            <p className="text-sm text-gray-500">Розблоковано</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{earnedPoints}</p>
            <p className="text-sm text-gray-500">Очок зароблено</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{lockedAchievements.length}</p>
            <p className="text-sm text-gray-500">Заблоковано</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements by Category */}
      {categories.map(category => {
        const categoryAchievements = achievements.filter(a => a.category === category.key);
        if (categoryAchievements.length === 0) return null;

        return (
          <div key={category.key} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>{category.icon}</span> {category.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map(achievement => {
                const isUnlocked = !!achievement.unlockedAt;
                
                return (
                  <Card 
                    key={achievement.id}
                    className={`transition-all ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' 
                        : 'bg-gray-50 opacity-60'
                    }`}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        <div className={`text-4xl ${isUnlocked ? '' : 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {achievement.name}
                            </h3>
                            {isUnlocked && (
                              <Trophy className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {achievement.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-medium text-purple-600">
                              +{achievement.points} XP
                            </span>
                            {isUnlocked && achievement.unlockedAt && (
                              <span className="text-xs text-gray-500">
                                {format(new Date(achievement.unlockedAt), 'd MMM yyyy', { locale: uk })}
                              </span>
                            )}
                          </div>
                        </div>
                        {!isUnlocked && (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* All Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Всі рівні</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(LEVEL_NAMES).map(([level, name]) => {
              const levelNum = parseInt(level);
              const isCurrentLevel = levelNum === currentLevel;
              const isUnlocked = levelNum <= currentLevel;
              
              return (
                <div 
                  key={level}
                  className={`p-4 rounded-xl text-center ${
                    isCurrentLevel 
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                      : isUnlocked
                      ? 'bg-green-50 border-2 border-green-200'
                      : 'bg-gray-100'
                  }`}
                >
                  <p className={`text-2xl font-bold ${isCurrentLevel ? 'text-white' : isUnlocked ? 'text-green-600' : 'text-gray-400'}`}>
                    {level}
                  </p>
                  <p className={`text-sm font-medium ${isCurrentLevel ? 'text-purple-200' : 'text-gray-600'}`}>
                    {name}
                  </p>
                  <p className={`text-xs ${isCurrentLevel ? 'text-purple-300' : 'text-gray-500'}`}>
                    {LEVEL_POINTS[levelNum].toLocaleString()} XP
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
