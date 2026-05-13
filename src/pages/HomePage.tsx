import { useApp } from '../context/AppContext';
import type { Instrument } from '../context/AppContext';

// ═══════════════════════════════════════════════════════════════════════════
// 🏠 HOME PAGE — Seletor de Instrumentos e Destaque
// ═══════════════════════════════════════════════════════════════════════════

export default function HomePage() {
  const { setCurrentPage, setCurrentInstrument, user } = useApp();

  const instruments: {
    id: Instrument;
    name: string;
    icon: string;
    description: string;
    color: string;
    gradient: string;
    available: boolean;
  }[] = [
    {
      id: 'teclado',
      name: 'Teclado',
      icon: '🎹',
      description: 'Piano, teclado, sintetizador. Aprenda todos os acordes com visualização no teclado virtual.',
      color: 'amber',
      gradient: 'from-amber-500 to-orange-500',
      available: true,
    },
    {
      id: 'violao',
      name: 'Violão',
      icon: '🎸',
      description: 'Violão acústico e clássico. Diagramas de acordes e escalas no braço do instrumento.',
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
      available: false, // Em breve
    },
    {
      id: 'guitarra',
      name: 'Guitarra',
      icon: '🎸',
      description: 'Guitarra elétrica. Power chords, escalas em boxes e técnicas específicas.',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      available: false, // Em breve
    },
    {
      id: 'ukulele',
      name: 'Ukulele',
      icon: '🪕',
      description: 'Ukulele soprano, concert e tenor. Acordes adaptados para 4 cordas.',
      color: 'cyan',
      gradient: 'from-cyan-500 to-blue-500',
      available: false, // Em breve
    },
  ];

  const features = [
    { icon: '🎵', title: 'Todos os Acordes', desc: 'Tríades, tétrades, extensões e muito mais' },
    { icon: '🔄', title: '12 Tonalidades', desc: 'Transpor qualquer acorde em 1 clique' },
    { icon: '🎧', title: 'Áudio Real', desc: 'Ouça cada acorde e arpejo' },
    { icon: '📚', title: 'Teoria Musical', desc: 'Explicação didática completa' },
    { icon: '🎼', title: 'Escalas', desc: 'Todas as escalas relacionadas' },
    { icon: '🎮', title: 'Quiz', desc: 'Teste seus conhecimentos' },
  ];

  const handleSelectInstrument = (inst: typeof instruments[0]) => {
    if (inst.available) {
      setCurrentInstrument(inst.id);
      setCurrentPage('dictionary');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          {/* Logo animado */}
          <div className="mb-6 animate-float">
            <span className="text-6xl sm:text-7xl drop-shadow-2xl">🎵</span>
          </div>

          {/* Título */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-[Playfair_Display] mb-4 leading-tight">
            <span className="text-gradient-gold">Dicionário</span>{' '}
            <span className="text-white">de</span>{' '}
            <span className="text-gradient-royal">Cifras</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Seu <span className="text-amber-400 font-semibold">guia definitivo</span> de acordes para 
            Teclado, Violão, Guitarra e Ukulele. 
            <span className="text-gray-500"> Interativo, com áudio e 100% profissional.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => { setCurrentInstrument('teclado'); setCurrentPage('dictionary'); }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg
                hover:from-amber-400 hover:to-orange-400 transition-all shadow-2xl shadow-amber-500/30 
                active:scale-95 animate-pulse-glow"
            >
              🎹 Começar com Teclado
            </button>
            <button
              onClick={() => setCurrentPage('plans')}
              className="px-8 py-4 rounded-2xl bg-white/5 text-white font-semibold text-lg border border-white/10
                hover:bg-white/10 transition-all"
            >
              Ver Planos
            </button>
          </div>

          {/* User greeting */}
          {user && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="text-sm text-gray-400">Olá,</span>
              <span className="text-sm font-semibold text-amber-400">{user.name.split(' ')[0]}!</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-400">{user.xp} XP</span>
            </div>
          )}
        </div>
      </section>

      {/* Instruments Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Escolha seu <span className="text-gradient-gold">Instrumento</span>
          </h2>
          <p className="text-gray-500">Clique para acessar o dicionário de acordes</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {instruments.map((inst, idx) => {
            // Acesso verificado pelo sistema de planos
            
            return (
              <button
                key={inst.id}
                onClick={() => handleSelectInstrument(inst)}
                disabled={!inst.available}
                className={`group relative p-6 rounded-2xl text-left transition-all duration-300 animate-fadeIn
                  ${inst.available 
                    ? 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-white/20 hover:scale-[1.02] cursor-pointer' 
                    : 'bg-white/[0.02] border border-white/5 opacity-60 cursor-not-allowed'
                  }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Glow effect on hover */}
                {inst.available && (
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${inst.gradient} opacity-0 group-hover:opacity-10 transition-opacity blur-xl`} />
                )}

                {/* Content */}
                <div className="relative">
                  <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                    {inst.icon}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {inst.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {inst.description}
                  </p>

                  {/* Badge */}
                  <div className="mt-4">
                    {inst.available ? (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${inst.gradient} text-white`}>
                        ✓ Disponível
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/20">
                        🔜 Em breve
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Tudo que você <span className="text-gradient-gold">precisa</span>
          </h2>
          <p className="text-gray-500">Recursos profissionais para seu aprendizado</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all animate-fadeIn"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <span className="text-3xl mb-3 block">{feature.icon}</span>
              <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '100+', label: 'Acordes', icon: '🎵' },
            { value: '12', label: 'Tonalidades', icon: '🔄' },
            { value: '15+', label: 'Escalas', icon: '🎼' },
            { value: '4', label: 'Instrumentos', icon: '🎸' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 text-center"
            >
              <span className="text-2xl mb-1 block">{stat.icon}</span>
              <div className="text-2xl sm:text-3xl font-black text-gradient-gold">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-blue-500/10 border border-amber-500/20">
          <span className="text-5xl mb-4 block">🚀</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Pronto para dominar os acordes?
          </h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Comece agora mesmo — é grátis! Explore tríades, aprenda a formação de cada acorde e evolua seu conhecimento musical.
          </p>
          <button
            onClick={() => { setCurrentInstrument('teclado'); setCurrentPage('dictionary'); }}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg
              hover:from-amber-400 hover:to-orange-400 transition-all shadow-2xl shadow-amber-500/30 active:scale-95"
          >
            Começar Gratuitamente
          </button>
        </div>
      </section>
    </div>
  );
}
