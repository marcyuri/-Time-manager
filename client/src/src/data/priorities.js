export const TASK_PRIORITIES = {
  neutral: {
    label: 'Neutre',
    description: 'Tâche normale sans urgence',
    className: 'task-card--neutral',
  },
  low: {
    label: 'Assez importante',
    description: 'Tâche utile à faire',
    className: 'task-card--low',
  },
  medium: {
    label: 'Moyenne',
    description: 'Tâche à surveiller',
    className: 'task-card--medium',
  },
  important: {
    label: 'Importante',
    description: 'Tâche prioritaire',
    className: 'task-card--important',
  },
}

export const PRIORITY_OPTIONS = Object.entries(TASK_PRIORITIES).map(([value, config]) => ({
  value,
  ...config,
}))
