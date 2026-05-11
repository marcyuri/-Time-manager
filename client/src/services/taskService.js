const STORAGE_KEY = 'time-manager-tasks'

function getStoredTasks() {
  const storedTasks = localStorage.getItem(STORAGE_KEY)

  if (!storedTasks) {
    return []
  }

  return JSON.parse(storedTasks)
}

function saveStoredTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export async function getTasks() {
  return getStoredTasks()
}

export async function createTask(task) {
  const tasks = getStoredTasks()

  const newTask = {
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }

  saveStoredTasks([...tasks, newTask])

  return newTask
}

export async function updateTask(id, task) {
  const tasks = getStoredTasks()

  const updatedTask = {
    ...task,
    id,
    updatedAt: new Date().toISOString(),
  }

  saveStoredTasks(
    tasks.map((currentTask) =>
      currentTask.id === id
        ? updatedTask
        : currentTask
    )
  )

  return updatedTask
}

export async function removeTask(id) {
  const tasks = getStoredTasks()

  saveStoredTasks(
    tasks.filter((task) => task.id !== id)
  )

  return true
}