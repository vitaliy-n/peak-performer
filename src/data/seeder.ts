import { v4 as uuidv4 } from 'uuid';
import { format, subDays } from 'date-fns';
import type { User, Goal, Habit, Task, Project, DailyLog, JournalEntry, Achievement, Skill, Book, FinanceState, MindsetState, HealthState, TwelveWeekYear, FeynmanNote, ReadingSession, AICoachState } from '../types';

const USER_ID = 'demo-user-001';

// Project IDs for linking tasks
const PROJECT_SAAS_ID = uuidv4();
const PROJECT_MARATHON_ID = uuidv4();
const PROJECT_RENOVATION_ID = uuidv4();
const PROJECT_YOUTUBE_ID = uuidv4();

// Goal IDs for linking
const GOAL_SAAS_ID = uuidv4();
const GOAL_AWS_ID = uuidv4();
const GOAL_FINANCE_ID = uuidv4();
const GOAL_MARATHON_ID = uuidv4();

// Book IDs for linking
const BOOK_ATOMIC_HABITS_ID = uuidv4();
const BOOK_DEEP_WORK_ID = uuidv4();
const BOOK_PSYCHOLOGY_MONEY_ID = uuidv4();
const BOOK_MEDITATIONS_ID = uuidv4();
const BOOK_ZERO_TO_ONE_ID = uuidv4();
const BOOK_CANT_HURT_ME_ID = uuidv4();
const BOOK_ESSENTIALISM_ID = uuidv4();
const BOOK_PRINCIPLES_ID = uuidv4();

// Generate dates for the last N days
const getDateString = (daysAgo: number) => format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');
const getISOString = (daysAgo: number) => subDays(new Date(), daysAgo).toISOString();

// Generate completion history for habits
const generateHabitHistory = (daysActive: number, completionRate: number): Record<string, boolean> => {
  const history: Record<string, boolean> = {};
  for (let i = 0; i < daysActive; i++) {
    const date = getDateString(i);
    history[date] = Math.random() < completionRate;
  }
  // Ensure recent streak
  for (let i = 0; i < 5; i++) {
    history[getDateString(i)] = true;
  }
  return history;
};

// Calculate streak from history
const calculateStreak = (history: Record<string, boolean>): number => {
  let streak = 0;
  let day = 0;
  while (history[getDateString(day)]) {
    streak++;
    day++;
  }
  return streak;
};

export const SEED_USER: User = {
  id: USER_ID,
  name: 'Олександр',
  email: 'alex@example.com',
  createdAt: getISOString(45),
  missionStatement: 'Моя місія - постійно розвиватися, допомагати іншим досягати успіху та створювати продукти, які покращують життя людей. Я прагну до балансу між кар\'єрою, сім\'єю та особистим розвитком.',
  coreValues: ['Чесність', 'Розвиток', 'Сім\'я', 'Здоров\'я', 'Свобода'],
  lifeRoles: {
    'Підприємець': 'Створювати цінність через інновації',
    'Батько': 'Виховувати щасливих дітей',
    'Чоловік': 'Бути надійним партнером',
    'Друг': 'Підтримувати близьких',
    'Учень': 'Постійно навчатися новому'
  },
  wakeUpTime: '05:00',
  morningRoutine: ['silence', 'affirmations', 'visualization', 'exercise', 'reading', 'scribing'],
  eveningRoutine: ['review', 'gratitude', 'planning'],
  preferredMethodologies: ['atomic_habits', 'gtd', 'eat_that_frog', 'miracle_morning'],
  currentStreak: 12,
  longestStreak: 28,
  totalPoints: 15750,
  level: 4,
  achievements: ['first_frog', 'habit_starter', 'streak_7', 'goal_setter', 'journaler', 'morning_master'],
  isPremium: true,
  subscriptionType: 'premium',
  role: 'guest',
};

const habitHistoryMeditation = generateHabitHistory(45, 0.85);
const habitHistoryReading = generateHabitHistory(45, 0.9);
const habitHistoryExercise = generateHabitHistory(45, 0.75);
const habitHistoryWater = generateHabitHistory(45, 0.95);
const habitHistoryJournal = generateHabitHistory(45, 0.8);
const habitHistoryNoPhone = generateHabitHistory(30, 0.7);
const habitHistoryGratitude = generateHabitHistory(45, 0.88);
const habitHistoryDeepWork = generateHabitHistory(30, 0.65);

export const SEED_HABITS: Habit[] = [
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Медитація 10 хвилин',
    description: 'Ранкова медитація для ясності розуму та зменшення стресу',
    cue: 'Після пробудження, сідаю на подушку',
    craving: 'Відчуття спокою та ясності на весь день',
    response: 'Сідаю, закриваю очі, фокусуюсь на диханні',
    reward: 'Записую в журнал свої відчуття',
    identity: 'Я є людиною, яка починає день з усвідомленості',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    reminderTime: '05:15',
    afterHabit: null,
    currentStreak: calculateStreak(habitHistoryMeditation),
    longestStreak: 21,
    totalCompletions: Object.values(habitHistoryMeditation).filter(Boolean).length,
    completionHistory: habitHistoryMeditation,
    createdAt: getISOString(45),
    color: '#8B5CF6',
    icon: '🧘'
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Читати 20 сторінок',
    description: 'Щоденне читання книг про саморозвиток та бізнес',
    cue: 'Після медитації, беру книгу з полиці',
    craving: 'Отримати нові знання та ідеї',
    response: 'Читаю 20 сторінок з нотатками',
    reward: 'Записую 3 ключові ідеї в журнал',
    identity: 'Я є людиною, яка постійно навчається',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    reminderTime: '05:30',
    afterHabit: 'Медитація',
    currentStreak: calculateStreak(habitHistoryReading),
    longestStreak: 28,
    totalCompletions: Object.values(habitHistoryReading).filter(Boolean).length,
    completionHistory: habitHistoryReading,
    createdAt: getISOString(45),
    color: '#3B82F6',
    icon: '📚'
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Ранкове тренування',
    description: 'HIIT або силове тренування 30 хвилин',
    cue: 'Після читання, одягаю спортивний одяг',
    craving: 'Відчуття енергії та сили',
    response: '30 хвилин інтенсивного тренування',
    reward: 'Протеїновий коктейль після тренування',
    identity: 'Я є спортсменом',
    frequency: 'daily',
    targetDays: [1, 2, 3, 4, 5],
    reminderTime: '06:00',
    afterHabit: 'Читання',
    currentStreak: calculateStreak(habitHistoryExercise),
    longestStreak: 18,
    totalCompletions: Object.values(habitHistoryExercise).filter(Boolean).length,
    completionHistory: habitHistoryExercise,
    createdAt: getISOString(45),
    color: '#EF4444',
    icon: '💪'
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Випити 2л води',
    description: 'Підтримувати гідратацію протягом дня',
    cue: 'Пляшка з водою завжди на столі',
    craving: 'Відчуття бадьорості та здоров\'я',
    response: 'Пити воду кожну годину',
    reward: 'Відмітка в трекері',
    identity: 'Я є здоровою людиною, яка піклується про своє тіло',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    reminderTime: null,
    afterHabit: null,
    currentStreak: calculateStreak(habitHistoryWater),
    longestStreak: 35,
    totalCompletions: Object.values(habitHistoryWater).filter(Boolean).length,
    completionHistory: habitHistoryWater,
    createdAt: getISOString(40),
    color: '#06B6D4',
    icon: '💧'
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Вечірній журнал',
    description: 'Рефлексія дня, вдячність та планування',
    cue: 'О 21:00, сідаю за стіл з журналом',
    craving: 'Ясність та підготовка до завтра',
    response: '10 хвилин письма: перемоги, уроки, план',
    reward: 'Спокійний сон з чистою головою',
    identity: 'Я є рефлексивною людиною, яка вчиться з досвіду',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    reminderTime: '21:00',
    afterHabit: null,
    currentStreak: calculateStreak(habitHistoryJournal),
    longestStreak: 22,
    totalCompletions: Object.values(habitHistoryJournal).filter(Boolean).length,
    completionHistory: habitHistoryJournal,
    createdAt: getISOString(42),
    color: '#F59E0B',
    icon: '✍️'
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Без телефону 1-шу годину',
    description: 'Не перевіряти телефон першу годину після пробудження',
    cue: 'Телефон залишається в іншій кімнаті на ніч',
    craving: 'Контроль над своєю увагою',
    response: 'Ранкова рутина без телефону',
    reward: 'Продуктивний початок дня',
    identity: 'Я контролюю технології, а не навпаки',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    reminderTime: null,
    afterHabit: null,
    currentStreak: calculateStreak(habitHistoryNoPhone),
    longestStreak: 14,
    totalCompletions: Object.values(habitHistoryNoPhone).filter(Boolean).length,
    completionHistory: habitHistoryNoPhone,
    createdAt: getISOString(30),
    color: '#EC4899',
    icon: '📵'
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: '3 речі вдячності',
    description: 'Записати 3 речі, за які вдячний сьогодні',
    cue: 'Вранці за сніданком',
    craving: 'Позитивний настрій на день',
    response: 'Записую 3 конкретні речі',
    reward: 'Відчуття вдячності та щастя',
    identity: 'Я є вдячною людиною, яка цінує життя',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    reminderTime: '07:00',
    afterHabit: null,
    currentStreak: calculateStreak(habitHistoryGratitude),
    longestStreak: 25,
    totalCompletions: Object.values(habitHistoryGratitude).filter(Boolean).length,
    completionHistory: habitHistoryGratitude,
    createdAt: getISOString(45),
    color: '#10B981',
    icon: '🙏'
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: '4 години Deep Work',
    description: 'Глибока робота без відволікань',
    cue: 'О 09:00, вимикаю всі сповіщення',
    craving: 'Значний прогрес у важливих проектах',
    response: '2 блоки по 2 години з перервою',
    reward: 'Обід після завершення',
    identity: 'Я є професіоналом, який створює цінність',
    frequency: 'weekdays',
    targetDays: [1, 2, 3, 4, 5],
    reminderTime: '09:00',
    afterHabit: null,
    currentStreak: calculateStreak(habitHistoryDeepWork),
    longestStreak: 12,
    totalCompletions: Object.values(habitHistoryDeepWork).filter(Boolean).length,
    completionHistory: habitHistoryDeepWork,
    createdAt: getISOString(30),
    color: '#7C3AED',
    icon: '🧠'
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Холодний душ',
    description: '2 хвилини холодної води для дисципліни та імунітету',
    cue: 'Після ранкового тренування',
    craving: 'Відчуття непереможності з самого ранку',
    response: 'Вмикаю холодну воду на 2 хв',
    reward: 'Дофаміновий буст на 3 години',
    identity: 'Я роблю важкі речі, навіть коли не хочеться',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    reminderTime: '06:45',
    afterHabit: 'Ранкове тренування',
    currentStreak: 5,
    longestStreak: 10,
    totalCompletions: 15,
    completionHistory: generateHabitHistory(15, 0.9),
    createdAt: getISOString(15),
    color: '#0EA5E9',
    icon: '❄️'
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Networking Outreach',
    description: 'Написати 3 новим людям з моєї індустрії',
    cue: 'Після обіду',
    craving: 'Нові можливості та партнерства',
    response: 'Відправляю 3 персоналізованих повідомлення в LinkedIn/Twitter',
    reward: 'Розширення мережі контактів',
    identity: 'Я є конектором та лідером думок',
    frequency: 'weekdays',
    targetDays: [1, 2, 3, 4, 5],
    reminderTime: '14:00',
    afterHabit: null,
    currentStreak: 3,
    longestStreak: 3,
    totalCompletions: 8,
    completionHistory: generateHabitHistory(10, 0.8),
    createdAt: getISOString(10),
    color: '#F97316',
    icon: '🤝'
  }
];

