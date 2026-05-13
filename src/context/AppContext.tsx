import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// 🎵 DICIONÁRIO DE CIFRAS — CONTEXTO GLOBAL
// Gerencia: Auth, Planos, Preferências, Navegação
// ═══════════════════════════════════════════════════════════════════════════

// Tipos de Plano
export type Plan = 'free' | 'pro' | 'premium' | 'vip';

// Tipos de Instrumento
export type Instrument = 'teclado' | 'violao' | 'guitarra' | 'ukulele';

// Modos de Visualização
export type ViewMode = 'chord' | 'partial' | 'complete';

// Notação Musical
export type Notation = 'cipher' | 'solfege';

// Tema
export type ThemeMode = 'dark' | 'light';

// Usuário
export interface User {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  avatar?: string;
  xp: number;
  level: string;
  streak: number;
  favorites: string[];
  history: string[];
  createdAt: string;
  vipCode?: string; // Código VIP para alunos Hotmart
}

// Níveis de XP
const LEVELS = [
  { name: 'Iniciante', minXP: 0, icon: '🌱' },
  { name: 'Aprendiz', minXP: 100, icon: '📚' },
  { name: 'Músico', minXP: 500, icon: '🎵' },
  { name: 'Avançado', minXP: 1500, icon: '🎸' },
  { name: 'Expert', minXP: 3000, icon: '⭐' },
  { name: 'Mestre', minXP: 5000, icon: '👑' },
];

function getLevel(xp: number): { name: string; icon: string } {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXP) level = l;
  }
  return level;
}

// Códigos VIP válidos (alunos Hotmart)
const VALID_VIP_CODES = ['ALUNO2025', 'TECLADOVIP', 'FELIPE100', 'HOTMART2025'];

// Interface do Contexto
interface AppState {
  // Estado do usuário
  user: User | null;
  isAuthenticated: boolean;
  
  // Preferências
  theme: ThemeMode;
  notation: Notation;
  viewMode: ViewMode;
  showNoteNames: boolean;
  showDegrees: boolean;
  volume: number;
  arpeggioSpeed: number;
  
  // Navegação
  currentPage: string;
  currentInstrument: Instrument;
  
  // Seleção de acordes (teclado)
  selectedRoot: string;
  selectedChordId: string;
  selectedCategory: string;
  
  // Ações de Auth
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  applyVipCode: (code: string) => boolean;
  
  // Ações de Preferências
  setTheme: (theme: ThemeMode) => void;
  setNotation: (notation: Notation) => void;
  setViewMode: (mode: ViewMode) => void;
  setShowNoteNames: (show: boolean) => void;
  setShowDegrees: (show: boolean) => void;
  setVolume: (vol: number) => void;
  setArpeggioSpeed: (speed: number) => void;
  
  // Ações de Navegação
  setCurrentPage: (page: string) => void;
  setCurrentInstrument: (instrument: Instrument) => void;
  
  // Ações de Seleção
  setSelectedRoot: (root: string) => void;
  setSelectedChordId: (id: string) => void;
  setSelectedCategory: (cat: string) => void;
  
  // Ações de Usuário
  toggleFavorite: (chordKey: string) => void;
  addToHistory: (chordKey: string) => void;
  addXP: (amount: number) => void;
  
  // Verificações de Acesso
  canAccess: (requiredPlan: Plan) => boolean;
  canAccessInstrument: (instrument: Instrument) => boolean;
  upgradePlan: (plan: Plan) => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}

