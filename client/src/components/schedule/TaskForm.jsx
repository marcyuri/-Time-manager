import { useEffect, useState } from 'react'
import { PRIORITY_OPTIONS } from '../../data/priorities'
import { WEEK_DAYS } from '../../data/weekDays'
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

export function TaskForm({ selectedDay, editingTask, error, onSubmit, onClose }) {
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    if (editingTask) {
      setFormData(editingTask)
      return
    }

    setFormData({ ...initialForm, day: selectedDay || 'monday' })
  }, [editingTask, selectedDay])

  function updateField(field, value) {
    setFormData((currentForm) => ({ ...currentForm, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const isSaved = onSubmit(formData)
    if (isSaved) onClose()
  }

  return (
    <Modal title={editingTask ? 'Modifier la tâche' : 'Ajouter une tâche'} onClose={onClose}>
      <form className="task-form" onSubmit={handleSubmit}>
        <label>
          <span>Titre</span>
          <input
            type="text"
            value={formData.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Ex: Réviser React"
            required
          />
        </label>

        <label>
          <span>Description</span>
          <textarea
            value={formData.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Détails de la tâche"
            rows="3"
          />
        </label>

        <div className="task-form__row">
          <label>
            <span>Jour</span>
            <select value={formData.day} onChange={(event) => updateField('day', event.target.value)}>
              {WEEK_DAYS.map((day) => (
                <option key={day.key} value={day.key}>{day.label}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Priorité</span>
            <select value={formData.priority} onChange={(event) => updateField('priority', event.target.value)}>
              {PRIORITY_OPTIONS.map((priority) => (
                <option key={priority.value} value={priority.value}>{priority.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="task-form__row">
          <label>
            <span>Début</span>
            <input type="time" value={formData.startTime} onChange={(event) => updateField('startTime', event.target.value)} required />
          </label>

          <label>
            <span>Durée</span>
            <select value={formData.duration} onChange={(event) => updateField('duration', event.target.value)}>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">1h</option>
              <option value="90">1h30</option>
              <option value="120">2h</option>
              <option value="180">3h</option>
            </select>
          </label>
        </div>

        {error && <p className="task-form__error">{error}</p>}

        <div className="task-form__actions">
          <Button className="btn--secondary" onClick={onClose}>Annuler</Button>
          <Button className="btn--primary" type="submit">Enregistrer</Button>
        </div>
      </form>
    </Modal>
  )
}