export const SEED_GOALS: Goal[] = [
  // Career Goals
  {
    id: GOAL_SAAS_ID,
    userId: USER_ID,
    title: 'Запустити SaaS продукт',
    description: 'Створити та запустити власний SaaS продукт з MRR $10K',
    why: 'Фінансова незалежність та можливість працювати над власними ідеями',
    lifeArea: 'career',
    timeframe: 'yearly',
    priority: 'A',
    specific: 'SaaS продукт для малого бізнесу',
    measurable: 'MRR $10,000',
    targetValue: 10000,
    currentValue: 2500,
    startDate: getISOString(90),
    targetDate: '2026-12-31',
    parentGoalId: null,
    subGoals: [],
    actionSteps: [
      { id: uuidv4(), goalId: GOAL_SAAS_ID, description: 'Провести дослідження ринку', priority: 'A', context: '@комп\'ютер', estimatedTime: 120, dueDate: null, completed: true, completedAt: getISOString(85) },
      { id: uuidv4(), goalId: GOAL_SAAS_ID, description: 'Створити MVP', priority: 'A', context: '@комп\'ютер', estimatedTime: 480, dueDate: null, completed: true, completedAt: getISOString(60) },
      { id: uuidv4(), goalId: GOAL_SAAS_ID, description: 'Запустити бета-версію', priority: 'A', context: '@комп\'ютер', estimatedTime: 120, dueDate: null, completed: true, completedAt: getISOString(30) },
      { id: uuidv4(), goalId: GOAL_SAAS_ID, description: 'Залучити перших 100 користувачів', priority: 'A', context: '@комп\'ютер', estimatedTime: 240, dueDate: getDateString(-30), completed: false, completedAt: null },
    ],
    status: 'active',
    progress: 25,
    createdAt: getISOString(90),
    updatedAt: getISOString(1),
  },
  {
    id: GOAL_AWS_ID,
    userId: USER_ID,
    title: 'Отримати сертифікацію AWS',
    description: 'Здати екзамен AWS Solutions Architect Professional',
    why: 'Підвищити експертизу та конкурентоспроможність на ринку',
    lifeArea: 'career',
    timeframe: 'quarterly',
    priority: 'B',
    specific: 'AWS Solutions Architect Professional',
    measurable: 'Здати екзамен з результатом 80%+',
    targetValue: 100,
    currentValue: 60,
    startDate: getISOString(60),
    targetDate: '2026-03-31',
    parentGoalId: null,
    subGoals: [],
    actionSteps: [],
    status: 'active',
    progress: 60,
    createdAt: getISOString(60),
    updatedAt: getISOString(3),
  },
  // Financial Goals
  {
    id: GOAL_FINANCE_ID,
    userId: USER_ID,
    title: 'Накопичити $50K резервний фонд',
    description: 'Створити фінансову подушку безпеки на 6 місяців витрат',
    why: 'Фінансова безпека та спокій для сім\'ї',
    lifeArea: 'financial',
    timeframe: 'yearly',
    priority: 'A',
    specific: '$50,000 на окремому рахунку',
    measurable: 'Баланс рахунку',
    targetValue: 50000,
    currentValue: 32000,
    startDate: getISOString(180),
    targetDate: '2026-12-31',
    parentGoalId: null,
    subGoals: [],
    actionSteps: [],
    status: 'active',
    progress: 64,
    createdAt: getISOString(180),
    updatedAt: getISOString(5),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Інвестувати $500/місяць в ETF',
    description: 'Регулярні інвестиції для довгострокового зростання капіталу',
    why: 'Пасивний дохід та фінансова незалежність у майбутньому',
    lifeArea: 'financial',
    timeframe: 'monthly',
    priority: 'A',
    specific: '$500 щомісячно в індексні фонди',
    measurable: 'Щомісячний переказ',
    targetValue: 12,
    currentValue: 10,
    startDate: getISOString(300),
    targetDate: '2026-12-31',
    parentGoalId: null,
    subGoals: [],
    actionSteps: [],
    status: 'active',
    progress: 83,
    createdAt: getISOString(300),
    updatedAt: getISOString(2),
  },
  // Health Goals
  {
    id: GOAL_MARATHON_ID,
    userId: USER_ID,
    title: 'Пробігти напівмарафон',
    description: 'Підготуватися та пробігти 21.1 км',
    why: 'Довести собі, що можу досягти складних фізичних цілей',
    lifeArea: 'health',
    timeframe: 'yearly',
    priority: 'B',
    specific: 'Напівмарафон у Києві',
    measurable: 'Фініш за менше ніж 2 години',
    targetValue: 100,
    currentValue: 45,
    startDate: getISOString(120),
    targetDate: '2026-09-15',
    parentGoalId: null,
    subGoals: [],
    actionSteps: [
      { id: uuidv4(), goalId: GOAL_MARATHON_ID, description: 'Бігати 3 рази на тиждень', priority: 'A', context: '@вулиця', estimatedTime: 60, dueDate: null, completed: false, completedAt: null },
      { id: uuidv4(), goalId: GOAL_MARATHON_ID, description: 'Пробігти 10 км', priority: 'B', context: '@вулиця', estimatedTime: 60, dueDate: null, completed: true, completedAt: getISOString(45) },
      { id: uuidv4(), goalId: GOAL_MARATHON_ID, description: 'Пробігти 15 км', priority: 'B', context: '@вулиця', estimatedTime: 90, dueDate: null, completed: false, completedAt: null },
    ],
    status: 'active',
    progress: 45,
    createdAt: getISOString(120),
    updatedAt: getISOString(7),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Схуднути до 80 кг',
    description: 'Досягти здорової ваги через правильне харчування та спорт',
    why: 'Більше енергії, краще здоров\'я, впевненість',
    lifeArea: 'health',
    timeframe: 'quarterly',
    priority: 'A',
    specific: 'Вага 80 кг',
    measurable: 'Зважування щотижня',
    targetValue: 80,
    currentValue: 85,
    startDate: getISOString(60),
    targetDate: '2026-04-30',
    parentGoalId: null,
    subGoals: [],
    actionSteps: [],
    status: 'active',
    progress: 50,
    createdAt: getISOString(60),
    updatedAt: getISOString(1),
  },
  // Personal Growth
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Прочитати 52 книги за рік',
    description: 'По одній книзі на тиждень',
    why: 'Постійне навчання та розширення світогляду',
    lifeArea: 'personal_growth',
    timeframe: 'yearly',
    priority: 'A',
    specific: '52 книги (mix: бізнес, психологія, біографії)',
    measurable: 'Кількість прочитаних книг',
    targetValue: 52,
    currentValue: 8,
    startDate: getISOString(45),
    targetDate: '2026-12-31',
    parentGoalId: null,
    subGoals: [],
    actionSteps: [],
    status: 'active',
    progress: 15,
    createdAt: getISOString(45),
    updatedAt: getISOString(3),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Вивчити іспанську до B1',
    description: 'Досягти рівня B1 з іспанської мови',
    why: 'Подорожі, нові можливості, розвиток мозку',
    lifeArea: 'personal_growth',
    timeframe: 'yearly',
    priority: 'C',
    specific: 'Рівень B1 за CEFR',
    measurable: 'Тест на рівень',
    targetValue: 100,
    currentValue: 25,
    startDate: getISOString(90),
    targetDate: '2026-12-31',
    parentGoalId: null,
    subGoals: [],
    actionSteps: [],
    status: 'active',
    progress: 25,
    createdAt: getISOString(90),
    updatedAt: getISOString(10),
  },
  // Relationships
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Сімейна вечеря щонеділі',
    description: 'Проводити якісний час з сім\'єю за недільною вечерею',
    why: 'Міцні сімейні стосунки та традиції',
    lifeArea: 'relationships',
    timeframe: 'weekly',
    priority: 'A',
    specific: 'Недільна вечеря без телефонів',
    measurable: 'Кількість проведених вечерь',
    targetValue: 52,
    currentValue: 6,
    startDate: getISOString(42),
    targetDate: '2026-12-31',
    parentGoalId: null,
    subGoals: [],
    actionSteps: [],
    status: 'active',
    progress: 12,
    createdAt: getISOString(42),
    updatedAt: getISOString(0),
  },
  // Spiritual
  {
    id: uuidv4(),
    userId: USER_ID,
    title: '365 днів медитації',
    description: 'Медитувати щодня протягом року',
    why: 'Внутрішній спокій, усвідомленість, контроль емоцій',
    lifeArea: 'spiritual',
    timeframe: 'yearly',
    priority: 'B',
    specific: 'Мінімум 10 хвилин медитації щодня',
    measurable: 'Streak днів',
    targetValue: 365,
    currentValue: 45,
    startDate: getISOString(45),
    targetDate: '2027-01-15',
    parentGoalId: null,
    subGoals: [],
    actionSteps: [],
    status: 'active',
    progress: 12,
    createdAt: getISOString(45),
    updatedAt: getISOString(0),
  },
  // Completed goal
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Пройти курс Product Management',
    description: 'Завершити онлайн курс з продакт-менеджменту',
    why: 'Покращити навички управління продуктом',
    lifeArea: 'career',
    timeframe: 'monthly',
    priority: 'A',
    specific: 'Курс Product School',
    measurable: 'Сертифікат',
    targetValue: 100,
    currentValue: 100,
    startDate: getISOString(90),
    targetDate: getDateString(15),
    parentGoalId: null,
    subGoals: [],
    actionSteps: [],
    status: 'completed',
    progress: 100,
    createdAt: getISOString(90),
    updatedAt: getISOString(15),
  },
  // Personal Brand
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Побудувати особистий бренд',
    description: 'Стати визнаним експертом у своїй ніші',
    why: 'Вплив, нові можливості, незалежність від роботодавця',
    lifeArea: 'career',
    timeframe: 'yearly',
    priority: 'A',
    specific: '10,000 підписників на LinkedIn та Twitter',
    measurable: 'Сумарна аудиторія',
    targetValue: 10000,
    currentValue: 1200,
    startDate: getISOString(30),
    targetDate: '2026-12-31',
    parentGoalId: null,
    subGoals: [],
    actionSteps: [],
    status: 'active',
    progress: 12,
    createdAt: getISOString(30),
    updatedAt: getISOString(2),
  },
];

