import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { 
  INITIAL_TASKS, 
  INITIAL_PRIORITY_BOARD, 
  INITIAL_FORMULAS, 
  INITIAL_REMINDERS, 
  INITIAL_MASTERY,
  INITIAL_MILESTONES
} from './initialData';

// Custom storage object using idb-keyval
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export type SRSData = { interval: number; repetition: number; efactor: number; nextReviewDate: string };

export type Task = { id: string; title: string; subject: string; priority: string; estimatedMinutes: number; completed: boolean; date: string; carriedOver?: boolean };
export type PYQLog = { id: string; date: string; subject: string; topic: string; year: string; marksType: '1-mark' | '2-mark'; questionType: 'MCQ' | 'NAT' | 'MSQ'; result: 'Correct ✅' | 'Wrong ❌' | 'Skipped ⏭️'; timeTaken: number; errorType?: string; notes?: string };
export type MockLog = { id: string; date: string; type: string; source: string; overallScore: number; subjects: Record<string, {obtained: number; available: number}>; totalAttempted: number; correct: number; wrong: number; unattempted: number; timeTaken: number; notes: string; errorTypes: { concept: number; formula: number; time: number; silly: number } };
export type Formula = { id: string; name: string; content: string; subject: string; topic: string; confidence: 'Shaky' | 'Learning' | 'Confident'; lastReviewed: string; srs?: SRSData };
export type ErrorLog = { id: string; date: string; subject: string; topic: string; source: string; thought: string; correctAnswer: string; ruleViolated: string; errorType: string; status: 'Pending' | 'Re-attempted' | 'Mastered'; srs?: SRSData };
export type WeeklyReview = { id: string; weekRange: string; subjectsCovered: string[]; pyqsSolved: number; accuracy: number; mocksTaken: number; bestMockScore: number; topicsMastered: string[]; wentWell: string; toFix: string; priorities: string[]; formulaSheetsReviewed: string[] };
export type Mastery = { id: string; subject: string; topic: string; mastery: number; lastUpdated: string; notes: string; srs?: SRSData };
export type PriorityCard = { id: string; title: string; subject: string; marksAtStake: number; priorityLevel: string; status: '⚡ Daily Drill' | '📌 This Week' | '🎯 On Deck' | '✅ Done'; notes?: string };
export type Reminder = { id: string; title: string; message: string; time: string; repeat: string; active: boolean };
export type Milestone = { id: string; title: string; targetDate: string; status: 'Pending' | 'On track' | 'At risk' | 'Done'; phase: string; isCustom?: boolean };
export type LearningNote = { id: string; title: string; content: string; subject: string; topic: string; date: string; tags: string[]; srs?: SRSData };
export type Settings = { motivationCollapsed: boolean; dailyPYQTarget: number; sidebarCollapsed: boolean; firstLaunchDone: boolean };

interface AppState {
  tasks: Task[];
  pyqLogs: PYQLog[];
  mocks: MockLog[];
  formulas: Formula[];
  errors: ErrorLog[];
  weeklyReviews: WeeklyReview[];
  mastery: Mastery[];
  priorityBoard: PriorityCard[];
  reminders: Reminder[];
  milestones: Milestone[];
  notes: LearningNote[];
  settings: Settings;
  
  // Actions
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addPYQLog: (log: PYQLog) => void;
  updatePYQLog: (id: string, updates: Partial<PYQLog>) => void;
  deletePYQLog: (id: string) => void;

  addMock: (mock: MockLog) => void;
  
  updateFormula: (id: string, updates: Partial<Formula>) => void;
  addFormula: (formula: Formula) => void;

  addErrorLog: (error: ErrorLog) => void;
  updateErrorLog: (id: string, updates: Partial<ErrorLog>) => void;

  addWeeklyReview: (review: WeeklyReview) => void;
  
  updateMastery: (id: string, updates: Partial<Mastery>) => void;
  
  addPriorityCard: (card: PriorityCard) => void;
  updatePriorityCard: (id: string, updates: Partial<PriorityCard>) => void;
  deletePriorityCard: (id: string) => void;

  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  addReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;

  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  addMilestone: (milestone: Milestone) => void;

  addNote: (note: LearningNote) => void;
  updateNote: (id: string, updates: Partial<LearningNote>) => void;
  deleteNote: (id: string) => void;

  updateSettings: (updates: Partial<Settings>) => void;
  
