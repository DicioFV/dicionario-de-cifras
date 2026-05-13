// ═══════════════════════════════════════════════════════════
//  MUSIC THEORY ENGINE — Core data and logic
// ═══════════════════════════════════════════════════════════

export const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export const SOLFEGE_NAMES: Record<string, string> = {
  'C': 'Dó', 'C#': 'Dó#', 'Db': 'Réb', 'D': 'Ré', 'D#': 'Ré#', 'Eb': 'Mib',
  'E': 'Mi', 'F': 'Fá', 'F#': 'Fá#', 'Gb': 'Solb', 'G': 'Sol', 'G#': 'Sol#',
  'Ab': 'Láb', 'A': 'Lá', 'A#': 'Lá#', 'Bb': 'Sib', 'B': 'Si'
};

export const ALL_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export interface ChordType {
  id: string;
  name: string;
  symbol: string;
  intervals: number[];
  formula: string;
  intervalNames: string[];
  category: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tip: string;
  planRequired: 'free' | 'pro' | 'premium';
}

export interface ScaleType {
  id: string;
  name: string;
  intervals: number[];
  formula: string;
  description: string;
}

// ═══════════════════════════════════════════════════════════
//  CHORD CATEGORIES
// ═══════════════════════════════════════════════════════════

export const CHORD_CATEGORIES = [
  { id: 'triads', name: 'Tríades', icon: '🎵', planRequired: 'free' as const },
  { id: 'sus', name: 'Suspensos', icon: '🔄', planRequired: 'pro' as const },
  { id: 'sixth', name: 'Com Sexta', icon: '6️⃣', planRequired: 'pro' as const },
  { id: 'seventh', name: 'Com Sétima', icon: '7️⃣', planRequired: 'pro' as const },
  { id: 'ninth', name: 'Com Nona', icon: '9️⃣', planRequired: 'premium' as const },
  { id: 'eleventh', name: 'Com 11ª', icon: '🎹', planRequired: 'premium' as const },
  { id: 'thirteenth', name: 'Com 13ª', icon: '🎼', planRequired: 'premium' as const },
  { id: 'special', name: 'Especiais', icon: '⭐', planRequired: 'premium' as const },
];

// ═══════════════════════════════════════════════════════════
//  COMPLETE CHORD DATABASE
// ═══════════════════════════════════════════════════════════