export const SEED_PROJECTS: Project[] = [
  {
    id: PROJECT_SAAS_ID,
    userId: USER_ID,
    title: 'Запуск SaaS продукту',
    description: 'Всі задачі пов\'язані з розробкою та запуском продукту',
    status: 'active',
    tasks: [],
    createdAt: getISOString(90),
  },
  {
    id: PROJECT_MARATHON_ID,
    userId: USER_ID,
    title: 'Підготовка до напівмарафону',
    description: 'Тренувальний план та підготовка',
    status: 'active',
    tasks: [],
    createdAt: getISOString(60),
  },
  {
    id: PROJECT_RENOVATION_ID,
    userId: USER_ID,
    title: 'Ремонт квартири',
    description: 'Косметичний ремонт кабінету',
    status: 'someday',
    tasks: [],
    createdAt: getISOString(120),
  },
  {
    id: PROJECT_YOUTUBE_ID,
    userId: USER_ID,
    title: 'YouTube Канал (Personal Brand)',
    description: 'Запуск та розвиток каналу про продуктивність та бізнес',
    status: 'active',
    tasks: [],
    createdAt: getISOString(15),
  },
];

export const SEED_TASKS: Task[] = [
  // Today's Frog
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Написати технічну документацію для API',
    description: 'Завершити документацію для публічного API. Включити приклади, endpoints, автентифікацію.',
    priority: 'A',
    context: '@комп\'ютер',
    estimatedTime: 180,
    dueDate: getDateString(0),
    completed: false,
    completedAt: null,
    isFrog: true,
    projectId: PROJECT_SAAS_ID,
    createdAt: getISOString(3),
  },
  // YouTube Tasks
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Написати сценарій для відео "Як прокидатися о 5:00"',
    description: 'Структура: хук, історія, 3 поради, call to action.',
    priority: 'A',
    context: '@комп\'ютер',
    estimatedTime: 90,
    dueDate: getDateString(1),
    completed: false,
    completedAt: null,
    isFrog: false,
    projectId: PROJECT_YOUTUBE_ID,
    createdAt: getISOString(2),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Замовити обкладинку для відео',
    description: 'ТЗ для дизайнера: яскравий колір, емоція на обличчі, текст "Секрет 5:00".',
    priority: 'B',
    context: '@комп\'ютер',
    estimatedTime: 15,
    dueDate: getDateString(2),
    completed: false,
    completedAt: null,
    isFrog: false,
    projectId: PROJECT_YOUTUBE_ID,
    createdAt: getISOString(1),
  },
  // Priority A tasks
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Зателефонувати інвестору',
    description: 'Обговорити умови інвестиції та відповісти на питання',
    priority: 'A',
    context: '@дзвінки',
    estimatedTime: 45,
    dueDate: getDateString(0),
    completed: false,
    completedAt: null,
    isFrog: false,
    projectId: PROJECT_SAAS_ID,
    createdAt: getISOString(1),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Провести код-рев\'ю PR #234',
    description: 'Перевірити зміни в автентифікації',
    priority: 'A',
    context: '@комп\'ютер',
    estimatedTime: 60,
    dueDate: getDateString(0),
    completed: false,
    completedAt: null,
    isFrog: false,
    projectId: PROJECT_SAAS_ID,
    createdAt: getISOString(1),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Підготувати презентацію для команди',
    description: 'Квартальний звіт та плани на наступний квартал',
    priority: 'A',
    context: '@комп\'ютер',
    estimatedTime: 120,
    dueDate: getDateString(2),
    completed: false,
    completedAt: null,
    isFrog: false,
    projectId: PROJECT_SAAS_ID,
    createdAt: getISOString(5),
  },
  // Priority B tasks
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Оновити резюме на LinkedIn',
    description: 'Додати нові навички та досвід',
    priority: 'B',
    context: '@комп\'ютер',
    estimatedTime: 30,
    dueDate: getDateString(7),
    completed: false,
    completedAt: null,
    isFrog: false,
    projectId: null,
    createdAt: getISOString(10),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Записатися до стоматолога',
    description: 'Профілактичний огляд',
    priority: 'B',
    context: '@дзвінки',
    estimatedTime: 10,
    dueDate: getDateString(5),
    completed: false,
    completedAt: null,
    isFrog: false,
    projectId: null,
    createdAt: getISOString(7),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Прочитати статтю про нові тренди AI',
    description: 'Стаття від Anthropic про безпеку AI',
    priority: 'B',
    context: '@навчання',
    estimatedTime: 30,
    dueDate: null,
    completed: false,
    completedAt: null,
    isFrog: false,
    projectId: null,
    createdAt: getISOString(2),
  },
  // Priority C tasks
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Організувати робочий стіл',
    description: 'Прибрати кабелі, почистити монітор',
    priority: 'C',
    context: '@дім',
    estimatedTime: 20,
    dueDate: null,
    completed: false,
    completedAt: null,
    isFrog: false,
    projectId: PROJECT_RENOVATION_ID,
    createdAt: getISOString(14),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Переглянути нові інструменти для нотаток',
    description: 'Obsidian vs Notion vs Logseq',
    priority: 'C',
    context: '@комп\'ютер',
    estimatedTime: 60,
    dueDate: null,
    completed: false,
    completedAt: null,
    isFrog: false,
    projectId: null,
    createdAt: getISOString(20),
  },
  // Completed tasks today
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Відповісти на листи',
    description: 'Inbox zero',
    priority: 'A',
    context: '@комп\'ютер',
    estimatedTime: 30,
    dueDate: getDateString(0),
    completed: true,
    completedAt: new Date().toISOString(),
    isFrog: false,
    projectId: null,
    createdAt: getISOString(1),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Ранкова рутина SAVERS',
    description: 'Повна ранкова рутина',
    priority: 'A',
    context: '@дім',
    estimatedTime: 60,
    dueDate: getDateString(0),
    completed: true,
    completedAt: new Date().toISOString(),
    isFrog: false,
    projectId: null,
    createdAt: getISOString(0),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Стендап з командою',
    description: '15-хвилинний daily standup',
    priority: 'B',
    context: '@дзвінки',
    estimatedTime: 15,
    dueDate: getDateString(0),
    completed: true,
    completedAt: new Date().toISOString(),
    isFrog: false,
    projectId: PROJECT_SAAS_ID,
    createdAt: getISOString(0),
  },
];

