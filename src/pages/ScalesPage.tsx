import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  SCALE_TYPES, SOLFEGE_NAMES, getScaleNotes, noteToMidi, ALL_ROOTS,
} from '../data/musicTheory';
import { audioEngine } from '../audio/AudioEngine';
import Piano from '../components/Piano';

// ═══════════════════════════════════════════════════════════════════════════
// 🎼 SCALES PAGE — Dicionário de Escalas
// ═══════════════════════════════════════════════════════════════════════════

export default function ScalesPage() {
  const { selectedRoot, setSelectedRoot, notation, volume, canAccess } = useApp();
  const [selectedScaleId, setSelectedScaleId] = useState('major');
  const [isPlaying, setIsPlaying] = useState(false);

  const hasAccess = canAccess('pro');

  const scale = SCALE_TYPES.find(s => s.id === selectedScaleId)!;
  const scaleNotes = useMemo(() => getScaleNotes(selectedRoot, scale), [selectedRoot, scale]);

  const scaleMidi = useMemo(() => {
    const notes = scaleNotes.map(n => noteToMidi(n, 4));
    for (let i = 1; i < notes.length; i++) {
      while (notes[i] <= notes[i - 1]) notes[i] += 12;
    }
    return notes;
  }, [scaleNotes]);

  const highlightedNotes = scaleMidi;
  const highlightColors = useMemo(() => {
    const map = new Map<number, string>();
    scaleMidi.forEach((midi, i) => {
      map.set(midi, i === 0 ? '#d4af37' : '#8b5cf6');
    });
    return map;
  }, [scaleMidi]);

  const playScale = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    audioEngine.setVolume(volume);
    const midiWithOctave = [...scaleMidi, scaleMidi[0] + 12];
    await audioEngine.playScale(midiWithOctave, 280);
    setIsPlaying(false);
  };

  if (!hasAccess) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fadeIn">
        <span className="text-6xl mb-6 block">🎼</span>
        <h1 className="text-3xl font-bold text-white mb-3">Escalas Musicais</h1>
        <p className="text-gray-400 mb-8">
          Explore todas as escalas musicais com visualização no teclado e áudio.
        </p>
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <span className="text-4xl mb-4 block">🔒</span>
          <p className="text-gray-300 mb-2">Disponível a partir do plano Pro</p>
          <p className="text-gray-500 text-sm mb-6">
            Desbloqueie 15+ escalas incluindo modos gregos, pentatônicas, blues e muito mais!
          </p>
          <button
            onClick={() => {}}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold"
          >
            Ver Planos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-[Playfair_Display] mb-2">
          <span className="text-gradient-royal">🎼 Escalas Musicais</span>
        </h1>
        <p className="text-gray-500">Explore todas as escalas no teclado</p>
      </div>

      {/* Root selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {ALL_ROOTS.map(root => (
          <button
            key={root}
            onClick={() => setSelectedRoot(root)}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition-all
              ${selectedRoot === root
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
              }`}
          >
            {notation === 'solfege' ? SOLFEGE_NAMES[root] : root}
          </button>
        ))}
      </div>

      {/* Scale type selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {SCALE_TYPES.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedScaleId(s.id)}
            className={`p-3 rounded-xl text-left transition-all text-sm
              ${selectedScaleId === s.id
                ? 'bg-purple-500/20 border border-purple-400/40 text-purple-300'
                : 'bg-white/[0.03] border border-white/5 text-gray-400 hover:bg-white/[0.06]'
              }`}
          >
            <div className="font-semibold truncate">{s.name}</div>
          </button>
        ))}
      </div>

      {/* Scale Display */}
      <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {notation === 'solfege' ? SOLFEGE_NAMES[selectedRoot] : selectedRoot} {scale.name}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{scale.description}</p>
          </div>
          <button
            onClick={playScale}
            disabled={isPlaying}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold
              hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg disabled:opacity-50 active:scale-95"
          >
            {isPlaying ? '🎵 Tocando...' : '▶️ Tocar Escala'}
          </button>
        </div>

        {/* Piano */}
        <div className="bg-[#0c0c12] rounded-xl p-4 border border-white/5">
          <Piano
            highlightedNotes={highlightedNotes}
            highlightColors={highlightColors}
            startOctave={3}
            numOctaves={2}
          />
        </div>

        {/* Notes */}
        <div className="flex flex-wrap gap-3">
          {scaleNotes.map((note, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg
                ${i === 0
                  ? 'bg-amber-400/20 border-2 border-amber-400 text-amber-300'
                  : 'bg-purple-500/15 border-2 border-purple-400/40 text-purple-300'
                }`}
              >
                {notation === 'solfege' ? (SOLFEGE_NAMES[note] || note) : note}
              </div>
              <span className="text-[10px] text-gray-600 font-mono">{i + 1}º</span>
            </div>
          ))}
        </div>

        {/* Formula */}
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Fórmula (Tons e Semitons)</div>
          <div className="text-white font-mono font-bold">{scale.formula}</div>
        </div>
      </div>
    </div>
  );
}
