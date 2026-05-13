import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CHORD_TYPES, SOLFEGE_NAMES, getChordNotes, getChordMidiNotes,
  getInversions, getRelatedScales, getScaleNotes, noteToMidi,
  HARMONIC_FIELD_MAJOR, getNoteName, getNoteIndex,
} from '../data/musicTheory';
import { audioEngine } from '../audio/AudioEngine';
import Piano from './Piano';

// ═══════════════════════════════════════════════════════════
//  CHORD DETAIL PANEL — All visualization modes
// ═══════════════════════════════════════════════════════════

// Color scheme for note intervals
const INTERVAL_COLORS: Record<string, string> = {
  '1': '#d4af37', // Gold - Root
  'b3': '#22c55e', // Green - Minor third
  '3': '#22c55e', // Green - Major third
  '2': '#06b6d4', // Cyan
  '4': '#06b6d4', // Cyan
  'b5': '#8b5cf6', // Purple
  '5': '#8b5cf6', // Purple
  '#5': '#8b5cf6', // Purple
  '6': '#f97316', // Orange
  'b7': '#f97316', // Orange
  '7': '#f97316', // Orange
  'bb7': '#f97316',
  '9': '#ec4899', // Pink
  'b9': '#ec4899',
  '11': '#14b8a6', // Teal
  '#11': '#14b8a6',
  '13': '#a855f7', // Violet
};

function getIntervalColor(formula: string, index: number): string {
  const parts = formula.split(' - ');
  const part = parts[index];
  return INTERVAL_COLORS[part] || '#6b7280';
}

