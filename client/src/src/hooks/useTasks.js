import { useEffect, useMemo, useState } from 'react'
import {
  getTasks,
  createTask,
  updateTask,
  removeTask,
} from '../services/taskService'
import { timeToMinutes } from '../utils/time'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(() =>
        setError('Erreur lors du chargement des tâches.')
      )
      .finally(() => setLoading(false))
  }, [])

  const filteredTasks = useMemo(() => {
    if (priorityFilter === 'all') return tasks

    return tasks.filter(
      (task) => task.priority === priorityFilter
    )
  }, [tasks, priorityFilter])

  function hasConflict(taskToCheck, targetDay) {
    const start = timeToMinutes(taskToCheck.startTime)
    const end = start + Number(taskToCheck.duration)

    return tasks.find((task) => {
      if (task.day !== targetDay) return false
      if (task.id === taskToCheck.id) return false

      const taskStart = timeToMinutes(task.startTime)
      const taskEnd = taskStart + Number(task.duration)

      return start < taskEnd && end > taskStart
    })
  }

  async function upsertTask(taskData) {
    try {
      setError('')

      const targetDay = taskData.day

      const conflict = hasConflict(taskData, targetDay)

      if (conflict) {
        setError(
          `Conflit d’horaire : cette tâche chevauche déjà "${conflict.title}" dans ce jour.`
        )
        return false
      }

      if (taskData.id) {
        const updatedTask = await updateTask(
          taskData.id,
          taskData
        )

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

  async function moveTask(taskId, targetDay) {
    const task = tasks.find((item) => item.id === taskId)

    if (!task) return false

    const movedTask = {
      ...task,
      day: targetDay,
    }

    const conflict = hasConflict(movedTask, targetDay)

    if (conflict) {
      setError(
        `Déplacement impossible : "${movedTask.title}" chevauche déjà "${conflict.title}" dans cette colonne.`
      )
      return false
    }

    try {
      setError('')

      const updatedTask = await updateTask(taskId, movedTask)

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === taskId ? updatedTask : item
        )
      )

      return true
    } catch (error) {
      console.error(error)
      setError('Erreur lors du déplacement de la tâche.')
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

    const nextStatus =
      task.status === 'done' ? 'todo' : 'done'

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
      await Promise.all(
        tasks.map((task) => removeTask(task.id))
      )

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
    moveTask,
    loading,
  }
}