import { WEEK_DAYS } from '../../data/weekDays'
import { DayColumn } from './DayColumn'

export function WeekCalendar({ calendarRef, tasks, onAddTask, onEditTask, onDeleteTask, onToggleStatus }) {
  return (
    <main className="week-calendar" ref={calendarRef}>
      <div className="week-calendar__title">
        <span>Planning</span>
        <h2>Tableau de la semaine</h2>
      </div>

      <div className="week-calendar__grid">
        {WEEK_DAYS.map((day) => (
          <DayColumn
            key={day.key}
            day={day}
            tasks={tasks}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </div>
    </main>
  )
}
