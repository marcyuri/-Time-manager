export function timeToMinutes(time) {
  if (!time) return 0
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesToTime(totalMinutes) {
  const safeMinutes = Math.max(0, totalMinutes)
  const hours = Math.floor(safeMinutes / 60) % 24
  const minutes = safeMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function getEndTime(startTime, duration) {
  return minutesToTime(timeToMinutes(startTime) + Number(duration || 0))
}

export function formatDuration(duration) {
  const value = Number(duration || 0)
  const hours = Math.floor(value / 60)
  const minutes = value % 60

  if (hours && minutes) return `${hours}h ${minutes}min`
  if (hours) return `${hours}h`
  return `${minutes}min`
}

export function sortTasksByTime(tasks) {
  return [...tasks].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
}

export function hasTaskConflict(tasks, nextTask) {
  const nextStart = timeToMinutes(nextTask.startTime)
  const nextEnd = nextStart + Number(nextTask.duration || 0)

  return tasks.some((task) => {
    if (task.id === nextTask.id || task.day !== nextTask.day) return false

    const taskStart = timeToMinutes(task.startTime)
    const taskEnd = taskStart + Number(task.duration || 0)

    return nextStart < taskEnd && nextEnd > taskStart
  })
}
