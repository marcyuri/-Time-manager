const STORAGE_KEY = 'time_week_tasks'

const starterTasks = [
  {
    id: 'task_001',
    title: 'Planifier la semaine',
    description: 'Organiser les tâches principales avant de commencer.',
    day: 'monday',
    startTime: '08:00',
    duration: 60,
    priority: 'medium',
    status: 'todo',
  },
  {
    id: 'task_002',
    title: 'Session React',
    description: 'Structurer les composants de l’application.',
    day: 'wednesday',
    startTime: '14:00',
    duration: 90,
    priority: 'important',
    status: 'todo',
  },
]

export function getTasks() {
  const storedTasks = localStorage.getItem(STORAGE_KEY)
  if (!storedTasks) return starterTasks

  try {
    return JSON.parse(storedTasks)
  } catch {
    return starterTasks
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}