export default function ChordDetail() {
  const {
    selectedRoot, selectedChordId, viewMode, notation, volume, arpeggioSpeed,
    canAccess, user, toggleFavorite, addToHistory, addXP, setCurrentPage,
  } = useApp();

  const [currentInversion, setCurrentInversion] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const chordType = CHORD_TYPES.find(c => c.id === selectedChordId);
  if (!chordType) return null;

  const chordName = `${selectedRoot}${chordType.symbol}`;
  const solfegeRoot = SOLFEGE_NAMES[selectedRoot] || selectedRoot;
  const notes = getChordNotes(selectedRoot, chordType);
  const midiNotes = getChordMidiNotes(selectedRoot, chordType, 4);
  const inversions = getInversions(selectedRoot, chordType);
  const relatedScales = getRelatedScales(chordType);
  const isFav = user?.favorites.includes(chordName) || false;

  // Current inversion notes
  const currentNotes = inversions[currentInversion] || notes;
  const currentMidi = useMemo(() => {
    if (currentInversion === 0) return midiNotes;
    // For inversions, rearrange MIDI notes keeping them ascending
    const invNotes = inversions[currentInversion];
    const result: number[] = [];
    const baseOctave = 4;
    invNotes.forEach((note, i) => {
      const idx = getNoteIndex(note);
      let midi = 12 * (baseOctave + 1) + idx;
      // Ensure each note is higher than the previous
      if (i > 0 && midi <= result[i - 1]) {
        midi += 12;
      }
      result.push(midi);
    });
    return result;
  }, [currentInversion, selectedRoot, midiNotes, inversions]);

  // Build highlight map
  const highlightColors = useMemo(() => {
    const map = new Map<number, string>();
    const targetNotes = currentInversion === 0 ? midiNotes : currentMidi;
    targetNotes.forEach((midi, i) => {
      map.set(midi, getIntervalColor(chordType.formula, i));
    });
    return map;
  }, [midiNotes, currentMidi, currentInversion, chordType]);

  const degreeLabels = useMemo(() => {
    const map = new Map<number, string>();
    const targetNotes = currentInversion === 0 ? midiNotes : currentMidi;
    const parts = chordType.formula.split(' - ');
    targetNotes.forEach((midi, i) => {
      // In inversions, degrees rotate
      const origIdx = (i + currentInversion) % parts.length;
      map.set(midi, parts[origIdx] || '');
    });
    return map;
  }, [midiNotes, currentMidi, currentInversion, chordType]);

  const highlightedNotes = currentInversion === 0 ? midiNotes : currentMidi;

  // Actions
  const playChord = () => {
    audioEngine.setVolume(volume);
    audioEngine.playChord(highlightedNotes, 0.6);
    addToHistory(chordName);
    addXP(2);
  };

  const playArpeggio = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    audioEngine.setVolume(volume);
    await audioEngine.playArpeggio(highlightedNotes, arpeggioSpeed, 0.7);
    setIsPlaying(false);
    addXP(3);
  };

  const playScale = async () => {
    if (isPlaying || relatedScales.length === 0) return;
    setIsPlaying(true);
    const scale = relatedScales[0];
    const scaleNotes = getScaleNotes(selectedRoot, scale);
    const scaleMidi = scaleNotes.map(n => noteToMidi(n, 4));
    // Ensure ascending
    for (let i = 1; i < scaleMidi.length; i++) {
      while (scaleMidi[i] <= scaleMidi[i - 1]) scaleMidi[i] += 12;
    }
    scaleMidi.push(scaleMidi[0] + 12); // Add octave
    audioEngine.setVolume(volume);
    await audioEngine.playScale(scaleMidi, 250);
    setIsPlaying(false);
    addXP(5);
  };

  const hasPartialAccess = canAccess('pro');
  const hasFullAccess = canAccess('premium');

  return (
    <div className="space-y-6">
      {/* Chord Title */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent font-[Playfair_Display]">
              {chordName}
            </h2>
            <span className={`
              text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider
              ${chordType.difficulty === 'beginner' ? 'bg-green-400/15 text-green-400 border border-green-400/30' :
                chordType.difficulty === 'intermediate' ? 'bg-blue-400/15 text-blue-400 border border-blue-400/30' :
                  'bg-purple-400/15 text-purple-400 border border-purple-400/30'}
            `}>
              {chordType.difficulty === 'beginner' ? 'Iniciante' :
                chordType.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            {chordType.name} — {notation === 'solfege' ? `${solfegeRoot} ${chordType.name}` : chordName}
          </p>
        </div>
        {user && (
          <button
            onClick={() => toggleFavorite(chordName)}
            className={`p-2 rounded-lg transition-all ${isFav ? 'text-red-400 bg-red-400/10' : 'text-gray-500 hover:text-red-400 hover:bg-white/5'}`}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
        )}
      </div>

      {/* Piano Keyboard */}
      <div className="bg-gradient-to-b from-gray-900/50 to-gray-900/80 rounded-2xl p-4 border border-white/10">
        <Piano
          highlightedNotes={highlightedNotes}
          highlightColors={highlightColors}
          degreeLabels={degreeLabels}
          startOctave={3}
          numOctaves={2}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={playChord}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold
            hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 active:scale-95"
        >
          <span>▶️</span> Tocar Acorde
        </button>
        <button
          onClick={playArpeggio}
          disabled={isPlaying}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-semibold
            hover:bg-white/15 transition-all border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <span>🎵</span> Arpejo
        </button>
        <button
          onClick={playScale}
          disabled={isPlaying || !hasFullAccess}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-semibold
            hover:bg-white/15 transition-all border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <span>🎼</span> Tocar Escala
          {!hasFullAccess && <span className="text-xs">🔒</span>}
        </button>
      </div>

      {/* ═══════ CHORD MODE ═══════ */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm">📌</span>
          Formação do Acorde
        </h3>

        {/* Notes display */}
        <div className="flex flex-wrap items-center gap-3">
          {notes.map((note, i) => {
            const color = getIntervalColor(chordType.formula, i);
            const solfege = SOLFEGE_NAMES[note] || note;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  style={{ backgroundColor: color + '33', border: `2px solid ${color}`, boxShadow: `0 0 15px ${color}22` }}
                >
                  {notation === 'solfege' ? solfege : note}
                </div>
                <span className="text-[10px] text-gray-400 font-mono">
                  {chordType.intervalNames[i]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Formula */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Fórmula</div>
            <div className="text-white font-mono font-bold">{chordType.formula}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Semitons</div>
            <div className="text-white font-mono font-bold">
              {chordType.intervals.join(' - ')}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-gray-300 text-sm leading-relaxed">{chordType.description}</p>
        </div>

        {/* Tip */}
        <div className="bg-amber-400/5 rounded-xl p-4 border border-amber-400/20">
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <p className="text-amber-200/80 text-sm leading-relaxed">{chordType.tip}</p>
          </div>
        </div>
      </div>

      {/* ═══════ PARTIAL MODE (PRO) ═══════ */}
      {viewMode !== 'chord' && (
        <div className={`relative ${!hasPartialAccess ? 'pointer-events-none' : ''}`}>
          {!hasPartialAccess && (
            <div className="absolute inset-0 z-10 bg-gray-900/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3">
              <span className="text-4xl">🔒</span>
              <p className="text-white font-semibold">Conteúdo PRO</p>
              <button
                onClick={() => setCurrentPage('plans')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold pointer-events-auto"
              >
                Fazer Upgrade
              </button>
            </div>
          )}

          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-sm">🔄</span>
              Inversões
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">PRO</span>
            </h3>

            {/* Inversion buttons */}
            <div className="flex flex-wrap gap-2">
              {inversions.map((_inv, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentInversion(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${currentInversion === i
                      ? 'bg-green-500/20 text-green-300 border border-green-400/40'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                    }`}
                >
                  {i === 0 ? 'Fundamental' : `${i}ª Inversão`}
                </button>
              ))}
            </div>

            {/* Current inversion notes */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                {currentInversion === 0 ? 'Estado Fundamental' : `${currentInversion}ª Inversão`}
                {currentInversion > 0 && ` — ${SOLFEGE_NAMES[currentNotes[0]] || currentNotes[0]} no baixo`}
              </div>
              <div className="flex items-center gap-2 text-white font-mono text-lg">
                {currentNotes.map((note, i) => (
                  <span key={i}>
                    {i > 0 && <span className="text-gray-600 mx-1">—</span>}
                    <span className="font-bold" style={{ color: getIntervalColor(chordType.formula, (i + currentInversion) % notes.length) }}>
                      {notation === 'solfege' ? (SOLFEGE_NAMES[note] || note) : note}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ COMPLETE MODE (PREMIUM) ═══════ */}
      {viewMode === 'complete' && (
        <div className={`relative ${!hasFullAccess ? 'pointer-events-none' : ''}`}>
          {!hasFullAccess && (
            <div className="absolute inset-0 z-10 bg-gray-900/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3">
              <span className="text-4xl">👑</span>
              <p className="text-white font-semibold">Conteúdo PREMIUM</p>
              <button
                onClick={() => setCurrentPage('plans')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold pointer-events-auto"
              >
                Fazer Upgrade
              </button>
            </div>
          )}

          <div className="space-y-4">
            {/* Related Scales */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-sm">🎼</span>
                Escalas Relacionadas
                <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">PREMIUM</span>
              </h3>

              {relatedScales.map(scale => {
                const scaleNotes = getScaleNotes(selectedRoot, scale);
                return (
                  <div key={scale.id} className="bg-white/5 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-semibold">{selectedRoot} {scale.name}</h4>
                      <span className="text-[10px] text-gray-500 font-mono">{scale.formula}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {scaleNotes.map((note, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-lg bg-purple-500/10 text-purple-300 text-sm font-mono border border-purple-500/20"
                        >
                          {notation === 'solfege' ? (SOLFEGE_NAMES[note] || note) : note}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-400 text-xs">{scale.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Harmonic Field */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-sm">🏗️</span>
                Campo Harmônico de {selectedRoot} Maior
              </h3>

              <div className="grid grid-cols-7 gap-2">
                {HARMONIC_FIELD_MAJOR.map((hf, i) => {
                  const rootIdx = getNoteIndex(selectedRoot);
                  const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
                  const noteIdx = (rootIdx + majorScaleIntervals[i]) % 12;
                  const noteName = getNoteName(noteIdx);
                  const chordSymbol = CHORD_TYPES.find(c => c.id === hf.type)?.symbol || '';

                  return (
                    <div key={i} className="bg-white/5 rounded-xl p-3 text-center space-y-1 border border-white/5">
                      <div className="text-[10px] text-gray-500 font-bold">{hf.degree}</div>
                      <div className="text-white font-bold text-sm">{noteName}{chordSymbol}</div>
                      <div className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full
                        ${hf.quality === 'Tônica' ? 'bg-amber-400/15 text-amber-300' :
                          hf.quality === 'Subdominante' ? 'bg-blue-400/15 text-blue-300' :
                            'bg-red-400/15 text-red-300'}`}>
                        {hf.quality}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Common Progressions */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-sm">🎵</span>
                Progressões Comuns
              </h3>

              {[
                { name: 'Pop / Worship', degrees: 'I - V - vi - IV', example: `${selectedRoot} - ${getNoteName(getNoteIndex(selectedRoot) + 7)} - ${getNoteName(getNoteIndex(selectedRoot) + 9)}m - ${getNoteName(getNoteIndex(selectedRoot) + 5)}` },
                { name: 'Jazz ii-V-I', degrees: 'ii - V - I', example: `${getNoteName(getNoteIndex(selectedRoot) + 2)}m7 - ${getNoteName(getNoteIndex(selectedRoot) + 7)}7 - ${selectedRoot}maj7` },
                { name: 'Blues', degrees: 'I - IV - V', example: `${selectedRoot}7 - ${getNoteName(getNoteIndex(selectedRoot) + 5)}7 - ${getNoteName(getNoteIndex(selectedRoot) + 7)}7` },
              ].map((prog, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold text-sm">{prog.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{prog.degrees}</span>
                  </div>
                  <div className="text-amber-300 font-mono text-sm">{prog.example}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
