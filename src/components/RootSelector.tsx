import { useApp } from '../context/AppContext';
import { ALL_ROOTS, SOLFEGE_NAMES } from '../data/musicTheory';

// ═══════════════════════════════════════════════════════════════════════════
// 🎵 ROOT SELECTOR — Seletor de Tonalidade (12 notas)
// ═══════════════════════════════════════════════════════════════════════════

export default function RootSelector() {
  const { selectedRoot, setSelectedRoot, notation, canAccess } = useApp();

  // No plano Free, apenas algumas tonalidades
  const freeRoots = ['C', 'G', 'D', 'A', 'E'];

  return (
    <div className="w-full">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span>🎵</span> Tonalidade
      </h3>
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
        {ALL_ROOTS.map(root => {
          const isSelected = selectedRoot === root;
          const isSharp = root.includes('#');
          const label = notation === 'solfege' ? SOLFEGE_NAMES[root] : root;
          const hasAccess = canAccess('pro') || freeRoots.includes(root);

          return (
            <button
              key={root}
              onClick={() => hasAccess && setSelectedRoot(root)}
              disabled={!hasAccess}
              className={`
                relative py-2.5 px-1 rounded-xl text-sm font-bold transition-all duration-200
                ${isSelected
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 scale-105 z-10'
                  : hasAccess
                    ? isSharp
                      ? 'bg-[#1a1a2e] text-gray-300 hover:bg-[#252540] hover:text-white border border-white/5'
                      : 'bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] hover:text-white border border-white/5'
                    : 'bg-white/[0.02] text-gray-600 cursor-not-allowed border border-white/[0.03]'
                }
              `}
            >
              {label}
              {isSelected && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-lg" />
              )}
              {!hasAccess && (
                <span className="absolute -top-1 -right-1 text-[8px]">🔒</span>
              )}
            </button>
          );
        })}
      </div>
      {!canAccess('pro') && (
        <p className="mt-2 text-[10px] text-gray-600 text-center">
          🔒 Todas as 12 tonalidades disponíveis no plano Pro
        </p>
      )}
    </div>
  );
}