export const CHORD_TYPES: ChordType[] = [
  // TRIADS
  {
    id: 'major', name: 'Maior', symbol: '', intervals: [0, 4, 7],
    formula: '1 - 3 - 5', intervalNames: ['Fundamental', 'Terça Maior', 'Quinta Justa'],
    category: 'triads', difficulty: 'beginner', planRequired: 'free',
    description: 'O acorde maior é formado pela Fundamental, Terça Maior e Quinta Justa. É o acorde mais básico, com sonoridade alegre e brilhante. É o primeiro acorde que todo aluno deve aprender.',
    tip: 'Usado em praticamente todas as músicas. No campo harmônico maior, aparece nos graus I, IV e V.'
  },
  {
    id: 'minor', name: 'Menor', symbol: 'm', intervals: [0, 3, 7],
    formula: '1 - b3 - 5', intervalNames: ['Fundamental', 'Terça Menor', 'Quinta Justa'],
    category: 'triads', difficulty: 'beginner', planRequired: 'free',
    description: 'O acorde menor é formado pela Fundamental, Terça Menor e Quinta Justa. Tem sonoridade triste, melancólica e introspectiva.',
    tip: 'No campo harmônico maior, aparece nos graus ii, iii e vi. Muito usado em baladas e músicas emotivas.'
  },
  {
    id: 'aug', name: 'Aumentado', symbol: 'aug', intervals: [0, 4, 8],
    formula: '1 - 3 - #5', intervalNames: ['Fundamental', 'Terça Maior', 'Quinta Aumentada'],
    category: 'triads', difficulty: 'intermediate', planRequired: 'free',
    description: 'O acorde aumentado é formado pela Fundamental, Terça Maior e Quinta Aumentada. Tem sonoridade tensa e misteriosa, pedindo resolução.',
    tip: 'Muito usado como acorde de passagem. Comum em progressões cromáticas e jazz.'
  },
  {
    id: 'dim', name: 'Diminuto', symbol: 'dim', intervals: [0, 3, 6],
    formula: '1 - b3 - b5', intervalNames: ['Fundamental', 'Terça Menor', 'Quinta Diminuta'],
    category: 'triads', difficulty: 'intermediate', planRequired: 'free',
    description: 'O acorde diminuto é formado pela Fundamental, Terça Menor e Quinta Diminuta. Tem sonoridade muito tensa e instável.',
    tip: 'Aparece no VII grau do campo harmônico maior. Excelente como acorde de passagem cromática.'
  },

  // SUSPENDED
  {
    id: 'sus2', name: 'Suspenso 2', symbol: 'sus2', intervals: [0, 2, 7],
    formula: '1 - 2 - 5', intervalNames: ['Fundamental', 'Segunda Maior', 'Quinta Justa'],
    category: 'sus', difficulty: 'beginner', planRequired: 'pro',
    description: 'O acorde sus2 substitui a terça pela segunda maior, criando uma sonoridade aberta e etérea, sem definição maior ou menor.',
    tip: 'Muito usado em pop, rock e worship para criar ambientes abertos e contemplativos.'
  },
  {
    id: 'sus4', name: 'Suspenso 4', symbol: 'sus4', intervals: [0, 5, 7],
    formula: '1 - 4 - 5', intervalNames: ['Fundamental', 'Quarta Justa', 'Quinta Justa'],
    category: 'sus', difficulty: 'beginner', planRequired: 'pro',
    description: 'O acorde sus4 substitui a terça pela quarta justa, criando tensão que pede resolução para o acorde maior.',
    tip: 'Clássico em intros e transições. A resolução sus4 → maior é um dos movimentos mais usados na música.'
  },

  // SIXTH
  {
    id: '6', name: 'Sexta Maior', symbol: '6', intervals: [0, 4, 7, 9],
    formula: '1 - 3 - 5 - 6', intervalNames: ['Fundamental', 'Terça Maior', 'Quinta Justa', 'Sexta Maior'],
    category: 'sixth', difficulty: 'intermediate', planRequired: 'pro',
    description: 'O acorde com sexta adiciona a sexta maior à tríade maior, criando uma sonoridade elegante e jazzy.',
    tip: 'Muito usado em jazz, bossa nova e finalizações elegantes de músicas.'
  },
  {
    id: 'm6', name: 'Sexta Menor', symbol: 'm6', intervals: [0, 3, 7, 9],
    formula: '1 - b3 - 5 - 6', intervalNames: ['Fundamental', 'Terça Menor', 'Quinta Justa', 'Sexta Maior'],
    category: 'sixth', difficulty: 'intermediate', planRequired: 'pro',
    description: 'O acorde menor com sexta adiciona a sexta maior à tríade menor. Sonoridade sofisticada com toque melancólico.',
    tip: 'Comum em jazz e MPB. Adiciona cor harmônica ao acorde menor.'
  },

  // SEVENTH CHORDS
  {
    id: '7', name: 'Sétima (Dominante)', symbol: '7', intervals: [0, 4, 7, 10],
    formula: '1 - 3 - 5 - b7', intervalNames: ['Fundamental', 'Terça Maior', 'Quinta Justa', 'Sétima Menor'],
    category: 'seventh', difficulty: 'beginner', planRequired: 'pro',
    description: 'O acorde dominante com sétima é formado pela tríade maior + sétima menor. Cria forte tensão que resolve na tônica.',
    tip: 'É o acorde do V grau! A progressão V7 → I é a mais importante da harmonia tonal. Essencial em blues, jazz e gospel.'
  },
  {
    id: 'maj7', name: 'Sétima Maior', symbol: 'maj7', intervals: [0, 4, 7, 11],
    formula: '1 - 3 - 5 - 7', intervalNames: ['Fundamental', 'Terça Maior', 'Quinta Justa', 'Sétima Maior'],
    category: 'seventh', difficulty: 'beginner', planRequired: 'pro',
    description: 'O acorde com sétima maior adiciona a sétima maior à tríade maior. Sonoridade suave, elegante e sofisticada.',
    tip: 'Aparece nos graus I e IV do campo harmônico maior. Muito usado em jazz, bossa nova e worship contemporâneo.'
  },
  {
    id: 'm7', name: 'Menor com Sétima', symbol: 'm7', intervals: [0, 3, 7, 10],
    formula: '1 - b3 - 5 - b7', intervalNames: ['Fundamental', 'Terça Menor', 'Quinta Justa', 'Sétima Menor'],
    category: 'seventh', difficulty: 'beginner', planRequired: 'pro',
    description: 'O acorde menor com sétima combina a tríade menor com a sétima menor. Sonoridade suave, jazzística e melancólica.',
    tip: 'Aparece nos graus ii, iii e vi do campo harmônico maior. Indispensável em jazz, R&B e soul.'
  },
  {
    id: 'mmaj7', name: 'Menor com 7ª Maior', symbol: 'm(maj7)', intervals: [0, 3, 7, 11],
    formula: '1 - b3 - 5 - 7', intervalNames: ['Fundamental', 'Terça Menor', 'Quinta Justa', 'Sétima Maior'],
    category: 'seventh', difficulty: 'advanced', planRequired: 'pro',
    description: 'Combina a tríade menor com a sétima maior, criando uma sonoridade misteriosa e cinematográfica.',
    tip: 'Aparece no I grau do campo harmônico menor harmônico. Usado em trilhas sonoras e jazz avançado.'
  },
  {
    id: 'm7b5', name: 'Meio-Diminuto', symbol: 'm7(b5)', intervals: [0, 3, 6, 10],
    formula: '1 - b3 - b5 - b7', intervalNames: ['Fundamental', 'Terça Menor', 'Quinta Diminuta', 'Sétima Menor'],
    category: 'seventh', difficulty: 'intermediate', planRequired: 'pro',
    description: 'O acorde meio-diminuto (também escrito ø) combina a tríade diminuta com a sétima menor.',
    tip: 'Aparece no VII grau do campo harmônico maior e no II grau do menor. Essencial em progressões ii-V-i menores.'
  },
  {
    id: 'dim7', name: 'Diminuto com 7ª dim', symbol: '°7', intervals: [0, 3, 6, 9],
    formula: '1 - b3 - b5 - bb7', intervalNames: ['Fundamental', 'Terça Menor', 'Quinta Diminuta', 'Sétima Diminuta'],
    category: 'seventh', difficulty: 'intermediate', planRequired: 'pro',
    description: 'O acorde diminuto com sétima diminuta é totalmente simétrico — cada nota está a 3 semitons da próxima.',
    tip: 'Excelente como acorde de passagem cromática. Muito usado em gospel, jazz e música clássica.'
  },

  // NINTH CHORDS
  {
    id: '9', name: 'Nona', symbol: '9', intervals: [0, 4, 7, 10, 14],
    formula: '1 - 3 - 5 - b7 - 9', intervalNames: ['Fundamental', 'Terça Maior', 'Quinta Justa', 'Sétima Menor', 'Nona'],
    category: 'ninth', difficulty: 'intermediate', planRequired: 'premium',
    description: 'O acorde de nona dominante adiciona a nona ao acorde V7. Sonoridade rica e sofisticada.',
    tip: 'Muito usado em funk, R&B, soul e jazz. Substitui o V7 com mais cor harmônica.'
  },
  {
    id: 'maj9', name: 'Nona Maior', symbol: 'maj9', intervals: [0, 4, 7, 11, 14],
    formula: '1 - 3 - 5 - 7 - 9', intervalNames: ['Fundamental', 'Terça Maior', 'Quinta Justa', 'Sétima Maior', 'Nona'],
    category: 'ninth', difficulty: 'intermediate', planRequired: 'premium',
    description: 'Combina o acorde maj7 com a nona, criando uma das sonoridades mais elegantes e sofisticadas.',
    tip: 'Favorito em jazz, neo-soul e worship contemporâneo. Substitua qualquer maj7 por maj9 para mais beleza.'
  },
  {
    id: 'm9', name: 'Menor com Nona', symbol: 'm9', intervals: [0, 3, 7, 10, 14],
    formula: '1 - b3 - 5 - b7 - 9', intervalNames: ['Fundamental', 'Terça Menor', 'Quinta Justa', 'Sétima Menor', 'Nona'],
    category: 'ninth', difficulty: 'intermediate', planRequired: 'premium',
    description: 'Adiciona a nona ao acorde m7. Sonoridade aberta, suave e muito sofisticada.',
    tip: 'Indispensável em neo-soul, R&B e jazz contemporâneo. Um dos acordes mais bonitos.'
  },
  {
    id: 'add9', name: 'Add9', symbol: 'add9', intervals: [0, 4, 7, 14],
    formula: '1 - 3 - 5 - 9', intervalNames: ['Fundamental', 'Terça Maior', 'Quinta Justa', 'Nona'],
    category: 'ninth', difficulty: 'beginner', planRequired: 'premium',
    description: 'O add9 adiciona apenas a nona à tríade maior (sem a sétima). Sonoridade brilhante e aberta.',
    tip: 'Muito popular em pop e worship. Substitui o acorde maior simples com mais brilho e modernidade.'
  },
  {
    id: '7b9', name: 'Dominante b9', symbol: '7(b9)', intervals: [0, 4, 7, 10, 13],
    formula: '1 - 3 - 5 - b7 - b9', intervalNames: ['Fundamental', 'Terça Maior', 'Quinta Justa', 'Sétima Menor', 'Nona Menor'],
    category: 'ninth', difficulty: 'advanced', planRequired: 'premium',
    description: 'O dominante b9 é um acorde alterado com forte tensão. A nona bemol cria grande instabilidade.',
    tip: 'Usado em resoluções dramáticas, flamenco e jazz. Perfeito para criar tensão antes da resolução.'
  },

  // ELEVENTH
  {
    id: '11', name: 'Décima Primeira', symbol: '11', intervals: [0, 4, 7, 10, 14, 17],
    formula: '1 - 3 - 5 - b7 - 9 - 11', intervalNames: ['Fundamental', 'Terça Maior', 'Quinta Justa', 'Sétima Menor', 'Nona', 'Décima Primeira'],
    category: 'eleventh', difficulty: 'advanced', planRequired: 'premium',
    description: 'O acorde de décima primeira empilha terças até a 11ª. Na prática, a terça maior é frequentemente omitida por conflitar com a 11ª.',
    tip: 'Usado em jazz moderno e fusão. Na prática, simplifica-se omitindo a 3ª e/ou a 5ª.'
  },
  {
    id: 'm11', name: 'Menor 11', symbol: 'm11', intervals: [0, 3, 7, 10, 14, 17],
    formula: '1 - b3 - 5 - b7 - 9 - 11', intervalNames: ['Fundamental', 'Terça Menor', 'Quinta Justa', 'Sétima Menor', 'Nona', 'Décima Primeira'],
    category: 'eleventh', difficulty: 'advanced', planRequired: 'premium',
    description: 'Combina o acorde m9 com a 11ª justa. Sonoridade muito rica, aberta e modal.',
    tip: 'Som característico do jazz modal e neo-soul. A 11ª justa não conflita com a terça menor.'
  },
  {
    id: '7s11', name: 'Dominante #11', symbol: '7(#11)', intervals: [0, 4, 7, 10, 14, 18],
    formula: '1 - 3 - 5 - b7 - 9 - #11', intervalNames: ['Fundamental', 'Terça Maior', 'Quinta Justa', 'Sétima Menor', 'Nona', 'Décima Primeira Aumentada'],
    category: 'eleventh', difficulty: 'advanced', planRequired: 'premium',
    description: 'O dominante #11 (acorde lídio dominante) é um dos sons mais sofisticados da harmonia jazz.',
    tip: 'Sonoridade do modo Lídio b7. Usado por grandes pianistas de jazz e em harmonia avançada.'
  },

  // THIRTEENTH
  {
    id: '13', name: 'Décima Terceira', symbol: '13', intervals: [0, 4, 7, 10, 14, 21],
    formula: '1 - 3 - 5 - b7 - 9 - 13', intervalNames: ['Fundamental', 'Terça Maior', 'Quinta Justa', 'Sétima Menor', 'Nona', 'Décima Terceira'],
    category: 'thirteenth', difficulty: 'advanced', planRequired: 'premium',
    description: 'O acorde de 13ª é um dominante com a adição da 13ª (sexta). Na prática, omite-se a 11ª e às vezes a 5ª.',
    tip: 'Acordes favorito em jazz, funk e soul. Substitui o V7 com extrema sofisticação.'
  },
  {
    id: 'maj13', name: 'Maior 13', symbol: 'maj13', intervals: [0, 4, 7, 11, 14, 21],
    formula: '1 - 3 - 5 - 7 - 9 - 13', intervalNames: ['Fundamental', 'Terça Maior', 'Quinta Justa', 'Sétima Maior', 'Nona', 'Décima Terceira'],
    category: 'thirteenth', difficulty: 'advanced', planRequired: 'premium',
    description: 'Combina maj9 com a 13ª, criando um acorde extremamente rico e luxuoso.',
    tip: 'Um dos acordes mais bonitos e completos. Usado em finalizações e momentos especiais de arranjos.'
  },
  {
    id: 'm13', name: 'Menor 13', symbol: 'm13', intervals: [0, 3, 7, 10, 14, 21],
    formula: '1 - b3 - 5 - b7 - 9 - 13', intervalNames: ['Fundamental', 'Terça Menor', 'Quinta Justa', 'Sétima Menor', 'Nona', 'Décima Terceira'],
    category: 'thirteenth', difficulty: 'advanced', planRequired: 'premium',
    description: 'Combina m9 com a 13ª. Sonoridade dórica completa e muito sofisticada.',
    tip: 'Som característico do modo dórico. Muito usado em jazz e fusão.'
  },

  // SPECIAL
  {
    id: 'power', name: 'Power Chord', symbol: '5', intervals: [0, 7],
    formula: '1 - 5', intervalNames: ['Fundamental', 'Quinta Justa'],
    category: 'special', difficulty: 'beginner', planRequired: 'premium',
    description: 'O power chord contém apenas a fundamental e a quinta. Sem terça, não é nem maior nem menor.',
    tip: 'O acorde mais usado no rock! Muito eficaz com distorção. Neutro harmonicamente.'
  },
  {
    id: '7sus4', name: '7sus4', symbol: '7sus4', intervals: [0, 5, 7, 10],
    formula: '1 - 4 - 5 - b7', intervalNames: ['Fundamental', 'Quarta Justa', 'Quinta Justa', 'Sétima Menor'],
    category: 'special', difficulty: 'intermediate', planRequired: 'premium',
    description: 'Combina o sus4 com a sétima menor. Cria tensão que resolve tanto para o V7 quanto para o I.',
    tip: 'Muito comum em gospel e pop. A resolução 7sus4 → 7 → I é uma progressão clássica.'
  },
  {
    id: 'add11', name: 'Add11', symbol: 'add11', intervals: [0, 4, 7, 17],
    formula: '1 - 3 - 5 - 11', intervalNames: ['Fundamental', 'Terça Maior', 'Quinta Justa', 'Décima Primeira'],
    category: 'special', difficulty: 'intermediate', planRequired: 'premium',
    description: 'Adiciona a 11ª justa à tríade maior sem a sétima. Na prática, a 11ª soa como uma 4ª uma oitava acima.',
    tip: 'Cria um efeito aberto e moderno. A distância entre 3ª e 11ª diminui o conflito harmônico.'
  },
];

