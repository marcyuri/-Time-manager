import { useDraggable } from '@dnd-kit/core'
import { formatDuration } from '../../utils/time'

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
  isOverlay = false,
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
  })

  const dragStyle = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,

    transition: isDragging
      ? 'none'
      : 'transform 0.12s ease',
  }

  return (
    <article
      ref={setNodeRef}
      style={dragStyle}
      className={`
        task-card
        task-card--${task.priority}
        ${
          isDragging && !isOverlay
            ? 'task-card--hidden'
            : ''
        }
        ${
          isOverlay
            ? 'task-card--overlay'
            : ''
        }
      `}
    >

      <div className="task-card__top">

        <div>

          <h3>{task.title}</h3>

          <span>
            {task.startTime}
            {' • '}
            {formatDuration(task.duration)}
          </span>

        </div>

        {!isOverlay && (

          <div
            className="task-card__drag"
            {...listeners}
            {...attributes}
          >
            ⠿
          </div>

        )}

      </div>

      {task.description && (
        <p className="task-card__description">
          {task.description}
        </p>
      )}

      {!isOverlay && (

        <div className="task-card__actions">

          <button
            onClick={() => onEdit(task)}
          >
            Modifier
          </button>

          <button
            onClick={() =>
              onToggleStatus(task.id)
            }
          >
            {task.status === 'done'
              ? 'Annuler'
              : 'Terminer'}
          </button>

          <button
            onClick={() =>
              onDelete(task.id)
            }
          >
            Supprimer
          </button>

        </div>

      )}

    </article>
  )
}