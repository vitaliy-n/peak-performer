import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui';
import { METHODOLOGIES, METHODOLOGY_CATEGORY_LABELS, type Methodology, type MethodologyCategory } from '../data/methodologies';

export const Library: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<MethodologyCategory | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredMethodologies = METHODOLOGIES
    .filter(m => filterCategory === 'all' || m.category === filterCategory)
    .filter(m =>
      searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.principles.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const categories = Object.entries(METHODOLOGY_CATEGORY_LABELS) as [MethodologyCategory, string][];

  const groupedByCategory = filterCategory === 'all'
    ? categories.reduce((acc, [key, label]) => {
        const items = filteredMethodologies.filter(m => m.category === key);
        if (items.length > 0) acc.push({ key, label, items });
        return acc;
      }, [] as { key: MethodologyCategory; label: string; items: Methodology[] }[])
    : [{
        key: filterCategory,
        label: METHODOLOGY_CATEGORY_LABELS[filterCategory],
        items: filteredMethodologies,
      }];

  const totalCount = METHODOLOGIES.length;
  const favCount = favorites.size;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          Бібліотека методологій
        </h1>
        <p className="text-gray-500 mt-1">
          {totalCount} методологій з найкращих книг про продуктивність, звички та успіх
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{totalCount}</p>
            <p className="text-sm text-gray-500">Методологій</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{categories.length}</p>
            <p className="text-sm text-gray-500">Категорій</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{favCount}</p>
            <p className="text-sm text-gray-500">Обрані</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Пошук методологій, авторів, принципів..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value as MethodologyCategory | 'all')}
            className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none min-w-[200px]"
          >
            <option value="all">Всі категорії</option>
            {categories.map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        Знайдено: {filteredMethodologies.length} методологій
        {searchQuery && ` за запитом "${searchQuery}"`}
      </p>

      {/* Methodology List */}
      {groupedByCategory.map(group => (
        <div key={group.key} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {group.label}
            <span className="text-sm font-normal text-gray-500">({group.items.length})</span>
          </h2>

          <div className="space-y-3">
            {group.items.map(methodology => {
              const isExpanded = expandedId === methodology.id;
              const isFav = favorites.has(methodology.id);

              return (
                <Card key={methodology.id} className={`transition-all ${isExpanded ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}>
                  <CardContent className="py-4">
                    {/* Header Row */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : methodology.id)}
                      className="w-full flex items-start gap-4 text-left"
                    >
                      <span className="text-3xl flex-shrink-0">{methodology.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                            {methodology.title}
                          </h3>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                            {methodology.author}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {methodology.shortDescription}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={e => { e.stopPropagation(); toggleFavorite(methodology.id); }}
                          className={`p-1 rounded ${isFav ? 'text-amber-500' : 'text-gray-300 hover:text-gray-400'}`}
                        >
                          <Star className={`w-5 h-5 ${isFav ? 'fill-amber-500' : ''}`} />
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mt-4 pl-14 space-y-4">
                        {/* Principles */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ключові принципи:</h4>
                          <ul className="space-y-1.5">
                            {methodology.principles.map((principle, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="text-blue-500 mt-0.5">•</span>
                                {principle}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* App Feature */}
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">В додатку:</span>
                          </div>
                          <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">{methodology.appFeature}</p>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Автор: {methodology.author}</span>
                          <span>Категорія: {METHODOLOGY_CATEGORY_LABELS[methodology.category]}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {filteredMethodologies.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Нічого не знайдено</h3>
            <p className="text-gray-500">Спробуйте змінити пошуковий запит або фільтр</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