// ═══════════════════════════════════════════════════════════
//  SCALES DATABASE
// ═══════════════════════════════════════════════════════════

export const SCALE_TYPES: ScaleType[] = [
  { id: 'major', name: 'Maior Natural (Jônio)', intervals: [0, 2, 4, 5, 7, 9, 11], formula: 'T-T-ST-T-T-T-ST', description: 'A escala mais fundamental da música ocidental.' },
  { id: 'natural_minor', name: 'Menor Natural (Eólio)', intervals: [0, 2, 3, 5, 7, 8, 10], formula: 'T-ST-T-T-ST-T-T', description: 'Escala menor mais básica, relativa da maior.' },
  { id: 'harmonic_minor', name: 'Menor Harmônica', intervals: [0, 2, 3, 5, 7, 8, 11], formula: 'T-ST-T-T-ST-1½T-ST', description: 'Menor com 7ª elevada. Cria o V7 no tom menor.' },
  { id: 'melodic_minor', name: 'Menor Melódica', intervals: [0, 2, 3, 5, 7, 9, 11], formula: 'T-ST-T-T-T-T-ST', description: 'Menor com 6ª e 7ª elevadas. Base de muitos modos do jazz.' },
  { id: 'pentatonic_major', name: 'Pentatônica Maior', intervals: [0, 2, 4, 7, 9], formula: 'T-T-1½T-T-1½T', description: '5 notas. Muito versátil para improvisação.' },
  { id: 'pentatonic_minor', name: 'Pentatônica Menor', intervals: [0, 3, 5, 7, 10], formula: '1½T-T-T-1½T-T', description: 'A escala mais usada em blues, rock e pop.' },
  { id: 'blues', name: 'Blues', intervals: [0, 3, 5, 6, 7, 10], formula: '1½T-T-ST-ST-1½T-T', description: 'Pentatônica menor + blue note (b5).' },
  { id: 'dorian', name: 'Dórico', intervals: [0, 2, 3, 5, 7, 9, 10], formula: 'T-ST-T-T-T-ST-T', description: 'Modo menor com 6ª maior. Som de jazz e funk.' },
  { id: 'phrygian', name: 'Frígio', intervals: [0, 1, 3, 5, 7, 8, 10], formula: 'ST-T-T-T-ST-T-T', description: 'Modo menor com 2ª menor. Som espanhol/flamenco.' },
  { id: 'lydian', name: 'Lídio', intervals: [0, 2, 4, 6, 7, 9, 11], formula: 'T-T-T-ST-T-T-ST', description: 'Modo maior com 4ª aumentada. Som brilhante e onírico.' },
  { id: 'mixolydian', name: 'Mixolídio', intervals: [0, 2, 4, 5, 7, 9, 10], formula: 'T-T-ST-T-T-ST-T', description: 'Modo maior com 7ª menor. Som do blues e rock.' },
  { id: 'locrian', name: 'Lócrio', intervals: [0, 1, 3, 5, 6, 8, 10], formula: 'ST-T-T-ST-T-T-T', description: 'Modo mais instável. Base do acorde meio-diminuto.' },
  { id: 'whole_tone', name: 'Tons Inteiros', intervals: [0, 2, 4, 6, 8, 10], formula: 'T-T-T-T-T-T', description: 'Apenas tons inteiros. Sonoridade flutuante e onírica.' },
  { id: 'diminished', name: 'Diminuta (Tom-Semitom)', intervals: [0, 2, 3, 5, 6, 8, 9, 11], formula: 'T-ST-T-ST-T-ST-T-ST', description: 'Escala simétrica de 8 notas alternando tom e semitom.' },
  { id: 'chromatic', name: 'Cromática', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], formula: 'ST-ST-ST-ST-ST-ST-ST-ST-ST-ST-ST-ST', description: 'Todas as 12 notas. Usada para efeitos e passagens.' },
];

