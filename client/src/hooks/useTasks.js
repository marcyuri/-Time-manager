import { useEffect, useMemo, useState } from 'react'
import { getTasks, saveTasks } from '../services/taskService'
import { hasTaskConflict } from '../utils/time'

export function useTasks() {
  const [tasks, setTasks] = useState(() => getTasks())
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (priorityFilter === 'all') return tasks
    return tasks.filter((task) => task.priority === priorityFilter)
  }, [tasks, priorityFilter])

  function upsertTask(taskData) {
    const nextTask = {
      ...taskData,
      id: taskData.id || crypto.randomUUID(),
      duration: Number(taskData.duration),
      status: taskData.status || 'todo',
    }

    if (hasTaskConflict(tasks, nextTask)) {
      setError('Cette tâche chevauche une autre tâche dans le même jour.')
      return false
    }

    setTasks((currentTasks) => {
      const taskExists = currentTasks.some((task) => task.id === nextTask.id)
      if (taskExists) {
        return currentTasks.map((task) => (task.id === nextTask.id ? nextTask : task))
      }
      return [...currentTasks, nextTask]
    })

    setError('')
    return true
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
  }

  function toggleTaskStatus(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
          : task,
      ),
    )
  }

  function resetTasks() {
    setTasks([])
    setError('')
  }

  return {
    tasks,
    filteredTasks,
    priorityFilter,
    setPriorityFilter,
    error,
    setError,
    upsertTask,
    deleteTask,
    toggleTaskStatus,
    resetTasks,
  }
}