export const SEED_SKILLS: Skill[] = [
  // Business & Entrepreneurship
  { id: uuidv4(), name: 'Продажі та переговори', category: 'Business', totalMinutes: 1200, targetMinutes: 10000, subSkills: ['Cold calling', 'Closing', 'Handling objections', 'CRM'], notes: 'Основа будь-якого бізнесу.', createdAt: getISOString(90) },
  { id: uuidv4(), name: 'Маркетинг', category: 'Business', totalMinutes: 800, targetMinutes: 5000, subSkills: ['Copywriting', 'SEO', 'PPC', 'Brand building'], notes: 'Як залучати клієнтів.', createdAt: getISOString(60) },
  { id: uuidv4(), name: 'Фінансова грамотність', category: 'Business', totalMinutes: 600, targetMinutes: 2000, subSkills: ['Budgeting', 'Investing', 'Taxes', 'Financial modeling'], notes: 'Управління грошима.', createdAt: getISOString(45) },
  { id: uuidv4(), name: 'Лідерство та менеджмент', category: 'Business', totalMinutes: 1500, targetMinutes: 10000, subSkills: ['Delegation', 'Hiring', 'Motivation', 'Strategy'], notes: 'Як керувати командою.', createdAt: getISOString(120) },
  { id: uuidv4(), name: 'Публічні виступи', category: 'Business', totalMinutes: 300, targetMinutes: 1000, subSkills: ['Storytelling', 'Body language', 'Slide design', 'Voice control'], notes: 'Вміння переконувати аудиторію.', createdAt: getISOString(30) },
  
  // Technology & Digital
  { id: uuidv4(), name: 'Програмування (Full Stack)', category: 'Technology', totalMinutes: 5000, targetMinutes: 10000, subSkills: ['React', 'Node.js', 'TypeScript', 'Database design'], notes: 'Створення програмних продуктів.', createdAt: getISOString(365) },
  { id: uuidv4(), name: 'AI & Prompt Engineering', category: 'Technology', totalMinutes: 200, targetMinutes: 1000, subSkills: ['ChatGPT', 'Midjourney', 'LLM integration', 'Automation'], notes: 'Використання ШІ для продуктивності.', createdAt: getISOString(15) },
  { id: uuidv4(), name: 'Data Analysis', category: 'Technology', totalMinutes: 400, targetMinutes: 2000, subSkills: ['Excel', 'SQL', 'Python Pandas', 'Visualization'], notes: 'Прийняття рішень на основі даних.', createdAt: getISOString(45) },
  { id: uuidv4(), name: 'UI/UX Design', category: 'Technology', totalMinutes: 300, targetMinutes: 1500, subSkills: ['Figma', 'User research', 'Prototyping', 'Color theory'], notes: 'Створення зручних інтерфейсів.', createdAt: getISOString(30) },
  { id: uuidv4(), name: 'Відеомонтаж', category: 'Technology', totalMinutes: 150, targetMinutes: 1000, subSkills: ['Premiere Pro', 'Storyboarding', 'Sound design', 'Color grading'], notes: 'Створення контенту для YouTube/Socials.', createdAt: getISOString(20) },

  // Personal Effectiveness (Soft Skills)
  { id: uuidv4(), name: 'Тайм-менеджмент', category: 'Productivity', totalMinutes: 500, targetMinutes: 1000, subSkills: ['Planning', 'Prioritization', 'Deep Work', 'Systems'], notes: 'Керування часом та увагою.', createdAt: getISOString(60) },
  { id: uuidv4(), name: 'Критичне мислення', category: 'Productivity', totalMinutes: 200, targetMinutes: 5000, subSkills: ['Logic', 'Cognitive biases', 'Mental models', 'Problem solving'], notes: 'Як думати ясно та ефективно.', createdAt: getISOString(30) },
  { id: uuidv4(), name: 'Емоційний інтелект', category: 'Productivity', totalMinutes: 300, targetMinutes: 3000, subSkills: ['Empathy', 'Self-regulation', 'Social skills', 'Motivation'], notes: 'Розуміння себе та інших.', createdAt: getISOString(45) },
  { id: uuidv4(), name: 'Швидкочитання', category: 'Productivity', totalMinutes: 50, targetMinutes: 200, subSkills: ['Scanning', 'Subvocalization control', 'Peripheral vision'], notes: 'Швидке засвоєння інформації.', createdAt: getISOString(10) },
  { id: uuidv4(), name: 'Сліпий друк', category: 'Productivity', totalMinutes: 600, targetMinutes: 600, subSkills: ['Touch typing', 'Shortcuts', 'Vim'], notes: 'Швидкість роботи за комп\'ютером.', createdAt: getISOString(90) },

  // Languages
  { id: uuidv4(), name: 'Англійська мова (C1-C2)', category: 'Languages', totalMinutes: 3000, targetMinutes: 5000, subSkills: ['Speaking', 'Writing', 'Listening', 'Vocabulary'], notes: 'Мова міжнародного спілкування.', createdAt: getISOString(730) },
  { id: uuidv4(), name: 'Іспанська мова', category: 'Languages', totalMinutes: 100, targetMinutes: 2000, subSkills: ['Basics', 'Conversation', 'Grammar'], notes: 'Друга найпопулярніша мова.', createdAt: getISOString(30) },

  // Health & Biohacking
  { id: uuidv4(), name: 'Нутриціологія', category: 'Health', totalMinutes: 200, targetMinutes: 1000, subSkills: ['Macros', 'Micros', 'Supplements', 'Meal planning'], notes: 'Вплив їжі на енергію та здоров\'я.', createdAt: getISOString(45) },
  { id: uuidv4(), name: 'Фізіологія тренувань', category: 'Health', totalMinutes: 300, targetMinutes: 1500, subSkills: ['Anatomy', 'Biomechanics', 'Recovery', 'Programming'], notes: 'Ефективна робота з тілом.', createdAt: getISOString(60) },
  { id: uuidv4(), name: 'Медитація та Mindfulness', category: 'Health', totalMinutes: 400, targetMinutes: 2000, subSkills: ['Focus', 'Stress reduction', 'Breathwork', 'Vipassana'], notes: 'Керування станом свідомості.', createdAt: getISOString(90) },
  { id: uuidv4(), name: 'Сон та відновлення', category: 'Health', totalMinutes: 100, targetMinutes: 500, subSkills: ['Circadian rhythms', 'Sleep hygiene', 'Chronotypes'], notes: 'Основа продуктивності.', createdAt: getISOString(20) },

  // Creative & Others
  { id: uuidv4(), name: 'Сторітелінг', category: 'Creative', totalMinutes: 150, targetMinutes: 2000, subSkills: ['Structure', 'Character development', 'Metaphors', 'Humor'], notes: 'Мистецтво розповідати історії.', createdAt: getISOString(30) },
  { id: uuidv4(), name: 'Фотографія', category: 'Creative', totalMinutes: 50, targetMinutes: 1000, subSkills: ['Composition', 'Lighting', 'Editing', 'Camera settings'], notes: 'Візуальне мистецтво.', createdAt: getISOString(10) },
  { id: uuidv4(), name: 'Психологія поведінки', category: 'Science', totalMinutes: 400, targetMinutes: 3000, subSkills: ['Habit formation', 'Motivation', 'Influence', 'Group dynamics'], notes: 'Чому люди роблять те, що роблять.', createdAt: getISOString(60) },
  { id: uuidv4(), name: 'Стратегічне мислення', category: 'Business', totalMinutes: 300, targetMinutes: 5000, subSkills: ['Game theory', 'Scenario planning', 'Risk assessment'], notes: 'Бачення довгострокової перспективи.', createdAt: getISOString(45) },
  { id: uuidv4(), name: 'Нетворкінг', category: 'Business', totalMinutes: 200, targetMinutes: 1000, subSkills: ['Active listening', 'Relationship building', 'Follow-up', 'Social capital'], notes: 'Побудова мережі контактів.', createdAt: getISOString(30) },
  { id: uuidv4(), name: 'Навчання як вчитися', category: 'Productivity', totalMinutes: 100, targetMinutes: 500, subSkills: ['Active recall', 'Spaced repetition', 'Feynman technique', 'Mind mapping'], notes: 'Метанавичка для швидкого навчання.', createdAt: getISOString(15) },
  { id: uuidv4(), name: 'Перша медична допомога', category: 'Health', totalMinutes: 20, targetMinutes: 100, subSkills: ['CPR', 'Bandaging', 'Emergency response'], notes: 'Життєво важлива навичка.', createdAt: getISOString(5) },
  { id: uuidv4(), name: 'Кулінарія', category: 'Creative', totalMinutes: 1000, targetMinutes: 5000, subSkills: ['Knife skills', 'Flavor pairing', 'Techniques', 'Baking'], notes: 'Приготування смачної та здорової їжі.', createdAt: getISOString(365) },
  { id: uuidv4(), name: 'Штучний інтелект (теорія)', category: 'Technology', totalMinutes: 50, targetMinutes: 1000, subSkills: ['Neural networks', 'Machine learning basics', 'Ethics', 'Future trends'], notes: 'Розуміння технологій майбутнього.', createdAt: getISOString(10) },
];

