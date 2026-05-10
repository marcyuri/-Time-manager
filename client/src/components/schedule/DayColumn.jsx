import { sortTasksByTime } from '../../utils/time'
import { TaskCard } from './TaskCard'

export function DayColumn({ day, tasks, onAddTask, onEditTask, onDeleteTask, onToggleStatus }) {
  const dayTasks = sortTasksByTime(tasks.filter((task) => task.day === day.key))

  return (
    <section className="day-column">
      <div className="day-column__header">
        <div>
          <span>{day.shortLabel}</span>
          <h2>{day.label}</h2>
        </div>
        <strong>{dayTasks.length}</strong>
      </div>

      <button className="day-column__add" type="button" onClick={() => onAddTask(day.key)}>
        + Ajouter
      </button>

      <div className="day-column__tasks">
        {dayTasks.length > 0 ? (
          dayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleStatus={onToggleStatus}
            />
          ))
        ) : (
          <p className="day-column__empty">Aucune tâche</p>
        )}
      </div>
    </section>
  )
}