  initializeData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: [],
      pyqLogs: [],
      mocks: [],
      formulas: [],
      errors: [],
      weeklyReviews: [],
      mastery: [],
      priorityBoard: [],
      reminders: [],
      milestones: [],
      notes: [],
      settings: { motivationCollapsed: false, dailyPYQTarget: 20, sidebarCollapsed: false, firstLaunchDone: false },

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) => set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t) })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),

      addPYQLog: (log) => set((state) => ({ pyqLogs: [...state.pyqLogs, log] })),
      updatePYQLog: (id, updates) => set((state) => ({ pyqLogs: state.pyqLogs.map(l => l.id === id ? { ...l, ...updates } : l) })),
      deletePYQLog: (id) => set((state) => ({ pyqLogs: state.pyqLogs.filter(l => l.id !== id) })),

      addMock: (mock) => set((state) => ({ mocks: [...state.mocks, mock] })),
      
      updateFormula: (id, updates) => set((state) => {
        let newReminders = [...state.reminders];
        const formulas = state.formulas.map(f => {
          if (f.id === id) {
            const updated = { ...f, ...updates };
            if (updates.confidence === 'Confident' && f.confidence !== 'Confident') {
              const nextDate = new Date();
              nextDate.setDate(nextDate.getDate() + 1);
              updated.srs = { interval: 1, repetition: 0, efactor: 2.5, nextReviewDate: nextDate.toISOString().split('T')[0] };
              newReminders.push({
                id: `rem_f_${Date.now()}_${Math.random()}`,
                title: 'Recall Session Scheduled',
                message: `Review formula: ${updated.name}`,
                time: '08:00',
                repeat: 'one-time',
                active: true
              });
            } else if (updates.confidence === 'Shaky' && f.confidence !== 'Shaky') {
              const nextDate = new Date();
              nextDate.setDate(nextDate.getDate() + 1);
              updated.srs = { interval: 1, repetition: 0, efactor: 2.5, nextReviewDate: nextDate.toISOString().split('T')[0] };
              newReminders.push({
                id: `rem_f_${Date.now()}_${Math.random()}`,
                title: 'Shaky Concept Re-scheduled',
                message: `Review formula: ${updated.name}`,
                time: '08:00',
                repeat: 'one-time',
                active: true
              });
            }
            return updated;
          }
          return f;
        });
        return { formulas, reminders: newReminders };
      }),
      addFormula: (formula) => set((state) => ({ formulas: [...state.formulas, formula] })),

      addErrorLog: (error) => set((state) => ({ errors: [...state.errors, error] })),
      updateErrorLog: (id, updates) => set((state) => ({ errors: state.errors.map(e => e.id === id ? { ...e, ...updates } : e) })),

      addWeeklyReview: (review) => set((state) => ({ weeklyReviews: [...state.weeklyReviews, review] })),

      updateMastery: (id, updates) => set((state) => {
        let newReminders = [...state.reminders];
        const mastery = state.mastery.map(m => {
          if (m.id === id) {
            const updated = { ...m, ...updates };
            if (updates.mastery === 100 && m.mastery !== 100) {
              const nextDate = new Date();
              nextDate.setDate(nextDate.getDate() + 1);
              updated.srs = { interval: 1, repetition: 0, efactor: 2.5, nextReviewDate: nextDate.toISOString().split('T')[0] };
              newReminders.push({
                id: `rem_m_${Date.now()}_${Math.random()}`,
                title: 'Topic Mastered - Recall Scheduled',
                message: `Review topic: ${updated.topic}`,
                time: '08:00',
                repeat: 'one-time',
                active: true
              });
            } else if (updates.mastery !== undefined && updates.mastery < 100 && m.mastery === 100) {
              const nextDate = new Date();
              nextDate.setDate(nextDate.getDate() + 1);
              updated.srs = { interval: 1, repetition: 0, efactor: 2.5, nextReviewDate: nextDate.toISOString().split('T')[0] };
              newReminders.push({
                id: `rem_m_${Date.now()}_${Math.random()}`,
                title: 'Topic Downgraded - Re-scheduled',
                message: `Review topic: ${updated.topic}`,
                time: '08:00',
                repeat: 'one-time',
                active: true
              });
            }
            return updated;
          }
          return m;
        });
        return { mastery, reminders: newReminders };
      }),

      addPriorityCard: (card) => set((state) => ({ priorityBoard: [...state.priorityBoard, card] })),
      updatePriorityCard: (id, updates) => set((state) => ({ priorityBoard: state.priorityBoard.map(c => c.id === id ? { ...c, ...updates } : c) })),
      deletePriorityCard: (id) => set((state) => ({ priorityBoard: state.priorityBoard.filter(c => c.id !== id) })),

      updateReminder: (id, updates) => set((state) => ({ reminders: state.reminders.map(r => r.id === id ? { ...r, ...updates } : r) })),
      addReminder: (reminder) => set((state) => ({ reminders: [...state.reminders, reminder] })),
      deleteReminder: (id) => set((state) => ({ reminders: state.reminders.filter(r => r.id !== id) })),

      updateMilestone: (id, updates) => set((state) => ({ milestones: state.milestones.map(m => m.id === id ? { ...m, ...updates } : m) })),
      addMilestone: (milestone) => set((state) => ({ milestones: [...state.milestones, milestone] })),

      addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
      updateNote: (id, updates) => set((state) => ({ notes: state.notes.map(n => n.id === id ? { ...n, ...updates } : n) })),
      deleteNote: (id) => set((state) => ({ notes: state.notes.filter(n => n.id !== id) })),

      updateSettings: (updates) => set((state) => ({ settings: { ...state.settings, ...updates } })),

      initializeData: () => set((state) => {
        if (state.settings.firstLaunchDone) return state;
        return {
          tasks: INITIAL_TASKS,
          priorityBoard: INITIAL_PRIORITY_BOARD as PriorityCard[],
          formulas: INITIAL_FORMULAS as Formula[],
          reminders: INITIAL_REMINDERS,
          mastery: INITIAL_MASTERY,
          milestones: INITIAL_MILESTONES as Milestone[],
          settings: { ...state.settings, firstLaunchDone: true }
        };
      })
    }),
    {
      name: 'gate_store',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
