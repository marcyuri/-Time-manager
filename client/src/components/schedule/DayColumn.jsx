import { useDroppable } from '@dnd-kit/core'
import { sortTasksByTime } from '../../utils/time'
import { TaskCard } from './TaskCard'

export function DayColumn({
  day,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: day.key,
  })

  const dayTasks = sortTasksByTime(
    tasks.filter((task) => task.day === day.key)
  )

  return (
    <section
      ref={setNodeRef}
      className={`day-column ${
        isOver ? 'day-column--over' : ''
      }`}
    >
      <header className="day-column__header">
        <div>
          <span>{day.label}</span>

          <h2>
            {dayTasks.length}
            {' '}
            tâche
            {dayTasks.length > 1 ? 's' : ''}
          </h2>
        </div>

        <strong>
          {dayTasks.length}
        </strong>
      </header>

      <button
        className="day-column__add"
        onClick={() => onAddTask(day.key)}
      >
        + Ajouter
      </button>

      <div className="day-column__tasks">
        {dayTasks.length === 0 ? (
          <div className="day-column__empty">
            <p>
              Aucune activité prévue.
            </p>
          </div>
        ) : (
          dayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </div>
    </section>
  )
}