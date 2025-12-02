import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok' })
  } catch (error) {
    console.error('Health check failed:', error)
    res.status(500).json({ status: 'error', message: 'Database connection failed' })
  }
})

app.get('/api/messages', async (_req, res, next) => {
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(messages)
  } catch (error) {
    next(error)
  }
})

app.post('/api/messages', async (req, res, next) => {
  const { content } = req.body

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ message: 'content is required' })
  }

  try {
    const message = await prisma.message.create({ data: { content } })
    res.status(201).json(message)
  } catch (error) {
    next(error)
  }
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal Server Error' })
})

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`)
})
