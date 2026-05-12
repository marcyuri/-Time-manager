import { WEEK_DAYS } from '../../data/weekDays'
import { DayColumn } from './DayColumn'

export function WeekCalendar({ calendarRef,planningTitle, tasks, onAddTask, onEditTask, onDeleteTask, onToggleStatus, onMoveTask }) {
  return (
    <main className="week-calendar" ref={calendarRef}>
      <div className="week-calendar__title">
        <span>Planning</span>
        <h2>{planningTitle}</h2>
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
            onMoveTask={onMoveTask}
          />
        ))}
      </div>
    </main>
  )
}