// ═══════════════════════════════════════════════════════════
//  HARMONIC FIELD
// ═══════════════════════════════════════════════════════════

export const HARMONIC_FIELD_MAJOR = [
  { degree: 'I', type: 'maj7', quality: 'Tônica' },
  { degree: 'ii', type: 'm7', quality: 'Subdominante' },
  { degree: 'iii', type: 'm7', quality: 'Tônica' },
  { degree: 'IV', type: 'maj7', quality: 'Subdominante' },
  { degree: 'V', type: '7', quality: 'Dominante' },
  { degree: 'vi', type: 'm7', quality: 'Tônica' },
  { degree: 'vii°', type: 'm7b5', quality: 'Dominante' },
];

export const HARMONIC_FIELD_MINOR = [
  { degree: 'i', type: 'm7', quality: 'Tônica' },
  { degree: 'ii°', type: 'm7b5', quality: 'Subdominante' },
  { degree: 'III', type: 'maj7', quality: 'Tônica' },
  { degree: 'iv', type: 'm7', quality: 'Subdominante' },
  { degree: 'v', type: 'm7', quality: 'Dominante' },
  { degree: 'VI', type: 'maj7', quality: 'Subdominante' },
  { degree: 'VII', type: '7', quality: 'Dominante' },
];

// ═══════════════════════════════════════════════════════════
//  UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getNoteIndex(note: string): number {
  const idx = NOTE_NAMES_SHARP.indexOf(note);
  if (idx >= 0) return idx;
  return NOTE_NAMES_FLAT.indexOf(note);
}

