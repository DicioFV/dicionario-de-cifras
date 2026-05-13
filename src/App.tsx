import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DictionaryPage from './pages/DictionaryPage';
import ScalesPage from './pages/ScalesPage';
import HarmonyPage from './pages/HarmonyPage';
import QuizPage from './pages/QuizPage';
import PlansPage from './pages/PlansPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

// ═══════════════════════════════════════════════════════════════════════════
// 🎵 DICIONÁRIO DE CIFRAS
// Seu Guia Definitivo de Acordes
// dicionariodecifras.com.br
// ═══════════════════════════════════════════════════════════════════════════

function AppContent() {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'dictionary': return <DictionaryPage />;
      case 'scales': return <ScalesPage />;
      case 'harmony': return <HarmonyPage />;
      case 'quiz': return <QuizPage />;
      case 'plans': return <PlansPage />;
      case 'login': return <LoginPage />;
      case 'profile': return <ProfilePage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Gradient Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-500/[0.07] rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-500/[0.05] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-blue-500/[0.05] rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10">
        <Header />
        
        <main className="pb-24 md:pb-8">
          {renderPage()}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════

function Footer() {
  const { setCurrentPage } = useApp();

  return (
    <footer className="border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎵</span>
              <div>
                <span className="text-sm font-bold text-gradient-gold">DICIONÁRIO DE CIFRAS</span>
                <p className="text-[9px] text-gray-600 tracking-wider">SEU GUIA DE ACORDES</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
              A plataforma mais completa para aprender acordes de Teclado, Violão, Guitarra e Ukulele. 
              Interativo, com áudio real e explicações didáticas.
            </p>
          </div>

          {/* Instrumentos */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Instrumentos</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><button onClick={() => setCurrentPage('dictionary')} className="hover:text-amber-400 transition-colors">🎹 Teclado</button></li>
              <li><span className="text-gray-600">🎸 Violão (em breve)</span></li>
              <li><span className="text-gray-600">🎸 Guitarra (em breve)</span></li>
              <li><span className="text-gray-600">🪕 Ukulele (em breve)</span></li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Recursos</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><button onClick={() => setCurrentPage('dictionary')} className="hover:text-amber-400 transition-colors">📖 Dicionário de Acordes</button></li>
              <li><button onClick={() => setCurrentPage('scales')} className="hover:text-amber-400 transition-colors">🎼 Escalas Musicais</button></li>
              <li><button onClick={() => setCurrentPage('harmony')} className="hover:text-amber-400 transition-colors">🎵 Campo Harmônico</button></li>
              <li><button onClick={() => setCurrentPage('quiz')} className="hover:text-amber-400 transition-colors">🎮 Quiz de Acordes</button></li>
            </ul>
          </div>

          {/* Sobre */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Plataforma</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><button onClick={() => setCurrentPage('plans')} className="hover:text-amber-400 transition-colors">💎 Planos e Preços</button></li>
              <li><span className="text-gray-600">📧 contato@dicionariodecifras.com.br</span></li>
              <li><span className="text-gray-600">📱 @dicionariodecifras</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-600">
          <p>© {new Date().getFullYear()} Dicionário de Cifras. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>v1.0.0</span>
            <span className="text-amber-600">Feito com ❤️ para músicos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

function MobileNav() {
  const { currentPage, setCurrentPage, user } = useApp();

  const items = [
    { id: 'home', label: 'Início', icon: '🏠' },
    { id: 'dictionary', label: 'Acordes', icon: '🎵' },
    { id: 'scales', label: 'Escalas', icon: '🎼' },
    { id: 'quiz', label: 'Quiz', icon: '🎮' },
    { id: user ? 'profile' : 'login', label: user ? 'Perfil' : 'Entrar', icon: user ? '👤' : '🔐' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-2xl border-t border-white/10 safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all touch-feedback
              ${currentPage === item.id
                ? 'text-amber-400 bg-amber-400/10'
                : 'text-gray-500 active:text-gray-300'
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APP EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
