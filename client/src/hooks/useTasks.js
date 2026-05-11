import { useEffect, useMemo, useState } from 'react'
import { getTasks, createTask, updateTask, removeTask } from '../services/taskService'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(() => setError('Erreur lors du chargement des tâches.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredTasks = useMemo(() => {
    if (priorityFilter === 'all') return tasks

    return tasks.filter((task) => task.priority === priorityFilter)
  }, [tasks, priorityFilter])

  async function upsertTask(taskData) {
    try {
      setError('')

      if (taskData.id) {
        const updatedTask = await updateTask(taskData.id, taskData)

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        )
      } else {
        const createdTask = await createTask(taskData)

        setTasks((currentTasks) => [
          ...currentTasks,
          createdTask,
        ])
      }

      return true
    } catch (error) {
      console.error(error)
      setError('Erreur lors de la sauvegarde de la tâche.')
      return false
    }
  }

  async function deleteTask(taskId) {
    try {
      await removeTask(taskId)

      setTasks((current) =>
        current.filter((task) => task.id !== taskId)
      )
    } catch {
      setError('Erreur lors de la suppression de la tâche.')
    }
  }

  async function toggleTaskStatus(taskId) {
    const task = tasks.find((t) => t.id === taskId)

    if (!task) return

    const nextStatus = task.status === 'done' ? 'todo' : 'done'

    try {
      const updated = await updateTask(taskId, {
        ...task,
        status: nextStatus,
      })

      setTasks((current) =>
        current.map((t) =>
          t.id === updated.id ? updated : t
        )
      )
    } catch {
      setError('Erreur lors de la mise à jour du statut.')
    }
  }

  async function resetTasks() {
    try {
      await Promise.all(tasks.map((t) => removeTask(t.id)))

      setTasks([])
      setError('')
    } catch {
      setError('Erreur lors de la réinitialisation.')
    }
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
    loading,
  }
}