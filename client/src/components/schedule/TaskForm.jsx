import { useEffect, useMemo, useState } from 'react'
import { PRIORITY_OPTIONS } from '../../data/priorities'
import { WEEK_DAYS } from '../../data/weekDays'
import { timeToMinutes } from '../../utils/time'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

const initialForm = {
  title: '',
  description: '',
  day: 'monday',
  startTime: '08:00',
  duration: 60,
  priority: 'neutral',
  status: 'todo',
}

const DURATION_OPTIONS = [
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1h' },
  { value: 90, label: '1h30' },
  { value: 120, label: '2h' },
  { value: 180, label: '3h' },
]

export function TaskForm({
  selectedDay,
  editingTask,
  tasks = [],
  error,
  onSubmit,
  onClose,
}) {

  const [formData, setFormData] = useState(initialForm)
  const [localError, setLocalError] = useState('')

  function getDefaultStartTimeForDay(day, tasks) {
    const dayTasks = tasks
      .filter((task) => task.day === day)
      .sort(
        (a, b) =>
          timeToMinutes(a.startTime) -
          timeToMinutes(b.startTime)
      )

    if (dayTasks.length === 0) {
      return '08:00'
    }

    const lastTask = dayTasks[dayTasks.length - 1]

    const lastTaskEnd =
      timeToMinutes(lastTask.startTime) +
      Number(lastTask.duration)

    const hours = Math.floor(lastTaskEnd / 60)
      .toString()
      .padStart(2, '0')

    const minutes = (lastTaskEnd % 60)
      .toString()
      .padStart(2, '0')

    return `${hours}:${minutes}`
  }

  useEffect(() => {
    if (editingTask) {
      setFormData(editingTask)
      return
    }

    const day = selectedDay || 'monday'

    setFormData({
      ...initialForm,
      day,
      startTime: getDefaultStartTimeForDay(day, tasks),
    })
  }, [editingTask, selectedDay, tasks])

  const maxAvailableDuration = useMemo(() => {

    const startMinutes =
      timeToMinutes(formData.startTime)

    const nextTask = tasks
      .filter((task) => {

        if (task.day !== formData.day) {
          return false
        }

        if (
          editingTask &&
          task.id === editingTask.id
        ) {
          return false
        }

        return (
          timeToMinutes(task.startTime) >
          startMinutes
        )
      })
      .sort(
        (a, b) =>
          timeToMinutes(a.startTime) -
          timeToMinutes(b.startTime)
      )[0]

    const nextLimit = nextTask
      ? timeToMinutes(nextTask.startTime)
      : 24 * 60

    return Math.max(
      1,
      nextLimit - startMinutes
    )

  }, [
    formData.day,
    formData.startTime,
    tasks,
    editingTask,
  ])

  function updateField(field, value) {

    if (field === 'duration') {

      const safeDuration = Math.min(
        Number(value),
        maxAvailableDuration
      )

      setFormData((currentForm) => ({
        ...currentForm,
        duration: safeDuration,
      }))

      return
    }

    setFormData((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }
  function getTaskConflictMessage() {
    const startMinutes = timeToMinutes(formData.startTime)
    const duration = Number(formData.duration)
    const endMinutes = startMinutes + duration

    if (!formData.title.trim()) {
      return 'Le titre de la tâche est obligatoire.'
    }

    if (!formData.startTime) {
      return 'L’heure de début est obligatoire.'
    }

    if (!duration || duration <= 0) {
      return 'La durée doit être supérieure à 0 minute.'
    }

    if (endMinutes > 24 * 60) {
      return 'La tâche dépasse la fin de la journée.'
    }

    const sameDayTasks = tasks.filter((task) => {
      if (task.day !== formData.day) return false
      if (editingTask && task.id === editingTask.id) return false
      return true
    })

    const nextTask = sameDayTasks
      .filter((task) => timeToMinutes(task.startTime) > startMinutes)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))[0]

    if (nextTask) {
      const nextTaskStart = timeToMinutes(nextTask.startTime)

      if (endMinutes > nextTaskStart) {
        return `Temps insuffisant : une activité commence déjà à ${nextTask.startTime}. Réduis la durée ou choisis une autre heure.`
      }
    }

    const overlappingTask = sameDayTasks.find((task) => {
      const taskStart = timeToMinutes(task.startTime)
      const taskEnd = taskStart + Number(task.duration)

      return startMinutes < taskEnd && endMinutes > taskStart
    })

    if (overlappingTask) {
      return `Conflit d’horaire : cette tâche chevauche déjà "${overlappingTask.title}".`
    }

    if (duration > maxAvailableDuration) {
      return `Durée trop longue : il reste seulement ${maxAvailableDuration} min disponibles à partir de ${formData.startTime}.`
    }

    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const conflictMessage = getTaskConflictMessage()

    if (conflictMessage) {
      setLocalError(conflictMessage)
      return
    }

    const isSaved = await onSubmit(formData)

    if (isSaved) {
      onClose()
    }
  }

  return (
    <Modal
      title={
        editingTask
          ? 'Modifier la tâche'
          : 'Ajouter une tâche'
      }
      onClose={onClose}
    >

      <form
        className="task-form"
        onSubmit={handleSubmit}
      >

        <label>
          <span>Titre</span>

          <input
            type="text"
            value={formData.title}
            onChange={(event) =>
              updateField(
                'title',
                event.target.value
              )
            }
            placeholder="Ex: Réviser React"
            required
          />
        </label>

        <label>
          <span>Description</span>

          <textarea
            value={formData.description}
            onChange={(event) =>
              updateField(
                'description',
                event.target.value
              )
            }
            placeholder="Détails de la tâche"
            rows="3"
          />
        </label>

        <div className="task-form__row">

          <label>

            <span>Jour</span>

            <select
              value={formData.day}
              onChange={(event) =>
                updateField(
                  'day',
                  event.target.value
                )
              }
            >

              {WEEK_DAYS.map((day) => (
                <option
                  key={day.key}
                  value={day.key}
                >
                  {day.label}
                </option>
              ))}

            </select>

          </label>

          <label>

            <span>Priorité</span>

            <select
              value={formData.priority}
              onChange={(event) =>
                updateField(
                  'priority',
                  event.target.value
                )
              }
            >

              {PRIORITY_OPTIONS.map(
                (priority) => (
                  <option
                    key={priority.value}
                    value={priority.value}
                  >
                    {priority.label}
                  </option>
                )
              )}

            </select>

          </label>

        </div>

        <div className="task-form__row">

          <label>

            <span>Début</span>

            <input
              type="time"
              value={formData.startTime}
              onChange={(event) =>
                updateField(
                  'startTime',
                  event.target.value
                )
              }
              required
            />

          </label>

          <label>

            <span>Durée rapide</span>

            <select
              value={
                DURATION_OPTIONS.some(
                  (option) =>
                    option.value ===
                    Number(formData.duration)
                )
                  ? formData.duration
                  : 'custom'
              }
              onChange={(event) => {

                if (
                  event.target.value ===
                  'custom'
                ) {
                  return
                }

                updateField(
                  'duration',
                  event.target.value
                )
              }}
            >

              {DURATION_OPTIONS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={
                      option.value >
                      maxAvailableDuration
                    }
                  >
                    {option.label}
                  </option>
                )
              )}

              <option value="custom">
                Personnalisé
              </option>

            </select>

          </label>

        </div>

        <label>

          <span>
            Durée personnalisée
            (minutes)
          </span>

          <input
            type="number"
            min="1"
            max={maxAvailableDuration}
            value={formData.duration}
            onChange={(event) =>
              updateField(
                'duration',
                event.target.value
              )
            }
            required
          />

          <small>
            Temps disponible :
            {' '}
            {maxAvailableDuration}
            {' '}
            min
          </small>

        </label>

        {(localError || error) && (
          <p className="task-form__error">
            {localError || error}
          </p>
        )}

        <div className="task-form__actions">

          <Button
            className="btn--secondary"
            onClick={onClose}
          >
            Annuler
          </Button>

          <Button
            className="btn--primary"
            type="submit"
          >
            Valider
          </Button>

        </div>

      </form>

    </Modal>
  )
}