export function getNoteName(index: number, preferFlat = false): string {
  const normalized = ((index % 12) + 12) % 12;
  return preferFlat ? NOTE_NAMES_FLAT[normalized] : NOTE_NAMES_SHARP[normalized];
}

export function getChordNotes(root: string, chordType: ChordType): string[] {
  const rootIndex = getNoteIndex(root);
  return chordType.intervals.map(interval => getNoteName(rootIndex + interval));
}

export function getChordMidiNotes(root: string, chordType: ChordType, octave: number = 4): number[] {
  const rootIndex = getNoteIndex(root);
  const baseMidi = 12 * (octave + 1) + rootIndex; // C4 = 60
  return chordType.intervals.map(interval => baseMidi + interval);
}

export function getInversions(root: string, chordType: ChordType): string[][] {
  const notes = getChordNotes(root, chordType);
  const inversions: string[][] = [notes];
  for (let i = 1; i < notes.length; i++) {
    const inv = [...notes.slice(i), ...notes.slice(0, i)];
    inversions.push(inv);
  }
  return inversions;
}

export function getScaleNotes(root: string, scale: ScaleType): string[] {
  const rootIndex = getNoteIndex(root);
  return scale.intervals.map(interval => getNoteName(rootIndex + interval));
}

export function midiToNoteName(midi: number): string {
  return NOTE_NAMES_SHARP[midi % 12];
}

