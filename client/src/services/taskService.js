const API_URL = '/api/tasks'

export async function getTasks() {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error('Failed to fetch tasks')
  return res.json()
}

export async function createTask(task) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  if (!res.ok) throw new Error('Failed to create task')
  return res.json()
}

export async function updateTask(id, task) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  if (!res.ok) throw new Error('Failed to update task')
  return res.json()
}

export async function removeTask(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete task')
}
