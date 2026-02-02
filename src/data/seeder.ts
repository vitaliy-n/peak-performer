import { v4 as uuidv4 } from 'uuid';
import { format, subDays } from 'date-fns';
import type { User, Goal, Habit, Task, Project, DailyLog, JournalEntry, Achievement } from '../types';

const USER_ID = 'demo-user-001';

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
  }
];

export const SEED_GOALS: Goal[] = [
  // Career Goals
  {
    id: uuidv4(),
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
      { id: uuidv4(), goalId: '', description: 'Провести дослідження ринку', priority: 'A', context: '@комп\'ютер', estimatedTime: 120, dueDate: null, completed: true, completedAt: getISOString(85) },
      { id: uuidv4(), goalId: '', description: 'Створити MVP', priority: 'A', context: '@комп\'ютер', estimatedTime: 480, dueDate: null, completed: true, completedAt: getISOString(60) },
      { id: uuidv4(), goalId: '', description: 'Запустити бета-версію', priority: 'A', context: '@комп\'ютер', estimatedTime: 120, dueDate: null, completed: true, completedAt: getISOString(30) },
      { id: uuidv4(), goalId: '', description: 'Залучити перших 100 користувачів', priority: 'A', context: '@комп\'ютер', estimatedTime: 240, dueDate: getDateString(-30), completed: false, completedAt: null },
    ],
    status: 'active',
    progress: 25,
    createdAt: getISOString(90),
    updatedAt: getISOString(1),
  },
  {
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
      { id: uuidv4(), goalId: '', description: 'Бігати 3 рази на тиждень', priority: 'A', context: '@вулиця', estimatedTime: 60, dueDate: null, completed: false, completedAt: null },
      { id: uuidv4(), goalId: '', description: 'Пробігти 10 км', priority: 'B', context: '@вулиця', estimatedTime: 60, dueDate: null, completed: true, completedAt: getISOString(45) },
      { id: uuidv4(), goalId: '', description: 'Пробігти 15 км', priority: 'B', context: '@вулиця', estimatedTime: 90, dueDate: null, completed: false, completedAt: null },
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
    projectId: null,
    createdAt: getISOString(3),
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
    projectId: null,
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
    projectId: null,
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
    projectId: null,
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
    projectId: null,
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
    projectId: null,
    createdAt: getISOString(0),
  },
];

export const SEED_PROJECTS: Project[] = [
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Запуск SaaS продукту',
    description: 'Всі задачі пов\'язані з розробкою та запуском продукту',
    status: 'active',
    tasks: [],
    createdAt: getISOString(90),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Підготовка до напівмарафону',
    description: 'Тренувальний план та підготовка',
    status: 'active',
    tasks: [],
    createdAt: getISOString(60),
  },
  {
    id: uuidv4(),
    userId: USER_ID,
    title: 'Ремонт квартири',
    description: 'Косметичний ремонт кабінету',
    status: 'someday',
    tasks: [],
    createdAt: getISOString(120),
  },
];

// Generate daily logs for the past 14 days
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
  { id: 'first_frog', name: 'Перша жаба', description: 'Виконайте свою першу "жабу"', icon: '🐸', points: 50, unlockedAt: getISOString(40), category: 'productivity' },
  { id: 'early_bird', name: 'Рання пташка', description: 'Прокиньтесь о 5 ранку 7 днів поспіль', icon: '🌅', points: 200, unlockedAt: null, category: 'habits' },
  { id: 'habit_starter', name: 'Початок звички', description: 'Створіть свою першу звичку', icon: '🌱', points: 25, unlockedAt: getISOString(45), category: 'habits' },
  { id: 'streak_7', name: 'Тижневий streak', description: '7-денний streak будь-якої звички', icon: '🔥', points: 100, unlockedAt: getISOString(38), category: 'habits' },
  { id: 'streak_30', name: 'Місячний streak', description: '30-денний streak будь-якої звички', icon: '💪', points: 500, unlockedAt: null, category: 'habits' },
  { id: 'goal_setter', name: 'Ціль встановлена', description: 'Встановіть свою першу ціль', icon: '🎯', points: 25, unlockedAt: getISOString(44), category: 'goals' },
  { id: 'goal_crusher', name: 'Досягнення цілі', description: 'Досягніть своєї першої цілі', icon: '🏆', points: 200, unlockedAt: getISOString(15), category: 'goals' },
  { id: 'deep_worker', name: 'Глибока робота', description: '4 години глибокої роботи за день', icon: '🧠', points: 150, unlockedAt: getISOString(20), category: 'productivity' },
  { id: 'journaler', name: 'Журналіст', description: 'Напишіть 10 записів у журналі', icon: '📝', points: 100, unlockedAt: getISOString(30), category: 'mindfulness' },
  { id: 'reader', name: 'Читач', description: 'Прочитайте 100 сторінок', icon: '📚', points: 100, unlockedAt: getISOString(35), category: 'reading' },
  { id: 'morning_master', name: 'Майстер ранку', description: 'Виконайте ранкову рутину 7 днів поспіль', icon: '☀️', points: 300, unlockedAt: getISOString(25), category: 'habits' },
  { id: 'atomic', name: 'Атомні звички', description: '1% покращення 30 днів поспіль', icon: '⚛️', points: 1000, unlockedAt: null, category: 'special' },
];

export const SEED_INBOX: string[] = [
  'Перевірити нову бібліотеку для charts',
  'Ідея: подкаст про продуктивність',
  'Зателефонувати батькам',
  'Купити подарунок на день народження',
  'Дослідити можливості AI в продукті',
];
