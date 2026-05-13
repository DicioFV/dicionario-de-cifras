import { useState } from 'react';
import { useApp } from '../context/AppContext';

// ═══════════════════════════════════════════════════════════════════════════
// 🔐 LOGIN PAGE — Autenticação e Cadastro Premium
// ═══════════════════════════════════════════════════════════════════════════

export default function LoginPage() {
  const { login, signup, setCurrentPage } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'vip'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vipCode, setVipCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'signup') {
      if (!name || !email || !password) {
        setError('Preencha todos os campos.');
        return;
      }
      if (password.length < 4) {
        setError('A senha deve ter pelo menos 4 caracteres.');
        return;
      }
      const ok = signup(name, email, password);
      if (!ok) {
        setError('Este e-mail já está cadastrado.');
        return;
      }
      // Sucesso - redireciona automaticamente
    } else if (mode === 'login') {
      if (!email || !password) {
        setError('Preencha todos os campos.');
        return;
      }
      const ok = login(email, password);
      if (!ok) {
        setError('E-mail ou senha incorretos.');
        return;
      }
      // Sucesso - redireciona automaticamente
    }
  };

  const handleVipCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!vipCode.trim()) {
      setError('Digite o código VIP.');
      return;
    }
    // Para usar VIP, precisa estar logado primeiro
    // Aqui vamos apenas mostrar instruções
    setError('Faça login primeiro, depois acesse seu perfil para ativar o código VIP.');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block animate-bounce-soft">🎵</span>
          <h1 className="text-2xl font-bold text-gradient-gold font-[Playfair_Display]">
            Dicionário de Cifras
          </h1>
          <p className="text-gray-500 text-sm mt-1">Seu Guia Definitivo de Acordes</p>
        </div>

        {/* Card */}
        <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-6">
            {[
              { id: 'login', label: 'Entrar' },
              { id: 'signup', label: 'Cadastrar' },
              { id: 'vip', label: '🎁 VIP' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setMode(tab.id as typeof mode); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all
                  ${mode === tab.id
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300'
                    : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* VIP Code Form */}
          {mode === 'vip' ? (
            <form onSubmit={handleVipCode} className="space-y-4">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">💎</span>
                <h3 className="text-lg font-bold text-white">Acesso VIP Aluno</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Se você é aluno do curso na Hotmart, use seu código especial para acesso completo gratuito.
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Código VIP</label>
                <input
                  type="text"
                  value={vipCode}
                  onChange={e => setVipCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 
                    focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all uppercase tracking-widest text-center font-mono text-lg"
                  placeholder="XXXXXXXX"
                  maxLength={20}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg
                  hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg shadow-purple-500/25 active:scale-[0.98]"
              >
                Ativar Código VIP
              </button>

              <p className="text-center text-xs text-gray-600">
                Não tem código? <button type="button" onClick={() => setMode('signup')} className="text-amber-400 hover:underline">Cadastre-se gratuitamente</button>
              </p>
            </form>
          ) : (
            /* Login/Signup Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 
                      focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    placeholder="Seu nome completo"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 
                    focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 
                    focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-green-400 text-sm text-center">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg
                  hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 active:scale-[0.98]"
              >
                {mode === 'signup' ? 'Criar Conta Grátis' : 'Entrar'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-500">
              {mode === 'login' ? 'Não tem conta?' : mode === 'signup' ? 'Já tem conta?' : 'Prefere se cadastrar?'}{' '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
              >
                {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
              </button>
            </p>
          </div>
        </div>

        {/* Guest Access */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            ← Continuar como visitante
          </button>
        </div>

        {/* Plan hint */}
        <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
          <p className="text-xs text-gray-600">
            🆓 <span className="text-gray-400">Plano Free:</span> Acordes básicos grátis<br />
            ⭐ <span className="text-gray-400">Plano Pro:</span> Todos os acordes por R$19,90/mês<br />
            👑 <span className="text-gray-400">Premium:</span> Tudo + cursos por R$39,90/mês
          </p>
        </div>
      </div>
    </div>
  );
}