// Presets for skill selection - different paths/personas
export const SKILL_PRESETS = {
  entrepreneur: [
    { name: 'Продажі та переговори', category: 'Business', targetMinutes: 10000, subSkills: ['Cold calling', 'Closing', 'Handling objections', 'CRM'] },
    { name: 'Маркетинг', category: 'Business', targetMinutes: 5000, subSkills: ['Copywriting', 'SEO', 'PPC', 'Brand building'] },
    { name: 'Лідерство та менеджмент', category: 'Business', targetMinutes: 10000, subSkills: ['Delegation', 'Hiring', 'Motivation', 'Strategy'] },
    { name: 'Фінансова грамотність', category: 'Business', targetMinutes: 2000, subSkills: ['Budgeting', 'Investing', 'Taxes', 'Financial modeling'] },
    { name: 'Нетворкінг', category: 'Business', targetMinutes: 1000, subSkills: ['Active listening', 'Relationship building', 'Follow-up', 'Social capital'] },
    { name: 'Стратегічне мислення', category: 'Business', targetMinutes: 5000, subSkills: ['Game theory', 'Scenario planning', 'Risk assessment'] },
  ],
  developer: [
    { name: 'Програмування (Full Stack)', category: 'Technology', targetMinutes: 10000, subSkills: ['React', 'Node.js', 'TypeScript', 'Database design'] },
    { name: 'AI & Prompt Engineering', category: 'Technology', targetMinutes: 1000, subSkills: ['ChatGPT', 'Midjourney', 'LLM integration', 'Automation'] },
    { name: 'Data Analysis', category: 'Technology', targetMinutes: 2000, subSkills: ['Excel', 'SQL', 'Python Pandas', 'Visualization'] },
    { name: 'Сліпий друк', category: 'Productivity', targetMinutes: 600, subSkills: ['Touch typing', 'Shortcuts', 'Vim'] },
    { name: 'Тайм-менеджмент', category: 'Productivity', targetMinutes: 1000, subSkills: ['Planning', 'Prioritization', 'Deep Work', 'Systems'] },
    { name: 'Англійська мова (C1-C2)', category: 'Languages', targetMinutes: 5000, subSkills: ['Speaking', 'Writing', 'Listening', 'Vocabulary'] },
  ],
  contentCreator: [
    { name: 'Відеомонтаж', category: 'Technology', targetMinutes: 1000, subSkills: ['Premiere Pro', 'Storyboarding', 'Sound design', 'Color grading'] },
    { name: 'Сторітелінг', category: 'Creative', targetMinutes: 2000, subSkills: ['Structure', 'Character development', 'Metaphors', 'Humor'] },
    { name: 'Публічні виступи', category: 'Business', targetMinutes: 1000, subSkills: ['Storytelling', 'Body language', 'Slide design', 'Voice control'] },
    { name: 'Маркетинг', category: 'Business', targetMinutes: 5000, subSkills: ['Copywriting', 'SEO', 'PPC', 'Brand building'] },
    { name: 'Фотографія', category: 'Creative', targetMinutes: 1000, subSkills: ['Composition', 'Lighting', 'Editing', 'Camera settings'] },
    { name: 'Тайм-менеджмент', category: 'Productivity', targetMinutes: 1000, subSkills: ['Planning', 'Prioritization', 'Deep Work', 'Systems'] },
  ],
  healthOptimizer: [
    { name: 'Нутриціологія', category: 'Health', targetMinutes: 1000, subSkills: ['Macros', 'Micros', 'Supplements', 'Meal planning'] },
    { name: 'Фізіологія тренувань', category: 'Health', targetMinutes: 1500, subSkills: ['Anatomy', 'Biomechanics', 'Recovery', 'Programming'] },
    { name: 'Сон та відновлення', category: 'Health', targetMinutes: 500, subSkills: ['Circadian rhythms', 'Sleep hygiene', 'Chronotypes'] },
    { name: 'Медитація та Mindfulness', category: 'Health', targetMinutes: 2000, subSkills: ['Focus', 'Stress reduction', 'Breathwork', 'Vipassana'] },
    { name: 'Критичне мислення', category: 'Productivity', targetMinutes: 5000, subSkills: ['Logic', 'Cognitive biases', 'Mental models', 'Problem solving'] },
    { name: 'Кулінарія', category: 'Creative', targetMinutes: 5000, subSkills: ['Knife skills', 'Flavor pairing', 'Techniques', 'Baking'] },
  ],
  languageLearner: [
    { name: 'Англійська мова (C1-C2)', category: 'Languages', targetMinutes: 5000, subSkills: ['Speaking', 'Writing', 'Listening', 'Vocabulary'] },
    { name: 'Іспанська мова', category: 'Languages', targetMinutes: 2000, subSkills: ['Basics', 'Conversation', 'Grammar'] },
    { name: 'Швидкочитання', category: 'Productivity', targetMinutes: 200, subSkills: ['Scanning', 'Subvocalization control', 'Peripheral vision'] },
    { name: 'Навчання як вчитися', category: 'Productivity', targetMinutes: 500, subSkills: ['Active recall', 'Spaced repetition', 'Feynman technique', 'Mind mapping'] },
    { name: 'Критичне мислення', category: 'Productivity', targetMinutes: 5000, subSkills: ['Logic', 'Cognitive biases', 'Mental models', 'Problem solving'] },
    { name: 'Емоційний інтелект', category: 'Productivity', targetMinutes: 3000, subSkills: ['Empathy', 'Self-regulation', 'Social skills', 'Motivation'] },
  ],
  biohacker: [
    { name: 'Нутриціологія', category: 'Health', targetMinutes: 1000, subSkills: ['Macros', 'Micros', 'Supplements', 'Meal planning'] },
    { name: 'Сон та відновлення', category: 'Health', targetMinutes: 500, subSkills: ['Circadian rhythms', 'Sleep hygiene', 'Chronotypes'] },
    { name: 'Медитація та Mindfulness', category: 'Health', targetMinutes: 2000, subSkills: ['Focus', 'Stress reduction', 'Breathwork', 'Vipassana'] },
    { name: 'Фізіологія тренувань', category: 'Health', targetMinutes: 1500, subSkills: ['Anatomy', 'Biomechanics', 'Recovery', 'Programming'] },
    { name: 'AI & Prompt Engineering', category: 'Technology', targetMinutes: 1000, subSkills: ['ChatGPT', 'Midjourney', 'LLM integration', 'Automation'] },
    { name: 'Критичне мислення', category: 'Productivity', targetMinutes: 5000, subSkills: ['Logic', 'Cognitive biases', 'Mental models', 'Problem solving'] },
  ],
  leader: [
    { name: 'Лідерство та менеджмент', category: 'Business', targetMinutes: 10000, subSkills: ['Delegation', 'Hiring', 'Motivation', 'Strategy'] },
    { name: 'Емоційний інтелект', category: 'Productivity', targetMinutes: 3000, subSkills: ['Empathy', 'Self-regulation', 'Social skills', 'Motivation'] },
    { name: 'Публічні виступи', category: 'Business', targetMinutes: 1000, subSkills: ['Storytelling', 'Body language', 'Slide design', 'Voice control'] },
    { name: 'Психологія поведінки', category: 'Science', targetMinutes: 3000, subSkills: ['Habit formation', 'Motivation', 'Influence', 'Group dynamics'] },
    { name: 'Стратегічне мислення', category: 'Business', targetMinutes: 5000, subSkills: ['Game theory', 'Scenario planning', 'Risk assessment'] },
    { name: 'Нетворкінг', category: 'Business', targetMinutes: 1000, subSkills: ['Active listening', 'Relationship building', 'Follow-up', 'Social capital'] },
  ],
  investor: [
    { name: 'Фінансова грамотність', category: 'Business', targetMinutes: 2000, subSkills: ['Budgeting', 'Investing', 'Taxes', 'Financial modeling'] },
    { name: 'Стратегічне мислення', category: 'Business', targetMinutes: 5000, subSkills: ['Game theory', 'Scenario planning', 'Risk assessment'] },
    { name: 'Data Analysis', category: 'Technology', targetMinutes: 2000, subSkills: ['Excel', 'SQL', 'Python Pandas', 'Visualization'] },
    { name: 'Психологія поведінки', category: 'Science', targetMinutes: 3000, subSkills: ['Habit formation', 'Motivation', 'Influence', 'Group dynamics'] },
    { name: 'Тайм-менеджмент', category: 'Productivity', targetMinutes: 1000, subSkills: ['Planning', 'Prioritization', 'Deep Work', 'Systems'] },
    { name: 'Критичне мислення', category: 'Productivity', targetMinutes: 5000, subSkills: ['Logic', 'Cognitive biases', 'Mental models', 'Problem solving'] },
  ],
};

