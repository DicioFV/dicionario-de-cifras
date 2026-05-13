import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ALL_ROOTS, SOLFEGE_NAMES, CHORD_TYPES,
  HARMONIC_FIELD_MAJOR, HARMONIC_FIELD_MINOR,
  getNoteName, getNoteIndex, getChordMidiNotes,
} from '../data/musicTheory';
import { audioEngine } from '../audio/AudioEngine';

// ═══════════════════════════════════════════════════════════════════════════
// 🎵 HARMONY PAGE — Campo Harmônico
// ═══════════════════════════════════════════════════════════════════════════

export default function HarmonyPage() {
  const { selectedRoot, setSelectedRoot, notation, volume, canAccess } = useApp();

  const hasAccess = canAccess('premium');

  const majorField = useMemo(() => {
    const rootIdx = getNoteIndex(selectedRoot);
    const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
    return HARMONIC_FIELD_MAJOR.map((hf, i) => {
      const noteIdx = (rootIdx + majorScaleIntervals[i]) % 12;
      const note = getNoteName(noteIdx);
      const chordType = CHORD_TYPES.find(c => c.id === hf.type);
      const symbol = chordType?.symbol || '';
      return {
        ...hf,
        root: note,
        chordName: `${note}${symbol}`,
        chordType: chordType!,
      };
    });
  }, [selectedRoot]);

  const minorField = useMemo(() => {
    const rootIdx = getNoteIndex(selectedRoot);
    const minorScaleIntervals = [0, 2, 3, 5, 7, 8, 10];
    return HARMONIC_FIELD_MINOR.map((hf, i) => {
      const noteIdx = (rootIdx + minorScaleIntervals[i]) % 12;
      const note = getNoteName(noteIdx);
      const chordType = CHORD_TYPES.find(c => c.id === hf.type);
      const symbol = chordType?.symbol || '';
      return {
        ...hf,
        root: note,
        chordName: `${note}${symbol}`,
        chordType: chordType!,
      };
    });
  }, [selectedRoot]);

  const playChord = (root: string, chordTypeId: string) => {
    const ct = CHORD_TYPES.find(c => c.id === chordTypeId);
    if (!ct) return;
    audioEngine.setVolume(volume);
    const midi = getChordMidiNotes(root, ct, 4);
    audioEngine.playChord(midi, 0.6);
  };

  const qualityColors: Record<string, string> = {
    'Tônica': 'from-amber-500/20 to-amber-600/20 border-amber-400/30 text-amber-300',
    'Subdominante': 'from-blue-500/20 to-blue-600/20 border-blue-400/30 text-blue-300',
    'Dominante': 'from-red-500/20 to-red-600/20 border-red-400/30 text-red-300',
  };

  if (!hasAccess) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fadeIn">
        <span className="text-6xl mb-6 block">🎵</span>
        <h1 className="text-3xl font-bold text-white mb-3">Campo Harmônico</h1>
        <p className="text-gray-400 mb-8">
          Entenda a estrutura harmônica de cada tonalidade e crie progressões incríveis.
        </p>
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <span className="text-4xl mb-4 block">👑</span>
          <p className="text-gray-300 mb-2">Disponível no plano Premium</p>
          <p className="text-gray-500 text-sm mb-6">
            Campo harmônico maior e menor, funções harmônicas, progressões prontas e mais!
          </p>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
            Ver Planos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-[Playfair_Display] mb-2">
          <span className="text-gradient-gold">🎵 Campo Harmônico</span>
        </h1>
        <p className="text-gray-500">Estrutura harmônica de cada tonalidade</p>
      </div>

      {/* Root selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {ALL_ROOTS.map(root => (
          <button
            key={root}
            onClick={() => setSelectedRoot(root)}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition-all
              ${selectedRoot === root
                ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
              }`}
          >
            {notation === 'solfege' ? SOLFEGE_NAMES[root] : root}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-3 justify-center flex-wrap">
        {Object.entries(qualityColors).map(([name, cls]) => (
          <span key={name} className={`text-xs px-3 py-1.5 rounded-full bg-gradient-to-r ${cls} border font-semibold`}>
            {name}
          </span>
        ))}
      </div>

      {/* Major Field */}
      <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/10 space-y-4">
        <h2 className="text-xl font-bold text-white">
          Campo Harmônico de {notation === 'solfege' ? SOLFEGE_NAMES[selectedRoot] : selectedRoot} Maior
        </h2>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
          {majorField.map((hf, i) => (
            <button
              key={i}
              onClick={() => playChord(hf.root, hf.chordType.id)}
              className={`bg-gradient-to-br ${qualityColors[hf.quality]} border rounded-xl p-3 sm:p-4 text-center transition-all hover:scale-105 active:scale-95`}
            >
              <div className="text-[10px] sm:text-[11px] font-bold text-gray-400 mb-1">{hf.degree}</div>
              <div className="text-base sm:text-lg font-bold text-white">{hf.chordName}</div>
              <div className="text-[9px] sm:text-[10px] mt-1 opacity-70">{hf.quality}</div>
              <div className="text-xs mt-2 opacity-40">▶️</div>
            </button>
          ))}
        </div>
      </div>

      {/* Minor Field */}
      <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/10 space-y-4">
        <h2 className="text-xl font-bold text-white">
          Campo Harmônico de {notation === 'solfege' ? SOLFEGE_NAMES[selectedRoot] : selectedRoot} Menor Natural
        </h2>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
          {minorField.map((hf, i) => (
            <button
              key={i}
              onClick={() => playChord(hf.root, hf.chordType.id)}
              className={`bg-gradient-to-br ${qualityColors[hf.quality]} border rounded-xl p-3 sm:p-4 text-center transition-all hover:scale-105 active:scale-95`}
            >
              <div className="text-[10px] sm:text-[11px] font-bold text-gray-400 mb-1">{hf.degree}</div>
              <div className="text-base sm:text-lg font-bold text-white">{hf.chordName}</div>
              <div className="text-[9px] sm:text-[10px] mt-1 opacity-70">{hf.quality}</div>
              <div className="text-xs mt-2 opacity-40">▶️</div>
            </button>
          ))}
        </div>
      </div>

      {/* How to read */}
      <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5">
        <h3 className="text-lg font-bold text-white mb-4">📖 Como Ler o Campo Harmônico</h3>
        <div className="text-gray-400 text-sm space-y-2 leading-relaxed">
          <p>• <strong className="text-white">Graus maiúsculos</strong> (I, IV, V) = acordes maiores</p>
          <p>• <strong className="text-white">Graus minúsculos</strong> (ii, iii, vi) = acordes menores</p>
          <p>• <strong className="text-white">vii° / ii°</strong> = acordes diminutos ou meio-diminutos</p>
          <p>• <strong className="text-amber-400">Tônica</strong> = repouso, resolução</p>
          <p>• <strong className="text-blue-400">Subdominante</strong> = preparação, movimento</p>
          <p>• <strong className="text-red-400">Dominante</strong> = tensão, pede resolução</p>
        </div>
      </div>
    </div>
  );
}
