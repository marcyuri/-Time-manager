function generateId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  )
}
const STORAGE_KEY = 'time-manager-tasks'

function getStoredTasks() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
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
    id: generateId(),
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
    tasks.map((item) =>
      item.id === id ? updatedTask : item
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