export const SEED_BOOKS: Book[] = [
  {
    id: BOOK_ATOMIC_HABITS_ID,
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Productivity',
    why: 'Щоб побудувати систему звичок, яка працює на автоматі.',
    topIdeas: ['1% better every day', 'Identity-based habits', 'Systems > Goals'],
    rating: 5,
    status: 'completed',
    pagesRead: 320,
    totalPages: 320,
    dailyPagesGoal: 20,
    favorite: true,
    startedAt: getISOString(60),
    completedAt: getISOString(45),
    lastUpdated: getISOString(45),
    createdAt: getISOString(60),
    notes: 'Найкраща книга про звички. Перечитувати щороку.'
  },
  {
    id: BOOK_DEEP_WORK_ID,
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'Productivity',
    why: 'Навчитися фокусуватися в епоху відволікань.',
    topIdeas: ['Deep vs Shallow work', 'Embrace boredom', 'Quit social media'],
    rating: 5,
    status: 'completed',
    pagesRead: 280,
    totalPages: 280,
    dailyPagesGoal: 20,
    favorite: true,
    startedAt: getISOString(40),
    completedAt: getISOString(30),
    lastUpdated: getISOString(30),
    createdAt: getISOString(40),
  },
  {
    id: BOOK_PSYCHOLOGY_MONEY_ID,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Finance',
    why: 'Зрозуміти свою поведінку з грошима.',
    topIdeas: ['Getting wealthy vs Staying wealthy', 'Compounding', 'Freedom'],
    rating: 5,
    status: 'reading',
    pagesRead: 145,
    totalPages: 250,
    dailyPagesGoal: 15,
    favorite: false,
    startedAt: getISOString(10),
    lastUpdated: getISOString(1),
    createdAt: getISOString(10),
  },
  {
    id: BOOK_MEDITATIONS_ID,
    title: 'Meditations',
    author: 'Marcus Aurelius',
    category: 'Philosophy',
    why: 'Стоїцизм як операційна система для життя.',
    topIdeas: ['Control your perception', 'Memento Mori', 'Amor Fati'],
    rating: 5,
    status: 'reading',
    pagesRead: 45,
    totalPages: 200,
    dailyPagesGoal: 5,
    favorite: true,
    startedAt: getISOString(15),
    lastUpdated: getISOString(2),
    createdAt: getISOString(15),
  },
  {
    id: BOOK_ZERO_TO_ONE_ID,
    title: 'Zero to One',
    author: 'Peter Thiel',
    category: 'Business',
    why: 'Як створювати щось нове, а не копіювати.',
    topIdeas: ['Competition is for losers', 'Secrets', 'Monopoly'],
    rating: 4,
    status: 'completed',
    pagesRead: 210,
    totalPages: 210,
    dailyPagesGoal: 20,
    favorite: false,
    startedAt: getISOString(90),
    completedAt: getISOString(85),
    lastUpdated: getISOString(85),
    createdAt: getISOString(90),
  },
  {
    id: BOOK_CANT_HURT_ME_ID,
    title: 'Can\'t Hurt Me',
    author: 'David Goggins',
    category: 'Biography',
    why: 'Розвиток ментальної стійкості.',
    topIdeas: ['The 40% Rule', 'Callouse your mind', 'Cookie Jar'],
    rating: 5,
    status: 'wishlist',
    pagesRead: 0,
    totalPages: 360,
    dailyPagesGoal: 20,
    favorite: false,
    lastUpdated: getISOString(5),
    createdAt: getISOString(5),
  },
  {
    id: BOOK_ESSENTIALISM_ID,
    title: 'Essentialism',
    author: 'Greg McKeown',
    category: 'Productivity',
    why: 'Робити менше, але краще.',
    topIdeas: ['Less but better', 'The power of No', 'Protect the asset'],
    rating: 4,
    status: 'wishlist',
    pagesRead: 0,
    totalPages: 270,
    dailyPagesGoal: 20,
    favorite: false,
    lastUpdated: getISOString(5),
    createdAt: getISOString(5),
  },
  {
    id: BOOK_PRINCIPLES_ID,
    title: 'Principles',
    author: 'Ray Dalio',
    category: 'Business',
    why: 'Систематизація життя та роботи.',
    topIdeas: ['Radical Truth', 'Radical Transparency', 'Idea Meritocracy'],
    rating: 5,
    status: 'wishlist',
    pagesRead: 0,
    totalPages: 590,
    dailyPagesGoal: 10,
    favorite: false,
    lastUpdated: getISOString(5),
    createdAt: getISOString(5),
  },
];

export const SEED_FEYNMAN_NOTES: FeynmanNote[] = [
  {
    id: uuidv4(),
    concept: 'Compound Interest',
    simpleExplanation: 'Compound interest is earning interest on your interest. Imagine a snowball rolling down a hill. It starts small, but as it rolls, it picks up more snow (interest), and that new snow helps it pick up even MORE snow. Over time, it grows exponentially.',
    gaps: 'Need to better understand the formula and how different compounding frequencies affect the final amount.',
    analogy: 'Snowball effect',
    createdAt: getISOString(10),
  },
  {
    id: uuidv4(),
    concept: 'Dopamine Detox',
    simpleExplanation: 'A dopamine detox is like a reset button for your brain\'s reward system. By avoiding high-stimulation activities (social media, junk food, video games) for a set period, you lower your tolerance. This makes hard, boring tasks (like studying or working) feel more rewarding and easier to do.',
    gaps: 'How long should it ideally last? 24 hours vs 7 days.',
    analogy: 'Fasting for the mind',
    createdAt: getISOString(5),
  }
];

export const SEED_READING_SESSIONS: ReadingSession[] = [
  // Atomic Habits sessions
  { id: uuidv4(), bookId: BOOK_ATOMIC_HABITS_ID, date: getISOString(55), pagesRead: 50, durationMinutes: 60, focusLevel: 'flow', mood: 'energized', notes: 'Great intro about 1% improvements.' },
  { id: uuidv4(), bookId: BOOK_ATOMIC_HABITS_ID, date: getISOString(50), pagesRead: 100, durationMinutes: 120, focusLevel: 'deep', mood: 'calm', notes: 'Concept of Identity is powerful.' },
  { id: uuidv4(), bookId: BOOK_ATOMIC_HABITS_ID, date: getISOString(45), pagesRead: 170, durationMinutes: 180, focusLevel: 'deep', mood: 'energized', notes: 'Finished the book. Must implement the 2-minute rule.' },
  // Deep Work sessions
  { id: uuidv4(), bookId: BOOK_DEEP_WORK_ID, date: getISOString(35), pagesRead: 100, durationMinutes: 90, focusLevel: 'deep', mood: 'calm' },
  { id: uuidv4(), bookId: BOOK_DEEP_WORK_ID, date: getISOString(30), pagesRead: 180, durationMinutes: 150, focusLevel: 'flow', mood: 'energized', notes: 'Quit social media chapter hit hard.' },
  // Recent sessions
  { id: uuidv4(), bookId: BOOK_PSYCHOLOGY_MONEY_ID, date: getDateString(0), pagesRead: 20, durationMinutes: 30, focusLevel: 'light', mood: 'calm' },
];

export const SEED_AI_CHAT: AICoachState = {
  messages: [
    { id: uuidv4(), role: 'user', content: 'I feel overwhelmed with my SaaS project. Where do I start?', createdAt: getISOString(2), type: 'text' },
    { id: uuidv4(), role: 'assistant', content: 'It\'s normal to feel that way. Let\'s break it down using the "Eat That Frog" method. What is the ONE most important task that, if completed, would have the biggest impact on your project today?', createdAt: getISOString(2), type: 'text' },
    { id: uuidv4(), role: 'user', content: 'Fixing the authentication bug. It\'s blocking everything else.', createdAt: getISOString(2), type: 'text' },
    { id: uuidv4(), role: 'assistant', content: 'Great. That is your Frog. 🐸\n\nCommit to doing NOTHING else until that bug is fixed. Can you set a 90-minute Deep Work block for this right now?', createdAt: getISOString(2), type: 'suggestion' },
  ],
  isTyping: false
};

