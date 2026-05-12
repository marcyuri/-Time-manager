import { useRef, useState } from 'react'
import { Header } from '../components/layout/Header'
import { TaskForm } from '../components/schedule/TaskForm'
import { WeekCalendar } from '../components/schedule/WeekCalendar'
import { useTasks } from '../hooks/useTasks'
import { exportNodeAsPng } from '../utils/exportSchedule'

export default function Home() {
  const calendarRef = useRef(null)
  const [planningTitle, setPlanningTitle] = useState('Tableau de la semaine')
  const [selectedDay, setSelectedDay] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const {
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
  } = useTasks()

  function openAddTask(day) {
    setSelectedDay(day)
    setEditingTask(null)
    setError('')
    setIsFormOpen(true)
  }

  function openEditTask(task) {
    setSelectedDay(task.day)
    setEditingTask(task)
    setError('')
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingTask(null)
    setSelectedDay(null)
    setError('')
  }

  return (
    <div className="app-shell">
      <Header
        taskCount={filteredTasks.length}
        planningTitle={planningTitle}
        onPlanningTitleChange={setPlanningTitle}
        priorityFilter={priorityFilter}
        onFilterChange={setPriorityFilter}
        onResetTasks={resetTasks}
        onExportImage={() =>
          exportNodeAsPng(calendarRef.current)
        }
      />

      <WeekCalendar
        calendarRef={calendarRef}
        planningTitle={planningTitle}
        tasks={filteredTasks}
        onAddTask={openAddTask}
        onEditTask={openEditTask}
        onDeleteTask={deleteTask}
        onToggleStatus={toggleTaskStatus}
        onMoveTask={moveTask}
      />

      {isFormOpen && (
        <TaskForm
          selectedDay={selectedDay}
          editingTask={editingTask}
          tasks={tasks}
          error={error}
          onSubmit={upsertTask}
          onClose={closeForm}
        />
      )}
    </div>
  )
}
