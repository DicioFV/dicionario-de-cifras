import { useState } from 'react';
import { useApp } from '../context/AppContext';

// ═══════════════════════════════════════════════════════════════════════════
// 👤 PROFILE PAGE — Perfil do Usuário e Configurações
// ═══════════════════════════════════════════════════════════════════════════

export default function ProfilePage() {
  const {
    user, setCurrentPage, notation, setNotation, showNoteNames, setShowNoteNames,
    showDegrees, setShowDegrees, volume, setVolume, arpeggioSpeed, setArpeggioSpeed,
    applyVipCode, logout
  } = useApp();

  const [vipCode, setVipCode] = useState('');
  const [vipMessage, setVipMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!user) {
    setCurrentPage('login');
    return null;
  }

  const xpLevels = [
    { name: 'Iniciante', minXP: 0, maxXP: 100 },
    { name: 'Aprendiz', minXP: 100, maxXP: 500 },
    { name: 'Músico', minXP: 500, maxXP: 1500 },
    { name: 'Avançado', minXP: 1500, maxXP: 3000 },
    { name: 'Expert', minXP: 3000, maxXP: 5000 },
    { name: 'Mestre', minXP: 5000, maxXP: 10000 },
  ];

  const currentLevel = xpLevels.find(l => user.xp >= l.minXP && user.xp < l.maxXP) || xpLevels[xpLevels.length - 1];
  const xpProgress = ((user.xp - currentLevel.minXP) / (currentLevel.maxXP - currentLevel.minXP)) * 100;
  const xpToNext = currentLevel.maxXP - user.xp;

  const handleApplyVipCode = () => {
    if (!vipCode.trim()) {
      setVipMessage({ type: 'error', text: 'Digite um código válido.' });
      return;
    }
    const success = applyVipCode(vipCode);
    if (success) {
      setVipMessage({ type: 'success', text: '🎉 Código VIP ativado com sucesso! Você agora tem acesso completo.' });
      setVipCode('');
    } else {
      setVipMessage({ type: 'error', text: 'Código inválido. Verifique e tente novamente.' });
    }
  };

  const getPlanInfo = () => {
    const plans: Record<string, { name: string; icon: string; color: string }> = {
      free: { name: 'Free', icon: '🆓', color: 'text-gray-400' },
      pro: { name: 'Pro', icon: '⭐', color: 'text-blue-400' },
      premium: { name: 'Premium', icon: '👑', color: 'text-purple-400' },
      vip: { name: 'VIP Aluno', icon: '💎', color: 'text-amber-400' },
    };
    return plans[user.plan] || plans.free;
  };

  const planInfo = getPlanInfo();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-3xl p-6 sm:p-8 border border-white/10 text-center">
        {/* Avatar */}
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-amber-500/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full ${
            user.plan === 'vip' ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
            user.plan === 'premium' ? 'bg-gradient-to-r from-purple-400 to-pink-500' :
            user.plan === 'pro' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
            'bg-gray-500'
          } flex items-center justify-center text-sm shadow-lg border-2 border-[#0a0a0f]`}>
            {planInfo.icon}
          </div>
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
        <p className="text-gray-500 text-sm">{user.email}</p>

        {/* Plan Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <span className={`font-bold ${planInfo.color}`}>
            {planInfo.icon} Plano {planInfo.name}
          </span>
          {user.plan !== 'vip' && user.plan !== 'premium' && (
            <button
              onClick={() => setCurrentPage('plans')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              Upgrade →
            </button>
          )}
        </div>

        {/* XP Progress */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Nível: <strong className="text-white">{user.level}</strong>
            </span>
            <span className="text-amber-400 font-mono font-bold">{user.xp} XP</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 relative"
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            >
              <div className="absolute inset-0 animate-shimmer" />
            </div>
          </div>
          <p className="text-[11px] text-gray-600 text-center">
            {xpToNext > 0 ? `${xpToNext} XP para o próximo nível` : 'Nível máximo atingido! 🏆'}
          </p>
        </div>
      </div>

      {/* VIP Code Section */}
      {user.plan !== 'vip' && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20">
          <div className="flex items-start gap-4">
            <span className="text-3xl">💎</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Código VIP de Aluno</h3>
              <p className="text-xs text-gray-400 mb-4">
                Se você é aluno do curso na Hotmart, insira seu código para liberar acesso completo gratuito.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={vipCode}
                  onChange={e => setVipCode(e.target.value.toUpperCase())}
                  placeholder="CÓDIGO VIP"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600
                    focus:outline-none focus:border-amber-400/50 uppercase tracking-widest font-mono text-center"
                  maxLength={20}
                />
                <button
                  onClick={handleApplyVipCode}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold
                    hover:from-amber-400 hover:to-orange-400 transition-all"
                >
                  Ativar
                </button>
              </div>
              {vipMessage && (
                <p className={`mt-3 text-sm ${vipMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {vipMessage.text}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/10 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>⚙️</span> Configurações
        </h3>

        {/* Notation */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium text-sm">Notação Musical</div>
            <div className="text-gray-600 text-xs">Cifra (C, D, E) ou Solfejo (Dó, Ré, Mi)</div>
          </div>
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setNotation('cipher')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all
                ${notation === 'cipher' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              Cifra
            </button>
            <button
              onClick={() => setNotation('solfege')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all
                ${notation === 'solfege' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              Solfejo
            </button>
          </div>
        </div>

        {/* Toggle: Note Names */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium text-sm">Nomes nas Teclas</div>
            <div className="text-gray-600 text-xs">Mostrar nome das notas no teclado</div>
          </div>
          <button
            onClick={() => setShowNoteNames(!showNoteNames)}
            className={`w-14 h-8 rounded-full transition-all relative ${showNoteNames ? 'bg-amber-500' : 'bg-white/20'}`}
          >
            <div
              className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all"
              style={{ left: showNoteNames ? '26px' : '4px' }}
            />
          </button>
        </div>

        {/* Toggle: Degrees */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium text-sm">Graus do Acorde</div>
            <div className="text-gray-600 text-xs">Mostrar intervalos (1, 3, 5, 7...)</div>
          </div>
          <button
            onClick={() => setShowDegrees(!showDegrees)}
            className={`w-14 h-8 rounded-full transition-all relative ${showDegrees ? 'bg-amber-500' : 'bg-white/20'}`}
          >
            <div
              className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all"
              style={{ left: showDegrees ? '26px' : '4px' }}
            />
          </button>
        </div>

        {/* Volume */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-white font-medium text-sm">Volume</div>
            <span className="text-amber-400 font-mono text-sm font-bold">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Arpeggio Speed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-white font-medium text-sm">Velocidade do Arpejo</div>
            <span className="text-amber-400 font-mono text-sm font-bold">{arpeggioSpeed}ms</span>
          </div>
          <input
            type="range"
            min="80"
            max="500"
            step="20"
            value={arpeggioSpeed}
            onChange={e => setArpeggioSpeed(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Favorites */}
      {user.favorites.length > 0 && (
        <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <span>❤️</span> Favoritos ({user.favorites.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.favorites.slice(0, 20).map(fav => (
              <span
                key={fav}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-mono border border-red-500/20"
              >
                {fav}
              </span>
            ))}
            {user.favorites.length > 20 && (
              <span className="px-3 py-1.5 text-gray-500 text-sm">+{user.favorites.length - 20} mais</span>
            )}
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="pt-4">
        <button
          onClick={logout}
          className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-semibold border border-red-500/20
            hover:bg-red-500/20 transition-all"
        >
          Sair da Conta
        </button>
      </div>
    </div>
  );
}
