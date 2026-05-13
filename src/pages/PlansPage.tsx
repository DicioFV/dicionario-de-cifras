import { useApp } from '../context/AppContext';
import type { Plan } from '../context/AppContext';

// ═══════════════════════════════════════════════════════════════════════════
// 💎 PLANS PAGE — Planos de Assinatura Premium
// Integração: Mercado Pago (Pro) | Hotmart (Premium)
// ═══════════════════════════════════════════════════════════════════════════

export default function PlansPage() {
  const { user, upgradePlan, setCurrentPage, isAuthenticated } = useApp();

  const plans: {
    id: Plan;
    name: string;
    icon: string;
    price: string;
    period: string;
    color: string;
    gradient: string;
    borderColor: string;
    features: string[];
    popular?: boolean;
    paymentMethod?: string;
  }[] = [
    {
      id: 'free',
      name: 'FREE',
      icon: '🆓',
      price: 'Grátis',
      period: 'para sempre',
      color: 'gray',
      gradient: 'from-gray-500 to-gray-600',
      borderColor: 'border-gray-500/30',
      features: [
        'Tríades (Maior, Menor, Aum., Dim.)',
        'Acordes Suspensos básicos',
        'Teclado virtual com 2 oitavas',
        'Tonalidades: C, G, D, A, E',
        'Áudio de acordes',
        'Modo visualização simples',
      ],
    },
    {
      id: 'pro',
      name: 'PRO',
      icon: '⭐',
      price: 'R$ 19,90',
      period: '/mês',
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-500/30',
      popular: true,
      paymentMethod: 'Mercado Pago',
      features: [
        '✅ Tudo do Free +',
        'Todos os acordes com sétima',
        'Acordes com sexta',
        'Todas as 12 tonalidades',
        'Inversões com áudio',
        'Modo arpejo',
        'Escalas relacionadas',
        'Sem anúncios',
        'Favoritos ilimitados',
        'Cifra + Solfejo',
        'Violão, Guitarra, Ukulele',
      ],
    },
    {
      id: 'premium',
      name: 'PREMIUM',
      icon: '👑',
      price: 'R$ 39,90',
      period: '/mês',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-500/30',
      paymentMethod: 'Hotmart',
      features: [
        '✅ Tudo do Pro +',
        'Acordes com 9ª, 11ª, 13ª',
        'Acordes alterados e especiais',
        'Campo harmônico completo',
        'Progressões de acordes',
        'Voicings avançados',
        'Quiz de acordes',
        'Treino auditivo',
        'Exportar PDF',
        'Suporte prioritário',
        'Atualizações exclusivas',
      ],
    },
    {
      id: 'vip',
      name: 'VIP ALUNO',
      icon: '💎',
      price: 'Grátis',
      period: 'para alunos',
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-500/30',
      paymentMethod: 'Código Hotmart',
      features: [
        '✅ Tudo do Premium +',
        'Acesso vitalício',
        'Exclusivo para alunos',
        'Curso completo na Hotmart',
        'Comunidade VIP',
        'Lives exclusivas',
        'Material complementar',
        'Certificado',
      ],
    },
  ];

  const handleSelectPlan = (plan: Plan) => {
    if (!isAuthenticated) {
      setCurrentPage('login');
      return;
    }

    if (plan === 'free') {
      upgradePlan('free');
      alert('Você está no plano Free!');
      return;
    }

    if (plan === 'pro') {
      // Integração Mercado Pago
      alert('🔗 Redirecionando para Mercado Pago...\n\n(Em produção, aqui seria o link de pagamento do Mercado Pago)');
      // Simulação de upgrade
      upgradePlan('pro');
      return;
    }

    if (plan === 'premium') {
      // Integração Hotmart
      alert('🔗 Redirecionando para Hotmart...\n\n(Em produção, aqui seria o link de checkout da Hotmart)');
      upgradePlan('premium');
      return;
    }

    if (plan === 'vip') {
      setCurrentPage('profile');
      alert('💎 Acesse seu Perfil e insira o código VIP do curso!');
      return;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-5xl mb-4 block">💎</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[Playfair_Display] mb-4">
          <span className="text-gradient-gold">Escolha</span>{' '}
          <span className="text-white">seu</span>{' '}
          <span className="text-gradient-royal">Plano</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Desbloqueie todo o potencial do seu aprendizado musical. 
          Escolha o plano ideal para você.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {plans.map((plan, idx) => {
          const isCurrentPlan = user?.plan === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 transition-all duration-300 animate-fadeIn
                ${plan.popular 
                  ? 'bg-gradient-to-b from-blue-500/10 to-blue-500/5 border-2 border-blue-500/40 shadow-2xl shadow-blue-500/10 scale-[1.02] lg:scale-105' 
                  : `bg-white/[0.03] border ${plan.borderColor}`
                }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                  Mais Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <span className="text-4xl mb-3 block">{plan.icon}</span>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                {plan.paymentMethod && (
                  <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-wider">
                    via {plan.paymentMethod}
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className={`mt-0.5 shrink-0 ${feature.startsWith('✅') ? '' : 'text-green-400'}`}>
                      {feature.startsWith('✅') ? '' : '✓'}
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isCurrentPlan}
                className={`w-full py-3.5 rounded-xl font-bold text-white transition-all active:scale-[0.98]
                  ${isCurrentPlan
                    ? 'bg-green-500/20 text-green-400 cursor-default border border-green-500/30'
                    : `bg-gradient-to-r ${plan.gradient} hover:opacity-90 shadow-lg`
                  }`}
              >
                {isCurrentPlan ? '✓ Plano Atual' : plan.id === 'free' ? 'Começar Grátis' : plan.id === 'vip' ? 'Tenho Código VIP' : 'Assinar Agora'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Info */}
      <div className="mt-16 max-w-3xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          {[
            { icon: '🔒', title: 'Pagamento Seguro', desc: 'Criptografia SSL em todas as transações' },
            { icon: '↩️', title: 'Cancele Quando Quiser', desc: 'Sem fidelidade, sem burocracia' },
            { icon: '📱', title: 'Acesso em Todos Dispositivos', desc: 'Desktop, tablet e celular' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-2xl mb-2 block">{item.icon}</span>
              <h4 className="text-sm font-semibold text-white">{item.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-xs text-gray-600">
          <p>💳 Formas de pagamento aceitas: Cartão de Crédito, PIX, Boleto</p>
          <p className="mt-1">Integração: Mercado Pago • Hotmart</p>
        </div>
      </div>

      {/* FAQ ou CTA final */}
      <div className="mt-16 text-center">
        <p className="text-gray-500 text-sm">
          Dúvidas? Entre em contato: <span className="text-amber-400">contato@dicionariodecifras.com.br</span>
        </p>
      </div>
    </div>
  );
}
