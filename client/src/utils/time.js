export function timeToMinutes(time) {
  if (!time) return 0

  const [hours, minutes] = time
    .split(':')
    .map(Number)

  return hours * 60 + minutes
}

export function minutesToTime(totalMinutes) {
  const safeMinutes = Math.max(0, Number(totalMinutes))

  const hours = Math.floor(safeMinutes / 60)
    .toString()
    .padStart(2, '0')

  const minutes = (safeMinutes % 60)
    .toString()
    .padStart(2, '0')

  return `${hours}:${minutes}`
}

export function formatDuration(minutes) {
  const totalMinutes = Number(minutes)

  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
    return '0 min'
  }

  if (totalMinutes < 60) {
    return `${totalMinutes} min`
  }

  const hours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  if (remainingMinutes === 0) {
    return `${hours}h`
  }

  return `${hours}h${remainingMinutes}`
}

export function sortTasksByTime(tasks) {
  return [...tasks].sort(
    (a, b) =>
      timeToMinutes(a.startTime) -
      timeToMinutes(b.startTime)
  )
}