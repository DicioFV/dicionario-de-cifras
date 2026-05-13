import { useState } from 'react';
import { useApp } from '../context/AppContext';

// ═══════════════════════════════════════════════════════════════════════════
// 🎵 HEADER — Navegação Principal Premium
// ═══════════════════════════════════════════════════════════════════════════

export default function Header() {
  const { user, logout, currentPage, setCurrentPage, currentInstrument, setCurrentInstrument } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início', icon: '🏠' },
    { id: 'dictionary', label: 'Acordes', icon: '🎵' },
    { id: 'scales', label: 'Escalas', icon: '🎼' },
    { id: 'harmony', label: 'Campo Harmônico', icon: '🎹' },
    { id: 'quiz', label: 'Quiz', icon: '🎮' },
  ];

  const instruments = [
    { id: 'teclado' as const, label: 'Teclado', icon: '🎹' },
    { id: 'violao' as const, label: 'Violão', icon: '🎸' },
    { id: 'guitarra' as const, label: 'Guitarra', icon: '🎸' },
    { id: 'ukulele' as const, label: 'Ukulele', icon: '🪕' },
  ];

  const getPlanBadge = () => {
    if (!user) return null;
    const badges: Record<string, { color: string; icon: string }> = {
      free: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: '' },
      pro: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '⭐' },
      premium: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '👑' },
      vip: { color: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30', icon: '💎' },
    };
    const badge = badges[user.plan] || badges.free;
    if (user.plan === 'free') return null;
    return (
      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${badge.color}`}>
        {badge.icon} {user.plan}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/90 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => { setCurrentPage('home'); setMenuOpen(false); }}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="relative flex items-center justify-center">
              <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">🎵</span>
              <div className="absolute -inset-3 rounded-full bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-[13px] sm:text-sm font-extrabold text-gradient-gold leading-tight tracking-wide">
                DICIONÁRIO DE CIFRAS
              </h1>
              <p className="text-[8px] sm:text-[9px] text-gray-500 font-medium tracking-[0.15em] uppercase">
                Seu Guia Definitivo de Acordes
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200
                  ${currentPage === item.id
                    ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-300 shadow-inner'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                  }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Instrument Selector (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/[0.05]">
            {instruments.slice(0, 2).map(inst => (
              <button
                key={inst.id}
                onClick={() => setCurrentInstrument(inst.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200
                  ${currentInstrument === inst.id
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300'
                    : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                <span className="mr-1">{inst.icon}</span>
                {inst.label}
              </button>
            ))}
            <span className="text-gray-600 text-[10px] px-1">+2</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {/* User */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage('profile')}
                  className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.05]"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-amber-500/20">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-[11px] text-gray-300 font-medium leading-tight">{user.name.split(' ')[0]}</div>
                    {getPlanBadge()}
                  </div>
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                  title="Sair"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[12px] sm:text-[13px] font-bold
                  hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 active:scale-95"
              >
                Entrar
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/[0.06] text-gray-400"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="lg:hidden pb-4 animate-slideDown">
            {/* Instruments */}
            <div className="flex gap-1 mb-3 overflow-x-auto pb-2 scrollbar-none">
              {instruments.map(inst => (
                <button
                  key={inst.id}
                  onClick={() => { setCurrentInstrument(inst.id); }}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all
                    ${currentInstrument === inst.id
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-white/[0.03] text-gray-400 border border-transparent'
                    }`}
                >
                  <span className="mr-1">{inst.icon}</span>
                  {inst.label}
                </button>
              ))}
            </div>
            
            {/* Nav Items */}
            <div className="flex flex-col gap-0.5">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentPage(item.id); setMenuOpen(false); }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left
                    ${currentPage === item.id
                      ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-300'
                      : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                    }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { setCurrentPage('plans'); setMenuOpen(false); }}
                className="px-4 py-3 rounded-xl text-sm font-medium text-left text-purple-400 hover:bg-purple-500/10"
              >
                <span className="mr-2">💎</span>
                Planos
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
