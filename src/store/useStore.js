import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      profile: {
        name: 'Aditya Sinha',
        role: 'TaskFlow Founder',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aditya',
        isPro: true // Hardcoded to true for demo purposes
      },
      updateProfile: (profile) => set((state) => ({ profile: { ...state.profile, ...profile } })),

      tasks: [
        { id: 't1', title: 'Design Landing Page', description: 'Wireframes and hi-fi designs', status: 'todo', columnId: 'todo' },
        { id: 't2', title: 'Implement Auth', description: 'JWT authentication', status: 'in-progress', columnId: 'in-progress' },
        { id: 't3', title: 'Setup CI/CD', description: 'GitHub Actions workflow', status: 'done', columnId: 'done' },
      ],
      columns: [
        { id: 'todo', title: 'To Do' },
        { id: 'in-progress', title: 'In Progress' },
        { id: 'done', title: 'Done' }
      ],
      productivityTrends: [
        { name: 'Mon', high: 4, medium: 2, low: 1 },
        { name: 'Tue', high: 3, medium: 4, low: 0 },
        { name: 'Wed', high: 5, medium: 1, low: 2 },
        { name: 'Thu', high: 2, medium: 6, low: 1 },
        { name: 'Fri', high: 6, medium: 3, low: 0 },
        { name: 'Sat', high: 1, medium: 2, low: 4 },
        { name: 'Sun', high: 0, medium: 1, low: 5 },
      ],

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, { ...task, id: `t${Date.now()}` }] })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => (t.id === id ? { ...t, ...updates } : t))
      })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),
      moveTask: (taskId, newColumnId) => set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, columnId: newColumnId, status: newColumnId } : t)
      })),
      editingTask: null,
      setEditingTask: (task) => set({ editingTask: task }),

      addColumn: (column) => set((state) => ({ columns: [...state.columns, { ...column, id: `c${Date.now()}` }] })),
      deleteColumn: (id) => set((state) => ({
        columns: state.columns.filter(c => c.id !== id),
        tasks: state.tasks.filter(t => t.columnId !== id)
      }))
    }),
    {
      name: 'task-manager-storage',
    }
  )
);
