import React, { useState } from 'react';
import { 
  Crown, 
  Check, 
  Zap, 
  Star, 
  Shield,
  Infinity,
  Headphones
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent } from '../components/ui';
import { Button } from '../components/ui/Button';

const PLANS = [
  {
    id: 'free',
    name: 'Безкоштовний',
    price: 0,
    period: '',
    description: 'Почніть свій шлях до успіху',
    features: [
      '3 звички',
      '3 цілі',
      'Базова ранкова рутина',
      'Щоденний список завдань',
      'Базовий журнал',
      '7-денна історія',
    ],
    limitations: [
      'Обмежена аналітика',
      'Без AI Coach',
      'Реклама',
    ],
    cta: 'Поточний план',
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    yearlyPrice: 79.99,
    period: '/місяць',
    description: 'Для серйозних досягачів',
    features: [
      'Необмежені звички та цілі',
      'Повна SAVERS рутина з таймерами',
      'AI Coach (обмежено)',
      'Всі методології',
      'Повна GTD система',
      'Розширена аналітика',
      'Тижневі та місячні огляди',
      'Cloud sync',
      'Без реклами',
      'Експорт даних',
      'Пріоритетна підтримка',
    ],
    cta: 'Почати 7-денний trial',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    yearlyPrice: 149.99,
    period: '/місяць',
    description: 'Максимальні можливості',
    features: [
      'Все з Premium',
      'Необмежений AI Coach',
      'Кастомні методології',
      'Сімейний доступ (5 осіб)',
      'Інтеграції (Calendar, Health)',
      'API доступ',
      'AI-генеровані афірмації',
      'Голосовий журнал',
      'Розширені інсайти',
      '1-on-1 онбординг',
    ],
    cta: 'Обрати Pro',
    popular: false,
  },
];

const LIFETIME = {
  price: 299,
  originalPrice: 499,
  features: [
    'Все з Pro назавжди',
    'Всі майбутні оновлення',
    'Значок Founding Member',
    'Доступ до приватної спільноти',
    'Ексклюзивний контент',
  ],
};

export const Premium: React.FC = () => {
  const { user, updateUser } = useStore();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    
    // Simulate subscription (in real app, this would integrate with payment provider)
    setTimeout(() => {
      updateUser({
        isPremium: true,
        subscriptionType: planId as 'premium' | 'pro' | 'lifetime',
      });
      setSelectedPlan(null);
      alert(`Вітаємо! Ви успішно підписалися на ${planId.toUpperCase()} план!`);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-sm font-medium mb-4">
          <Crown className="w-4 h-4" />
          Розблокуйте повний потенціал
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Оберіть свій план
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Інвестуйте в себе. Досягайте більшого з науково-доведеними методологіями успіху.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className={`font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
          Щомісячно
        </span>
        <button
          onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            billingPeriod === 'yearly' ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              billingPeriod === 'yearly' ? 'translate-x-8' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`font-medium ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
          Щорічно
          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-sm">
            -33%
          </span>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PLANS.map((plan) => {
          const price = billingPeriod === 'yearly' && plan.yearlyPrice 
            ? (plan.yearlyPrice / 12).toFixed(2) 
            : plan.price;
          const isCurrentPlan = user?.subscriptionType === plan.id;

          return (
            <Card 
              key={plan.id}
              className={`relative ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-xl scale-105' 
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                  Найпопулярніший
                </div>
              )}
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                  <div className="mt-4">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-bold text-gray-900">Безкоштовно</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-gray-900">${price}</span>
                        <span className="text-gray-500">{plan.period}</span>
                        {billingPeriod === 'yearly' && plan.yearlyPrice && (
                          <p className="text-sm text-gray-500 mt-1">
                            ${plan.yearlyPrice}/рік
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="w-5 h-5 flex items-center justify-center">✗</span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                  disabled={isCurrentPlan || selectedPlan === plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {selectedPlan === plan.id ? (
                    'Обробка...'
                  ) : isCurrentPlan ? (
                    'Поточний план'
                  ) : (
                    plan.cta
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lifetime Deal */}
      <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 mb-12">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Infinity className="w-6 h-6" />
                <span className="text-lg font-medium">Lifetime Access</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Одноразова оплата — довічний доступ
              </h2>
              <p className="text-purple-200 mb-4">
                Заплатіть один раз і отримайте доступ до всіх функцій Pro назавжди.
              </p>
              <ul className="grid grid-cols-2 gap-2 mb-6">
                {LIFETIME.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <span className="text-gray-300 line-through text-xl">${LIFETIME.originalPrice}</span>
                <span className="text-5xl font-bold ml-2">${LIFETIME.price}</span>
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100"
                onClick={() => handleSubscribe('lifetime')}
                disabled={user?.subscriptionType === 'lifetime' || selectedPlan === 'lifetime'}
              >
                {selectedPlan === 'lifetime' ? 'Обробка...' : 'Отримати Lifetime'}
              </Button>
              <p className="text-sm text-purple-200 mt-2">
                Економія ${LIFETIME.originalPrice - LIFETIME.price}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Comparison */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Чому обирають Peak Performer?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Науково-доведені методи</h3>
            <p className="text-gray-600 text-sm">
              Базовано на методологіях з бестселерів: Atomic Habits, 7 Habits, GTD, та інших.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Приватність та безпека</h3>
            <p className="text-gray-600 text-sm">
              Ваші дані зашифровані та ніколи не продаються третім сторонам.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Підтримка 24/7</h3>
            <p className="text-gray-600 text-sm">
              Наша команда завжди готова допомогти вам досягти ваших цілей.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Часті запитання
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'Чи можу я скасувати підписку?',
              a: 'Так, ви можете скасувати підписку в будь-який момент. Ви зберігаєте доступ до кінця оплаченого періоду.',
            },
            {
              q: 'Чи є безкоштовний пробний період?',
              a: 'Так, Premium план має 7-денний безкоштовний trial. Оплата списується лише після закінчення пробного періоду.',
            },
            {
              q: 'Які методи оплати приймаються?',
              a: 'Ми приймаємо всі основні кредитні картки, PayPal та Apple/Google Pay.',
            },
            {
              q: 'Чи можу я змінити план?',
              a: 'Так, ви можете оновити або знизити план в будь-який час. Різниця в оплаті буде пропорційно розрахована.',
            },
          ].map((faq, i) => (
            <Card key={i}>
              <CardContent className="py-4">
                <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                <p className="text-gray-600 mt-1">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
