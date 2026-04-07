import { FastifyInstance } from 'fastify'
import { z } from 'zod'

const idSchema = z.coerce.number().int().positive()
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'

export async function postRoutes(fastify: FastifyInstance) {
  fastify.get('/api/posts/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = idSchema.safeParse(id)
    if (!parsed.success) return reply.status(400).send({ error: 'id must be a positive integer' })
    const res = await fetch(`${PYTHON_BACKEND_URL}/posts/${parsed.data}`)
    if (!res.ok) return reply.status(res.status).send({ error: 'Upstream error' })
    return res.json()
  })

  fastify.get('/api/posts/:id/comments', async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = idSchema.safeParse(id)
    if (!parsed.success) return reply.status(400).send({ error: 'id must be a positive integer' })
    const res = await fetch(`${PYTHON_BACKEND_URL}/posts/${parsed.data}/comments`)
    if (!res.ok) return reply.status(res.status).send({ error: 'Upstream error' })
    return res.json()
  })
}
