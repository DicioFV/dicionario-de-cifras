import { useState, useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CHORD_TYPES, ALL_ROOTS, getChordNotes, getChordMidiNotes, SOLFEGE_NAMES,
} from '../data/musicTheory';
import { audioEngine } from '../audio/AudioEngine';

// ═══════════════════════════════════════════════════════════════════════════
// 🎮 QUIZ PAGE — Quiz de Acordes
// ═══════════════════════════════════════════════════════════════════════════

type QuizMode = 'identify' | 'ear';

export default function QuizPage() {
  const { addXP, canAccess, setCurrentPage, volume, notation } = useApp();
  const [mode, setMode] = useState<QuizMode>('identify');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<{
    root: string;
    chordType: typeof CHORD_TYPES[0];
    options: string[];
    correct: string;
  } | null>(null);

  const hasAccess = canAccess('pro');

  const availableChords = useMemo(() => {
    return CHORD_TYPES.filter(c =>
      c.category === 'triads' || c.category === 'seventh'
    ).slice(0, 8);
  }, []);

  const generateQuestion = useCallback(() => {
    const root = ALL_ROOTS[Math.floor(Math.random() * ALL_ROOTS.length)];
    const chord = availableChords[Math.floor(Math.random() * availableChords.length)];
    const correctName = `${root}${chord.symbol}`;

    const wrongOptions: string[] = [];
    while (wrongOptions.length < 3) {
      const randChord = availableChords[Math.floor(Math.random() * availableChords.length)];
      const randRoot = ALL_ROOTS[Math.floor(Math.random() * ALL_ROOTS.length)];
      const opt = `${randRoot}${randChord.symbol}`;
      if (opt !== correctName && !wrongOptions.includes(opt)) {
        wrongOptions.push(opt);
      }
    }

    const options = [...wrongOptions, correctName].sort(() => Math.random() - 0.5);

    setCurrentQuestion({ root, chordType: chord, options, correct: correctName });
    setFeedback(null);

    if (mode === 'ear') {
      const midi = getChordMidiNotes(root, chord, 4);
      audioEngine.setVolume(volume);
      audioEngine.playChord(midi, 0.6);
    }
  }, [availableChords, mode, volume]);

  const handleAnswer = (answer: string) => {
    if (feedback || !currentQuestion) return;
    const isCorrect = answer === currentQuestion.correct;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (isCorrect) {
      setScore(s => s + 1);
      addXP(10);
    }

    setTimeout(() => {
      generateQuestion();
    }, 1800);
  };

  const replayChord = () => {
    if (!currentQuestion) return;
    const midi = getChordMidiNotes(currentQuestion.root, currentQuestion.chordType, 4);
    audioEngine.setVolume(volume);
    audioEngine.playChord(midi, 0.6);
  };

  if (!hasAccess) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fadeIn">
        <span className="text-6xl mb-6 block">🎮</span>
        <h1 className="text-3xl font-bold text-white mb-3">Quiz de Acordes</h1>
        <p className="text-gray-400 mb-8">
          Teste e aprimore seus conhecimentos sobre acordes!
        </p>
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <span className="text-4xl mb-4 block">🔒</span>
          <p className="text-gray-300 mb-2">Disponível a partir do plano Pro</p>
          <p className="text-gray-500 text-sm mb-6">
            Identifique acordes, treine seu ouvido, ganhe XP e suba de nível!
          </p>
          <button
            onClick={() => setCurrentPage('plans')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold"
          >
            Ver Planos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-[Playfair_Display] mb-2">
          <span className="text-gradient-gold">🎮 Quiz de Acordes</span>
        </h1>
        <p className="text-gray-500">Teste e aprimore seus conhecimentos</p>
      </div>

      {/* Mode selector */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setMode('identify')}
          className={`px-5 py-3 rounded-xl font-semibold transition-all
            ${mode === 'identify'
              ? 'bg-green-500/20 text-green-300 border border-green-400/40'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
        >
          📝 Identificar Notas
        </button>
        <button
          onClick={() => setMode('ear')}
          className={`px-5 py-3 rounded-xl font-semibold transition-all
            ${mode === 'ear'
              ? 'bg-green-500/20 text-green-300 border border-green-400/40'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
        >
          👂 Treino Auditivo
        </button>
      </div>

      {/* Score */}
      <div className="flex justify-center gap-4">
        <div className="bg-white/[0.03] rounded-xl px-6 py-3 border border-white/5 text-center">
          <div className="text-2xl font-bold text-green-400">{score}</div>
          <div className="text-[10px] text-gray-500 uppercase">Acertos</div>
        </div>
        <div className="bg-white/[0.03] rounded-xl px-6 py-3 border border-white/5 text-center">
          <div className="text-2xl font-bold text-white">{total}</div>
          <div className="text-[10px] text-gray-500 uppercase">Total</div>
        </div>
        <div className="bg-white/[0.03] rounded-xl px-6 py-3 border border-white/5 text-center">
          <div className="text-2xl font-bold text-amber-400">
            {total > 0 ? Math.round((score / total) * 100) : 0}%
          </div>
          <div className="text-[10px] text-gray-500 uppercase">Taxa</div>
        </div>
      </div>

      {/* Question */}
      {!currentQuestion ? (
        <div className="text-center py-12">
          <button
            onClick={generateQuestion}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg
              hover:from-green-400 hover:to-emerald-400 transition-all shadow-lg shadow-green-500/25 active:scale-95"
          >
            🎯 Começar Quiz
          </button>
        </div>
      ) : (
        <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/10 space-y-6">
          {mode === 'identify' ? (
            <>
              <h3 className="text-lg text-gray-300 text-center">
                Quais notas formam este acorde?
              </h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient-gold mb-4">
                  {currentQuestion.correct}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {getChordNotes(currentQuestion.root, currentQuestion.chordType).map((note, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-amber-400/10 text-amber-300 font-mono font-bold border border-amber-400/20">
                      {notation === 'solfege' ? (SOLFEGE_NAMES[note] || note) : note}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-center text-gray-500 text-sm">
                Qual é o tipo deste acorde? Clique na resposta correta:
              </p>
            </>
          ) : (
            <div className="text-center space-y-4">
              <h3 className="text-lg text-gray-300">Ouça o acorde e identifique:</h3>
              <button
                onClick={replayChord}
                className="px-6 py-3 rounded-xl bg-purple-500/20 text-purple-300 font-semibold border border-purple-400/30 hover:bg-purple-500/30 transition-all"
              >
                🔊 Ouvir Novamente
              </button>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={feedback !== null}
                className={`p-4 rounded-xl text-center font-bold text-lg transition-all
                  ${feedback
                    ? opt === currentQuestion.correct
                      ? 'bg-green-500/30 border-2 border-green-400 text-green-300 scale-105'
                      : 'bg-white/[0.02] border border-white/5 text-gray-600'
                    : 'bg-white/[0.04] border border-white/10 text-white hover:bg-white/[0.08] hover:border-white/20 active:scale-95'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`text-center p-4 rounded-xl animate-fadeInScale
              ${feedback === 'correct'
                ? 'bg-green-500/10 border border-green-400/30'
                : 'bg-red-500/10 border border-red-400/30'
              }`}
            >
              <span className="text-3xl block mb-2">{feedback === 'correct' ? '🎉' : '😔'}</span>
              <p className={`font-bold ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                {feedback === 'correct' ? 'Correto! +10 XP' : `Incorreto. Era ${currentQuestion.correct}`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