export function midiToOctave(midi: number): number {
  return Math.floor(midi / 12) - 1;
}

export function noteToMidi(note: string, octave: number): number {
  return 12 * (octave + 1) + getNoteIndex(note);
}

export function getSolfegeFromNote(note: string): string {
  return SOLFEGE_NAMES[note] || note;
}

export function getRelatedScales(chordType: ChordType): ScaleType[] {
  const related: ScaleType[] = [];
  if (chordType.id === 'major' || chordType.id === 'maj7' || chordType.id === 'maj9') {
    related.push(...SCALE_TYPES.filter(s => ['major', 'lydian', 'pentatonic_major'].includes(s.id)));
  } else if (chordType.id === 'minor' || chordType.id === 'm7' || chordType.id === 'm9') {
    related.push(...SCALE_TYPES.filter(s => ['natural_minor', 'dorian', 'pentatonic_minor'].includes(s.id)));
  } else if (chordType.id === '7' || chordType.id === '9' || chordType.id === '13') {
    related.push(...SCALE_TYPES.filter(s => ['mixolydian', 'blues', 'pentatonic_minor'].includes(s.id)));
  } else if (chordType.id === 'dim' || chordType.id === 'dim7') {
    related.push(...SCALE_TYPES.filter(s => ['diminished', 'locrian'].includes(s.id)));
  } else if (chordType.id === 'm7b5') {
    related.push(...SCALE_TYPES.filter(s => ['locrian'].includes(s.id)));
  } else if (chordType.id === 'aug') {
    related.push(...SCALE_TYPES.filter(s => ['whole_tone'].includes(s.id)));
  } else {
    related.push(SCALE_TYPES[0]);
  }
  return related;
}