export const SEED_FINANCE: FinanceState = {
  entries: [
    { id: uuidv4(), type: 'income', category: 'Salary', amount: 5000, description: 'Monthly Salary', date: getDateString(0) },
    { id: uuidv4(), type: 'income', category: 'Freelance', amount: 1200, description: 'Consulting Project', date: getDateString(5) },
    { id: uuidv4(), type: 'expense', category: 'Rent', amount: 1500, description: 'Apartment Rent', date: getDateString(1) },
    { id: uuidv4(), type: 'expense', category: 'Food', amount: 400, description: 'Groceries & Restaurants', date: getDateString(2) },
    { id: uuidv4(), type: 'expense', category: 'Transport', amount: 100, description: 'Uber & Fuel', date: getDateString(3) },
    { id: uuidv4(), type: 'expense', category: 'Health', amount: 150, description: 'Gym & Supplements', date: getDateString(4) },
    { id: uuidv4(), type: 'saving', category: 'Emergency Fund', amount: 1000, description: 'Monthly contribution', date: getDateString(0) },
    { id: uuidv4(), type: 'investment', category: 'Stock Market', amount: 500, description: 'S&P 500 ETF', date: getDateString(0) },
  ],
  investments: [
    { id: uuidv4(), name: 'S&P 500 (VOO)', category: 'etf', amountInvested: 15000, currentValue: 18500, lastUpdated: getISOString(0) },
    { id: uuidv4(), name: 'Apple (AAPL)', category: 'stock', amountInvested: 5000, currentValue: 7200, lastUpdated: getISOString(0) },
    { id: uuidv4(), name: 'Bitcoin (BTC)', category: 'crypto', amountInvested: 2000, currentValue: 3500, lastUpdated: getISOString(0) },
    { id: uuidv4(), name: 'Real Estate Fund', category: 'real_estate', amountInvested: 10000, currentValue: 10500, lastUpdated: getISOString(0) },
  ],
  sevenRulesCompleted: {
    'spend_less_than_earn': true,
    'emergency_fund': true,
    'invest_difference': true,
    'avoid_bad_debt': true,
  },
  fireData: {
    annualExpenses: 36000,
    currentSavings: 39700, // Sum of investments + cash (implied)
    annualSavings: 24000,
    expectedReturn: 8,
  }
};

