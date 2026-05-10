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

  useEffect(() => {

    if (editingTask) {
      setFormData(editingTask)
      return
    }

    setFormData({
      ...initialForm,
      day: selectedDay || 'monday',
    })

  }, [editingTask, selectedDay])

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

  async function handleSubmit(event) {

    event.preventDefault()

    const safeDuration = Math.min(
      Number(formData.duration),
      maxAvailableDuration
    )

    const isSaved = await onSubmit({
      ...formData,
      duration: safeDuration,
    })

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

        {error && (
          <p className="task-form__error">
            {error}
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
            Enregistrer
          </Button>

        </div>

      </form>

    </Modal>
  )
}