// Chave do localStorage
const STORAGE_KEY = 'dicionario_cifras_state';
const USERS_KEY = 'dicionario_cifras_users';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveState(data: Record<string, unknown>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = loadState();

  // Estado do usuário
  const [user, setUser] = useState<User | null>(saved?.user || null);
  
  // Preferências
  const [theme, setThemeState] = useState<ThemeMode>(saved?.theme || 'dark');
  const [notation, setNotationState] = useState<Notation>(saved?.notation || 'cipher');
  const [viewMode, setViewModeState] = useState<ViewMode>(saved?.viewMode || 'chord');
  const [showNoteNames, setShowNoteNamesState] = useState(saved?.showNoteNames ?? true);
  const [showDegrees, setShowDegreesState] = useState(saved?.showDegrees ?? false);
  const [volume, setVolumeState] = useState(saved?.volume ?? 0.5);
  const [arpeggioSpeed, setArpeggioSpeedState] = useState(saved?.arpeggioSpeed ?? 200);
  
  // Navegação
  const [currentPage, setCurrentPageState] = useState(saved?.currentPage || 'home');
  const [currentInstrument, setCurrentInstrumentState] = useState<Instrument>(saved?.currentInstrument || 'teclado');
  
  // Seleção
  const [selectedRoot, setSelectedRootState] = useState(saved?.selectedRoot || 'C');
  const [selectedChordId, setSelectedChordIdState] = useState(saved?.selectedChordId || 'major');
  const [selectedCategory, setSelectedCategoryState] = useState(saved?.selectedCategory || 'triads');

  // Persistir estado
  useEffect(() => {
    saveState({
      user, theme, notation, viewMode, showNoteNames, showDegrees, volume, arpeggioSpeed,
      currentPage, currentInstrument, selectedRoot, selectedChordId, selectedCategory
    });
  }, [user, theme, notation, viewMode, showNoteNames, showDegrees, volume, arpeggioSpeed,
      currentPage, currentInstrument, selectedRoot, selectedChordId, selectedCategory]);

  // Aplicar tema
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // ═══════════════════════════════════════════════════════════════════════════
  // FUNÇÕES DE AUTENTICAÇÃO
  // ═══════════════════════════════════════════════════════════════════════════

  const login = useCallback((email: string, password: string): boolean => {
    try {
      const usersRaw = localStorage.getItem(USERS_KEY);
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const found = users.find((u: { email: string; password: string }) => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (found) {
        const { password: _, ...userWithoutPassword } = found;
        setUser(userWithoutPassword);
        setCurrentPageState('home');
        return true;
      }
    } catch {}
    return false;
  }, []);

  const signup = useCallback((name: string, email: string, password: string): boolean => {
    try {
      const usersRaw = localStorage.getItem(USERS_KEY);
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      if (users.find((u: { email: string }) => u.email.toLowerCase() === email.toLowerCase())) {
        return false; // Email já existe
      }
      const newUser: User = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        name,
        email: email.toLowerCase(),
        plan: 'free',
        xp: 0,
        level: 'Iniciante',
        streak: 0,
        favorites: [],
        history: [],
        createdAt: new Date().toISOString()
      };
      users.push({ ...newUser, password });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      setUser(newUser);
      setCurrentPageState('home');
      return true;
    } catch {}
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCurrentPageState('home');
  }, []);

  const applyVipCode = useCallback((code: string): boolean => {
    if (!user) return false;
    const normalizedCode = code.toUpperCase().trim();
    if (VALID_VIP_CODES.includes(normalizedCode)) {
      const updatedUser = { ...user, plan: 'vip' as Plan, vipCode: normalizedCode };
      setUser(updatedUser);
      // Atualizar no banco de usuários
      try {
        const usersRaw = localStorage.getItem(USERS_KEY);
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const idx = users.findIndex((u: { email: string }) => u.email === user.email);
        if (idx >= 0) {
          users[idx].plan = 'vip';
          users[idx].vipCode = normalizedCode;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
      } catch {}
      return true;
    }
    return false;
  }, [user]);

  // ═══════════════════════════════════════════════════════════════════════════
  // VERIFICAÇÕES DE ACESSO
  // ═══════════════════════════════════════════════════════════════════════════

  const canAccess = useCallback((requiredPlan: Plan): boolean => {
    if (requiredPlan === 'free') return true;
    if (!user) return false;
    const planOrder: Plan[] = ['free', 'pro', 'premium', 'vip'];
    return planOrder.indexOf(user.plan) >= planOrder.indexOf(requiredPlan);
  }, [user]);

  const canAccessInstrument = useCallback((instrument: Instrument): boolean => {
    // Teclado é sempre disponível (pelo menos parcialmente)
    if (instrument === 'teclado') return true;
    // Outros instrumentos requerem Pro ou superior
    return canAccess('pro');
  }, [canAccess]);

  // ═══════════════════════════════════════════════════════════════════════════
  // FUNÇÕES DE USUÁRIO
  // ═══════════════════════════════════════════════════════════════════════════

  const toggleFavorite = useCallback((chordKey: string) => {
    setUser(prev => {
      if (!prev) return prev;
      const favorites = prev.favorites.includes(chordKey)
        ? prev.favorites.filter(f => f !== chordKey)
        : [...prev.favorites, chordKey];
      const updated = { ...prev, favorites };
      // Atualizar no banco
      try {
        const usersRaw = localStorage.getItem(USERS_KEY);
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const idx = users.findIndex((u: { email: string }) => u.email === prev.email);
        if (idx >= 0) {
          users[idx].favorites = favorites;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
      } catch {}
      return updated;
    });
  }, []);

  const addToHistory = useCallback((chordKey: string) => {
    setUser(prev => {
      if (!prev) return prev;
      const history = [chordKey, ...prev.history.filter(h => h !== chordKey)].slice(0, 100);
      return { ...prev, history };
    });
  }, []);

  const addXP = useCallback((amount: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const xp = prev.xp + amount;
      const levelInfo = getLevel(xp);
      return { ...prev, xp, level: levelInfo.name };
    });
  }, []);

  const upgradePlan = useCallback((plan: Plan) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, plan };
      try {
        const usersRaw = localStorage.getItem(USERS_KEY);
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const idx = users.findIndex((u: { email: string }) => u.email === prev.email);
        if (idx >= 0) {
          users[idx].plan = plan;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
      } catch {}
      return updated;
    });
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // PROVIDER
  // ═══════════════════════════════════════════════════════════════════════════

  const isAuthenticated = user !== null;

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated,
      theme,
      notation,
      viewMode,
      showNoteNames,
      showDegrees,
      volume,
      arpeggioSpeed,
      currentPage,
      currentInstrument,
      selectedRoot,
      selectedChordId,
      selectedCategory,
      login,
      signup,
      logout,
      applyVipCode,
      setTheme: setThemeState,
      setNotation: setNotationState,
      setViewMode: setViewModeState,
      setShowNoteNames: setShowNoteNamesState,
      setShowDegrees: setShowDegreesState,
      setVolume: setVolumeState,
      setArpeggioSpeed: setArpeggioSpeedState,
      setCurrentPage: setCurrentPageState,
      setCurrentInstrument: setCurrentInstrumentState,
      setSelectedRoot: setSelectedRootState,
      setSelectedChordId: setSelectedChordIdState,
      setSelectedCategory: setSelectedCategoryState,
      toggleFavorite,
      addToHistory,
      addXP,
      canAccess,
      canAccessInstrument,
      upgradePlan,
    }}>
      {children}
    </AppContext.Provider>
  );
}
