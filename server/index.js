import express from 'express'
import cors from 'cors'
import pkg from 'pg'
import dotenv from 'dotenv'


dotenv.config()

const { Pool } = pkg
const app = express()
const PORT = process.env.PORT || 5000

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('TIME API running 🚀')
})

app.get('/db', async (req, res) => {
  const result = await pool.query('SELECT NOW()')
  res.json(result.rows)
})

app.get('/tasks', async (req, res) => {
  const result = await pool.query(`
    SELECT id, title, description, day, start_time AS "startTime", duration, priority, status
    FROM tasks
    ORDER BY day, start_time
  `)

  res.json(result.rows)
})

app.post('/tasks', async (req, res) => {
  const { id, title, description = '', day, startTime, duration, priority = 'neutral', status = 'todo' } = req.body

  if (!id || !title || !day || !startTime || !duration) {
    return res.status(400).json({ message: 'Champs obligatoires manquants.' })
  }

  const result = await pool.query(
    `INSERT INTO tasks (id, title, description, day, start_time, duration, priority, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, title, description, day, start_time AS "startTime", duration, priority, status`,
    [id, title, description, day, startTime, duration, priority, status],
  )

  res.status(201).json(result.rows[0])
})

app.put('/tasks/:id', async (req, res) => {
  const { title, description = '', day, startTime, duration, priority = 'neutral', status = 'todo' } = req.body

  const result = await pool.query(
    `UPDATE tasks
     SET title = $1, description = $2, day = $3, start_time = $4, duration = $5, priority = $6, status = $7, updated_at = NOW()
     WHERE id = $8
     RETURNING id, title, description, day, start_time AS "startTime", duration, priority, status`,
    [title, description, day, startTime, duration, priority, status, req.params.id],
  )

  if (!result.rows[0]) {
    return res.status(404).json({ message: 'Tâche introuvable.' })
  }

  res.json(result.rows[0])
})

app.delete('/tasks/:id', async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id])
  res.status(204).end()
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
