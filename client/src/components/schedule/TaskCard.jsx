import { TASK_PRIORITIES } from '../../data/priorities'
import { formatDuration, getEndTime } from '../../utils/time'

export function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  const priority = TASK_PRIORITIES[task.priority] || TASK_PRIORITIES.neutral

  return (
    <article className={`task-card ${priority.className} ${task.status === 'done' ? 'task-card--done' : ''}`}>
      <div className="task-card__top">
        <span className="task-card__time">
          {task.startTime} - {getEndTime(task.startTime, task.duration)}
        </span>
        <span className="task-card__duration">{formatDuration(task.duration)}</span>
      </div>

      <h3>{task.title}</h3>
      {task.description && <p>{task.description}</p>}

      <div className="task-card__footer">
        <span className="task-card__priority">{priority.label}</span>
        <div className="task-card__actions">
          <button type="button" onClick={() => onToggleStatus(task.id)}>
            {task.status === 'done' ? 'À faire' : 'Terminer'}
          </button>
          <button type="button" onClick={() => onEdit(task)}>Modifier</button>
          <button type="button" onClick={() => onDelete(task.id)}>Suppr.</button>
        </div>
      </div>
    </article>
  )
}
