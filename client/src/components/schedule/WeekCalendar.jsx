import {
  DndContext,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core'

import { useState } from 'react'

import { WEEK_DAYS } from '../../data/weekDays'
import { DayColumn } from './DayColumn'
import { TaskCard } from './TaskCard'

export function WeekCalendar({
  calendarRef,
  planningTitle,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  onMoveTask,
}) {

  const [activeTask, setActiveTask] =
    useState(null)

  return (
    <section
      ref={calendarRef}
      className="week-calendar"
    >

      <div className="week-calendar__title">

        <h2>{planningTitle}</h2>

        <p>
          Organise tes activités semaine par semaine.
        </p>

      </div>

      <DndContext
        collisionDetection={closestCenter}

        onDragStart={(event) => {

          const task = tasks.find(
            (item) =>
              item.id === event.active.id
          )

          setActiveTask(task || null)
        }}

        onDragEnd={(event) => {

          const { active, over } = event

          if (over) {
            onMoveTask(
              active.id,
              over.id
            )
          }

          setActiveTask(null)
        }}

        onDragCancel={() => {
          setActiveTask(null)
        }}
      >

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

        <DragOverlay>

          {activeTask ? (
            <TaskCard
              task={activeTask}
              onEdit={() => {}}
              onDelete={() => {}}
              onToggleStatus={() => {}}
              isOverlay
            />
          ) : null}

        </DragOverlay>

      </DndContext>

    </section>
  )
}