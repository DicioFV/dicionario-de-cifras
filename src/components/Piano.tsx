import { useMemo, useCallback, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { audioEngine } from '../audio/AudioEngine';
import { NOTE_NAMES_SHARP, SOLFEGE_NAMES } from '../data/musicTheory';

// ═══════════════════════════════════════════════════════════════════════════
// 🎹 TECLADO VIRTUAL — Componente Interativo Premium
// Com destaque de notas, cores por intervalo e áudio realista
// ═══════════════════════════════════════════════════════════════════════════

interface PianoProps {
  highlightedNotes?: number[];
  highlightColors?: Map<number, string>;
  degreeLabels?: Map<number, string>;
  startOctave?: number;
  numOctaves?: number;
  onNotePress?: (midi: number) => void;
  compact?: boolean;
}

const BLACK_KEY_INDICES = new Set([1, 3, 6, 8, 10]);

export default function Piano({
  highlightedNotes = [],
  highlightColors = new Map(),
  degreeLabels = new Map(),
  startOctave = 3,
  numOctaves = 2,
  onNotePress,
  compact = false,
}: PianoProps) {
  const { showNoteNames, showDegrees, volume, notation } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());

  // Gerar teclas
  const keys = useMemo(() => {
    const result: { midi: number; note: string; octave: number; isBlack: boolean }[] = [];
    for (let oct = startOctave; oct < startOctave + numOctaves; oct++) {
      for (let i = 0; i < 12; i++) {
        result.push({
          midi: 12 * (oct + 1) + i,
          note: NOTE_NAMES_SHARP[i],
          octave: oct,
          isBlack: BLACK_KEY_INDICES.has(i),
        });
      }
    }
    // Dó final
    const finalOct = startOctave + numOctaves;
    result.push({ midi: 12 * (finalOct + 1), note: 'C', octave: finalOct, isBlack: false });
    return result;
  }, [startOctave, numOctaves]);

  const whiteKeys = useMemo(() => keys.filter(k => !k.isBlack), [keys]);
  const blackKeys = useMemo(() => keys.filter(k => k.isBlack), [keys]);
  const highlightSet = useMemo(() => new Set(highlightedNotes), [highlightedNotes]);

  const handleKeyPress = useCallback((midi: number) => {
    audioEngine.setVolume(volume);
    audioEngine.playNote(midi, 0.7, 1.5);
    setPressedKeys(prev => new Set(prev).add(midi));
    onNotePress?.(midi);
    setTimeout(() => {
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(midi);
        return next;
      });
    }, 300);
  }, [volume, onNotePress]);

  const getNoteLabel = (note: string, octave: number) => {
    if (notation === 'solfege') {
      return SOLFEGE_NAMES[note] || note;
    }
    return compact ? note : `${note}${octave}`;
  };

  const whiteKeyWidth = 100 / whiteKeys.length;
  const keyHeight = compact ? '130px' : '170px';

  return (
    <div className="w-full select-none touch-manipulation" ref={containerRef}>
      <div className="relative overflow-x-auto pb-1 scrollbar-thin">
        <div
          className="relative mx-auto"
          style={{
            width: `${Math.max(whiteKeys.length * (compact ? 36 : 44), 280)}px`,
            height: keyHeight,
            maxWidth: '100%',
          }}
        >
          {/* Teclas Brancas */}
          <div className="flex h-full gap-[1px]">
            {whiteKeys.map((key) => {
              const hl = highlightSet.has(key.midi);
              const color = highlightColors.get(key.midi) || '#d4af37';
              const pressed = pressedKeys.has(key.midi);
              const degree = degreeLabels.get(key.midi);

              return (
                <button
                  key={key.midi}
                  onClick={() => handleKeyPress(key.midi)}
                  onTouchStart={(e) => { e.preventDefault(); handleKeyPress(key.midi); }}
                  className={`relative flex-1 rounded-b-lg transition-all duration-75 flex flex-col items-center justify-end cursor-pointer touch-feedback
                    ${compact ? 'pb-1' : 'pb-1.5'}`}
                  style={{
                    background: hl
                      ? `linear-gradient(180deg, ${color}25 0%, ${color}55 50%, ${color}88 100%)`
                      : pressed
                        ? 'linear-gradient(180deg, #e0e0e2 0%, #c8c8cc 100%)'
                        : 'linear-gradient(180deg, #fefefe 0%, #f0f0f2 40%, #e8e8ea 100%)',
                    border: hl ? `2px solid ${color}` : '1px solid #c0c0c4',
                    boxShadow: hl
                      ? `0 0 20px ${color}40, inset 0 -4px 8px ${color}20`
                      : pressed
                        ? 'inset 0 2px 8px rgba(0,0,0,0.15)'
                        : '0 4px 8px rgba(0,0,0,0.12), inset 0 -2px 0 rgba(0,0,0,0.03)',
                    transform: pressed ? 'translateY(2px)' : 'none',
                    minWidth: compact ? '28px' : '34px',
                  }}
                  aria-label={`Nota ${key.note}${key.octave}`}
                >
                  {/* Indicador de destaque */}
                  {hl && (
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center font-black text-white
                        ${compact ? 'top-2 w-5 h-5 text-[8px]' : 'top-3 w-7 h-7 text-[10px]'}`}
                      style={{ 
                        backgroundColor: color, 
                        boxShadow: `0 2px 10px ${color}80` 
                      }}
                    >
                      {showDegrees && degree ? degree : ''}
                    </div>
                  )}
                  {/* Nome da nota */}
                  {showNoteNames && (
                    <span className={`font-semibold leading-none ${compact ? 'text-[8px]' : 'text-[10px]'} ${hl ? 'text-gray-700' : 'text-gray-400'}`}>
                      {getNoteLabel(key.note, key.octave)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Teclas Pretas */}
          {blackKeys.map(key => {
            const whiteKeysBefore = keys.filter(k => !k.isBlack && k.midi < key.midi).length;
            const leftPct = whiteKeysBefore * whiteKeyWidth - whiteKeyWidth * 0.3;

            const hl = highlightSet.has(key.midi);
            const color = highlightColors.get(key.midi) || '#d4af37';
            const pressed = pressedKeys.has(key.midi);
            const degree = degreeLabels.get(key.midi);

            return (
              <button
                key={key.midi}
                onClick={() => handleKeyPress(key.midi)}
                onTouchStart={(e) => { e.preventDefault(); handleKeyPress(key.midi); }}
                className="absolute top-0 z-10 rounded-b-md transition-all duration-75 flex flex-col items-center justify-end pb-1 cursor-pointer touch-feedback"
                style={{
                  left: `${leftPct}%`,
                  width: `${whiteKeyWidth * 0.58}%`,
                  height: pressed ? '58%' : '62%',
                  minWidth: compact ? '18px' : '22px',
                  background: hl
                    ? `linear-gradient(180deg, ${color} 0%, ${color}dd 100%)`
                    : pressed
                      ? 'linear-gradient(180deg, #252538 0%, #18182a 100%)'
                      : 'linear-gradient(180deg, #2d2d44 0%, #1a1a2e 60%, #141425 100%)',
                  boxShadow: hl
                    ? `0 0 16px ${color}66, 0 4px 8px rgba(0,0,0,0.5)`
                    : pressed
                      ? '0 1px 3px rgba(0,0,0,0.4)'
                      : '0 4px 8px rgba(0,0,0,0.5), inset 0 -1px 2px rgba(255,255,255,0.05)',
                }}
                aria-label={`Nota ${key.note}${key.octave}`}
              >
                {hl && showDegrees && degree && (
                  <span className={`font-bold text-white drop-shadow-md mb-0.5 ${compact ? 'text-[7px]' : 'text-[8px]'}`}>
                    {degree}
                  </span>
                )}
                {showNoteNames && (
                  <span className={`font-medium ${compact ? 'text-[7px]' : 'text-[8px]'} ${hl ? 'text-white' : 'text-gray-500'}`}>
                    {notation === 'solfege' ? (SOLFEGE_NAMES[key.note] || key.note) : key.note}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