export const SEED_MINDSET: MindsetState = {
  cookieJar: [
    { id: uuidv4(), victory: 'Пробіг марафон з травмою коліна', date: getISOString(365) },
    { id: uuidv4(), victory: 'Закрив клієнта після 50 відмов', date: getISOString(120) },
    { id: uuidv4(), victory: 'Вивчив React за 2 тижні і здав проект', date: getISOString(200) },
    { id: uuidv4(), victory: 'Встав о 5:00 100 днів підряд', date: getISOString(10) },
  ],
  decisions: [
    { id: uuidv4(), decision: 'Звільнитися з роботи і почати бізнес', reasoning: 'Стеля в зарплаті, хочу свободи', expectedOutcome: 'Складний рік, потім ріст', actualOutcome: 'Важко, але дохід х3 через 2 роки', lesson: 'Ризик виправданий, якщо є план', date: getISOString(700) },
  ],
  affirmations: [
    { id: uuidv4(), text: 'Я дисциплінована машина, яка досягає будь-якої цілі', category: 'identity', usageCount: 45 },
    { id: uuidv4(), text: 'Я створюю цінність і гроші приходять легко', category: 'growth', usageCount: 30 },
    { id: uuidv4(), text: 'Я спокійний і впевнений у будь-якій ситуації', category: 'confidence', usageCount: 20 },
  ],
  visualizations: [
    { id: uuidv4(), title: 'Ідеальний ранок', description: 'Прокидаюсь, повний енергії, холодний душ, робота над мрією', durationMinutes: 5, imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&auto=format&fit=crop&q=60' },
    { id: uuidv4(), title: 'Запуск продукту', description: 'Натискаю кнопку "Deploy", бачу перших користувачів і оплати', durationMinutes: 10, imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60' },
  ]
};

export const SEED_HEALTH: HealthState = {
  sleep: Array.from({ length: 7 }, (_, i) => ({
    id: uuidv4(),
    date: getDateString(6 - i),
    bedtime: '22:00',
    wakeTime: '05:00',
    quality: 85 + Math.floor(Math.random() * 10),
    hoursSlept: 7,
  })),
  exercise: [
    { id: uuidv4(), date: getDateString(0), type: 'Iron Mind Complex', duration: 45, intensity: 'high' },
    { id: uuidv4(), date: getDateString(1), type: '10km Run', duration: 55, intensity: 'medium' },
    { id: uuidv4(), date: getDateString(2), type: 'Heavy Lifting (Chest)', duration: 60, intensity: 'high' },
    { id: uuidv4(), date: getDateString(4), type: 'HIIT Cardio', duration: 30, intensity: 'high' },
  ],
  energy: Array.from({ length: 7 }, (_, i) => ({
    id: uuidv4(),
    date: getDateString(6 - i),
    physical: 8 + Math.floor(Math.random() * 2),
    emotional: 7 + Math.floor(Math.random() * 3),
    mental: 8 + Math.floor(Math.random() * 2),
    spiritual: 9,
  })),
  fasting: {
    isFasting: true,
    startTime: new Date(new Date().setHours(20, 0, 0, 0)).toISOString(),
    targetDuration: 16,
    history: Array.from({ length: 5 }, (_, i) => ({
      id: uuidv4(),
      startTime: subDays(new Date().setHours(20, 0, 0, 0), i + 1).toISOString(),
      endTime: subDays(new Date().setHours(12, 0, 0, 0), i).toISOString(),
      durationSeconds: 16 * 3600,
      targetDuration: 16,
    }))
  }
};

export const SEED_12_WEEK_YEAR: TwelveWeekYear = {
  id: uuidv4(),
  title: 'SaaS Launch Sprint',
  startDate: getDateString(0),
  endDate: format(subDays(new Date(), -84), 'yyyy-MM-dd'),
  goals: [GOAL_SAAS_ID, GOAL_AWS_ID, GOAL_FINANCE_ID],
  status: 'active',
  weeks: Array.from({ length: 12 }, (_, i) => ({
    id: uuidv4(),
    weekNumber: i + 1,
    startDate: format(subDays(new Date(), -i * 7), 'yyyy-MM-dd'),
    endDate: format(subDays(new Date(), -(i * 7 + 6)), 'yyyy-MM-dd'),
    tactics: [
      'Deploy MVP to Production',
      'Write 5 SEO Articles',
      'Contact 10 Potential Users',
      'Study AWS for 5 hours',
      'Transfer $500 to Investment Account'
    ],
    score: i === 0 ? 0 : Math.floor(Math.random() * 30) + 70, // Past weeks have scores, current is 0
    notes: i === 0 ? 'Current week - focus on execution!' : 'Great progress, keep pushing.',
  })),
};

export const SEED_DAILY_LOGS: DailyLog[] = Array.from({ length: 14 }, (_, i) => {
  const dayOffset = 13 - i;
  const date = getDateString(dayOffset);
  const isWeekend = [0, 6].includes(subDays(new Date(), dayOffset).getDay());
  
  return {
    id: uuidv4(),
    userId: USER_ID,
    date,
    silenceCompleted: Math.random() > 0.15,
    silenceDuration: Math.floor(Math.random() * 10) + 5,
    affirmationsCompleted: Math.random() > 0.2,
    visualizationCompleted: Math.random() > 0.25,
    exerciseCompleted: !isWeekend && Math.random() > 0.3,
    exerciseType: ['HIIT', 'Силове', 'Біг', 'Йога'][Math.floor(Math.random() * 4)],
    exerciseDuration: Math.floor(Math.random() * 30) + 20,
    readingCompleted: Math.random() > 0.1,
    readingPages: Math.floor(Math.random() * 25) + 10,
    scribingCompleted: Math.random() > 0.2,
    frogOfTheDay: 'Найважливіше завдання дня',
    frogCompleted: Math.random() > 0.35,
    frogCompletedTime: Math.random() > 0.5 ? '09:30' : null,
    deepWorkHours: isWeekend ? Math.random() * 2 : Math.random() * 4 + 2,
    deepWorkSessions: isWeekend ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 3) + 1,
    gratitudeList: [
      'Здоров\'я та енергія',
      'Підтримка сім\'ї',
      'Можливість працювати над цікавими проектами'
    ],
    focusToday: 'Завершити технічну документацію',
    excitedAbout: 'Запуск нової функції',
    committedTo: 'Залишатися сфокусованим на головному',
    wins: dayOffset === 0 ? [] : [
      'Завершив важливе завдання',
      'Провів продуктивний дзвінок',
      'Виконав всі звички'
    ],
    lessons: dayOffset === 0 ? [] : [
      'Потрібно краще планувати час',
      'Важливо робити перерви'
    ],
    improvements: dayOffset === 0 ? [] : [
      'Почати день раніше',
      'Менше часу в соцмережах'
    ],
    tomorrowPriorities: [
      'Завершити документацію API',
      'Зателефонувати інвестору',
      'Тренування'
    ],
    productivityScore: Math.floor(Math.random() * 3) + 7,
    energyScore: Math.floor(Math.random() * 3) + 6,
    moodScore: Math.floor(Math.random() * 3) + 7,
    overallScore: Math.floor(Math.random() * 2) + 7,
    journalEntry: dayOffset === 0 ? '' : `Сьогодні був продуктивний день. Вдалося завершити кілька важливих завдань. Відчуваю прогрес у своїх цілях. Потрібно продовжувати рухатися вперед.`
  };
});

export const SEED_JOURNAL_ENTRIES: JournalEntry[] = [
  // Morning entries
  {
    id: uuidv4(),
    userId: USER_ID,
    date: getDateString(0),
    type: 'morning',
    title: 'Ранкові думки',
    content: 'Сьогодні почуваюся добре. Виспався, повний енергії. Головний фокус на документації API - це моя "жаба" дня. Візуалізував успішний запуск продукту та позитивні відгуки від користувачів.',
    gratitudeItems: ['Здоров\'я', 'Підтримка дружини', 'Можливість працювати з дому'],
    mood: 8,
    tags: ['ранок', 'продуктивність', 'фокус'],
    createdAt: getISOString(0),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    date: getDateString(1),
    type: 'morning',
    title: 'Початок нового дня',
    content: 'Вчора був складний день, але сьогодні свіжий старт. Зосереджуюсь на 3 ключових завданнях. Афірмація дня: "Я створюю цінність щодня".',
    gratitudeItems: ['Новий день', 'Кава', 'Тиша вранці'],
    mood: 7,
    tags: ['ранок', 'перезавантаження'],
    createdAt: getISOString(1),
  },
  // Evening entries
  {
    id: uuidv4(),
    userId: USER_ID,
    date: getDateString(1),
    type: 'evening',
    title: 'Підсумки дня',
    content: 'День пройшов добре. Виконав 80% запланованого. Головна перемога - завершив прототип нової функції. Урок дня: потрібно краще оцінювати час на завдання.',
    gratitudeItems: ['Продуктивний день', 'Підтримка команди', 'Вечеря з сім\'єю'],
    mood: 8,
    tags: ['вечір', 'рефлексія', 'перемоги'],
    createdAt: getISOString(1),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    date: getDateString(2),
    type: 'evening',
    title: 'Рефлексія',
    content: 'Сьогодні відчував опір до складного завдання. Замість прокрастинації, застосував техніку Pomodoro - і це спрацювало! Завершив документацію за 4 помідори.',
    gratitudeItems: ['Сила волі', 'Техніки продуктивності', 'Результат праці'],
    mood: 9,
    tags: ['вечір', 'pomodoro', 'перемога над собою'],
    createdAt: getISOString(2),
  },
  // Gratitude entries
  {
    id: uuidv4(),
    userId: USER_ID,
    date: getDateString(3),
    type: 'gratitude',
    title: 'Вдячність',
    content: 'Сьогодні особливо вдячний за можливість займатися улюбленою справою. За сім\'ю, яка підтримує. За здоров\'я, яке дозволяє активно працювати.',
    gratitudeItems: ['Улюблена робота', 'Сім\'я', 'Здоров\'я', 'Друзі', 'Можливості'],
    mood: 9,
    tags: ['вдячність', 'щастя'],
    createdAt: getISOString(3),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    date: getDateString(5),
    type: 'gratitude',
    title: 'За що я вдячний',
    content: 'Простий день, але повний маленьких радощів. Вдячний за ранкову каву, за сонце за вікном, за можливість вчитися новому кожен день.',
    gratitudeItems: ['Ранкова кава', 'Сонячний день', 'Нові знання'],
    mood: 8,
    tags: ['вдячність', 'прості радощі'],
    createdAt: getISOString(5),
  },
  // Reflection entries
  {
    id: uuidv4(),
    userId: USER_ID,
    date: getDateString(7),
    type: 'reflection',
    title: 'Тижнева рефлексія',
    content: `# Підсумки тижня

## Що пішло добре:
- Виконав 85% запланованих завдань
- Streak медитації: 12 днів
- Закінчив читати "Atomic Habits"

## Що можна покращити:
- Менше часу на соцмережі
- Краще планувати великі завдання
- Більше часу з сім'єю

## Цілі на наступний тиждень:
1. Запустити бета-версію
2. Пробігти 15 км
3. Прочитати 2 розділи з AWS`,
    gratitudeItems: ['Прогрес', 'Здоров\'я', 'Підтримка'],
    mood: 8,
    tags: ['рефлексія', 'тиждень', 'цілі'],
    createdAt: getISOString(7),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    date: getDateString(14),
    type: 'reflection',
    title: 'Місячна рефлексія',
    content: `# Підсумки місяця

## Досягнення:
- Запустив MVP продукту ✅
- 28 днів медитації підряд ✅
- Прочитав 4 книги ✅
- Схуднув 3 кг ✅

## Уроки:
- Маленькі кроки ведуть до великих змін
- Важливість ранкової рутини
- Фокус на одному завданні

## Фокус наступного місяця:
- Залучення перших 100 користувачів
- Підготовка до сертифікації AWS
- Продовжувати streak звичок`,
    gratitudeItems: ['Прогрес за місяць', 'Дисципліна', 'Підтримка близьких'],
    mood: 9,
    tags: ['рефлексія', 'місяць', 'досягнення'],
    createdAt: getISOString(14),
  },
  // Free entries
  {
    id: uuidv4(),
    userId: USER_ID,
    date: getDateString(4),
    type: 'free',
    title: 'Ідеї для продукту',
    content: `Сьогодні під час медитації прийшла ідея:

## Нова функція
Додати геміфікацію до продукту:
- Система рівнів
- Досягнення
- Streak бонуси
- Leaderboard

Це може збільшити retention на 30-40% згідно з дослідженнями.

## Наступні кроки:
1. Дослідити конкурентів
2. Створити wireframes
3. Обговорити з командою`,
    gratitudeItems: [],
    mood: 8,
    tags: ['ідеї', 'продукт', 'геміфікація'],
    createdAt: getISOString(4),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    date: getDateString(6),
    type: 'free',
    title: 'Думки про баланс',
    content: `Останнім часом багато думаю про work-life balance.

З одного боку, хочу досягти успіху в бізнесі. З іншого - не пропустити дитинство дітей.

Рішення: чіткі межі. Робота до 18:00. Після - тільки сім'я. Вихідні - священні.

"The ONE Thing" - треба перечитати главу про баланс.`,
    gratitudeItems: [],
    mood: 7,
    tags: ['баланс', 'сім\'я', 'рефлексія'],
    createdAt: getISOString(6),
  },
];

export const SEED_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_frog', name: 'Перша Жаба', description: 'Виконано перше завдання з пріоритетом А', icon: '🐸', points: 100, unlockedAt: getISOString(10), category: 'productivity' },
  { id: 'habit_starter', name: 'Початок шляху', description: 'Створено першу звичку', icon: '🌱', points: 50, unlockedAt: getISOString(45), category: 'habits' },
  { id: 'streak_7', name: 'Тиждень сили', description: 'Стрік виконання звичок 7 днів', icon: '🔥', points: 500, unlockedAt: getISOString(5), category: 'habits' },
  { id: 'goal_setter', name: 'Цілеспрямований', description: 'Створено 3 активні цілі', icon: '🎯', points: 200, unlockedAt: getISOString(30), category: 'goals' },
  { id: 'journaler', name: 'Літописець', description: '7 записів в журналі', icon: '✍️', points: 300, unlockedAt: getISOString(7), category: 'mindfulness' },
  { id: 'morning_master', name: 'Володар ранку', description: 'Виконано ранкову рутину 5 разів підряд', icon: '🌅', points: 400, unlockedAt: getISOString(3), category: 'productivity' },
  { id: 'reader', name: 'Книжковий хробак', description: 'Прочитано першу книгу', icon: '�', points: 250, unlockedAt: getISOString(15), category: 'reading' },
  { id: 'investor', name: 'Інвестор', description: 'Створено фінансовий портфель', icon: '�', points: 500, unlockedAt: getISOString(2), category: 'special' },
  { id: 'iron_mind', name: 'Залізна воля', description: 'Виконано тренування Iron Mind', icon: '💪', points: 1000, unlockedAt: getISOString(1), category: 'special' },
  { id: 'atomic', name: 'Атомні звички', description: '1% покращення 30 днів поспіль', icon: '⚛️', points: 1000, unlockedAt: null, category: 'special' },
];

export const SEED_INBOX: string[] = [
  'Дослідити конкурентів для SaaS продукту (feature matrix)',
  'Знайти ментора по маркетингу',
  'Записатися на курс по публічним виступам',
  'Купити нові бігові кросівки (Asics/Nike)',
  'Оновити підписку на ChatGPT Plus',
  'Ідея для відео: "Як я планую свій рік"',
  'Переглянути інвестиційний портфель (ребалансування)',
  'Подарунок для дружини на річницю',
  'Налаштувати бекапи для сервера',
  'Прочитати "Zero to One" ще раз'
];
