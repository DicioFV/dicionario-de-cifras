import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CHORD_TYPES } from '../data/musicTheory';
import RootSelector from '../components/RootSelector';
import ChordSelector from '../components/ChordSelector';
import ChordDetail from '../components/ChordDetail';

// ═══════════════════════════════════════════════════════════════════════════
// 📖 DICTIONARY PAGE — Dicionário de Acordes Principal
// ═══════════════════════════════════════════════════════════════════════════

export default function DictionaryPage() {
  const { viewMode, setViewMode, canAccess, selectedRoot, setSelectedChordId, currentInstrument } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResults = searchQuery.length >= 1
    ? CHORD_TYPES.filter(c => {
        const q = searchQuery.toLowerCase();
        const fullName = `${selectedRoot}${c.symbol}`.toLowerCase();
        return fullName.includes(q) || c.name.toLowerCase().includes(q) || c.id.includes(q)
          || c.category.includes(q) || c.description.toLowerCase().includes(q);
      }).slice(0, 8)
    : null;

  const instrumentInfo = {
    teclado: { icon: '🎹', name: 'Teclado', available: true },
    violao: { icon: '🎸', name: 'Violão', available: false },
    guitarra: { icon: '🎸', name: 'Guitarra', available: false },
    ukulele: { icon: '🪕', name: 'Ukulele', available: false },
  };

  const inst = instrumentInfo[currentInstrument];

  // Se não é teclado, mostrar mensagem de "em breve"
  if (currentInstrument !== 'teclado') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fadeIn">
        <span className="text-6xl mb-6 block">{inst.icon}</span>
        <h1 className="text-3xl font-bold text-white mb-3">
          Acordes de {inst.name}
        </h1>
        <p className="text-gray-400 mb-8">
          Estamos trabalhando para trazer o dicionário de acordes de {inst.name} em breve!
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
          <span className="animate-pulse">🚧</span>
          <span className="text-gray-300 font-medium">Em desenvolvimento</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#12121a] via-[#1a1a2e] to-[#0f0f1a] border border-white/10 px-6 py-8 sm:py-10 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl animate-bounce-soft">🎹</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[Playfair_Display]">
            <span className="text-gradient-gold">Dicionário de Acordes</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Explore todos os acordes de teclado. Selecione a tonalidade, escolha o acorde e veja no teclado virtual.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-lg mx-auto relative z-30">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar acorde (ex: Cm7, maior, diminuto...)"
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600
              focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        {/* Search Results */}
        {filteredResults && filteredResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#15151f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
            {filteredResults.map(chord => (
              <button
                key={chord.id}
                onClick={() => { setSelectedChordId(chord.id); setSearchQuery(''); }}
                className="w-full px-4 py-3 text-left hover:bg-white/5 text-sm border-b border-white/5 last:border-0 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-amber-300 font-mono">{selectedRoot}{chord.symbol}</span>
                  <span className="text-gray-400">{chord.name}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full
                  ${chord.difficulty === 'beginner' ? 'bg-green-400/10 text-green-400' :
                    chord.difficulty === 'intermediate' ? 'bg-blue-400/10 text-blue-400' :
                      'bg-purple-400/10 text-purple-400'}`}>
                  {chord.difficulty === 'beginner' ? 'Ini.' : chord.difficulty === 'intermediate' ? 'Int.' : 'Av.'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-center gap-1 bg-white/[0.03] rounded-xl p-1 max-w-md mx-auto border border-white/5">
        {[
          { id: 'chord' as const, label: 'Acorde', icon: '🔵', plan: 'free' as const },
          { id: 'partial' as const, label: 'Parcial', icon: '🟢', plan: 'pro' as const },
          { id: 'complete' as const, label: 'Completo', icon: '🟡', plan: 'premium' as const },
        ].map(m => {
          const hasAccess = canAccess(m.plan);
          return (
            <button
              key={m.id}
              onClick={() => hasAccess && setViewMode(m.id)}
              className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5
                ${viewMode === m.id
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 shadow-lg'
                  : hasAccess
                    ? 'text-gray-500 hover:text-gray-300'
                    : 'text-gray-600 cursor-not-allowed'
                }`}
            >
              <span className="hidden sm:inline">{m.icon}</span>
              {m.label}
              {!hasAccess && <span className="text-[10px]">🔒</span>}
            </button>
          );
        })}
      </div>

      {/* Main 2-column Layout */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        {/* Left Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2 scrollbar-thin lg:pb-8">
          <RootSelector />
          <ChordSelector />
        </aside>

        {/* Main Content */}
        <main className="min-w-0">
          <ChordDetail />
        </main>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
        {[
          { label: 'Acordes', value: `${CHORD_TYPES.length}+`, icon: '🎹', color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20' },
          { label: 'Tonalidades', value: '12', icon: '🎵', color: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20' },
          { label: 'Categorias', value: '8', icon: '📁', color: 'from-purple-500/10 to-pink-500/10 border-purple-500/20' },
          { label: 'Escalas', value: '15', icon: '🎼', color: 'from-green-500/10 to-emerald-500/10 border-green-500/20' },
        ].map(stat => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-center border`}>
            <span className="text-xl">{stat.icon}</span>
            <div className="text-2xl font-bold text-white mt-1 font-mono">{stat.value}</div>
            <div className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
