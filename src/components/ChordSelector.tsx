import { useApp } from '../context/AppContext';
import { CHORD_CATEGORIES, CHORD_TYPES } from '../data/musicTheory';

// ═══════════════════════════════════════════════════════════════════════════
// 📁 CHORD SELECTOR — Seletor de Categoria e Tipo de Acorde
// ═══════════════════════════════════════════════════════════════════════════

export default function ChordSelector() {
  const { selectedCategory, setSelectedCategory, selectedChordId, setSelectedChordId, canAccess } = useApp();

  const filteredChords = CHORD_TYPES.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-5">
      {/* Category tabs */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>📁</span> Categorias
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {CHORD_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            const hasAccess = canAccess(cat.planRequired);

            return (
              <button
                key={cat.id}
                onClick={() => hasAccess && setSelectedCategory(cat.id)}
                disabled={!hasAccess}
                className={`
                  px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5
                  ${isSelected
                    ? 'bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-300 border border-amber-400/30 shadow-lg shadow-amber-500/10'
                    : hasAccess
                      ? 'bg-white/[0.03] text-gray-400 hover:bg-white/[0.06] hover:text-gray-200 border border-transparent'
                      : 'bg-white/[0.01] text-gray-600 cursor-not-allowed border border-transparent opacity-60'
                  }
                `}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                {!hasAccess && <span className="text-[10px] ml-0.5">🔒</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chord type list */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>🎹</span> Tipos de Acorde
          <span className="text-gray-600 font-normal">({filteredChords.length})</span>
        </h3>
        <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredChords.map(chord => {
            const isSelected = selectedChordId === chord.id;
            const hasAccess = canAccess(chord.planRequired);

            return (
              <button
                key={chord.id}
                onClick={() => hasAccess && setSelectedChordId(chord.id)}
                disabled={!hasAccess}
                className={`
                  group relative p-3 rounded-xl text-left transition-all duration-200
                  ${isSelected
                    ? 'bg-gradient-to-br from-amber-400/15 to-orange-500/15 border-2 border-amber-400/40 shadow-lg shadow-amber-500/10'
                    : hasAccess
                      ? 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10'
                      : 'bg-white/[0.01] border border-white/[0.03] opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className={`text-sm font-bold truncate ${isSelected ? 'text-amber-300' : 'text-gray-200'}`}>
                      {chord.name}
                    </div>
                    <div className="text-[10px] text-gray-600 font-mono mt-0.5 truncate">
                      {chord.formula}
                    </div>
                  </div>
                  {!hasAccess && (
                    <span className="text-base opacity-50 shrink-0 ml-2">🔒</span>
                  )}
                </div>

                {/* Active indicator */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}

                {/* Difficulty badge */}
                <div className={`
                  mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full w-fit uppercase tracking-wider
                  ${chord.difficulty === 'beginner' ? 'bg-green-400/10 text-green-400' :
                    chord.difficulty === 'intermediate' ? 'bg-blue-400/10 text-blue-400' :
                      'bg-purple-400/10 text-purple-400'}
                `}>
                  {chord.difficulty === 'beginner' ? 'Iniciante' :
                    chord.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
