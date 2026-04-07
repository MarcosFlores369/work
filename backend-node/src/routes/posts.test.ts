import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import Fastify from 'fastify'
import { postRoutes } from './posts'

vi.stubGlobal('fetch', vi.fn())

const app = Fastify()
beforeAll(async () => {
  await app.register(postRoutes)
  await app.ready()
})
beforeEach(() => vi.clearAllMocks())

// --- id validation ---

describe('GET /api/posts/:id — Zod validation', () => {
  it('returns 400 for a string id', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/posts/abc' })
    expect(res.statusCode).toBe(400)
    expect(res.json()).toMatchObject({ error: 'id must be a positive integer' })
  })

  it('returns 400 for zero', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/posts/0' })
    expect(res.statusCode).toBe(400)
  })

  it('returns 400 for a negative number', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/posts/-1' })
    expect(res.statusCode).toBe(400)
  })
})

describe('GET /api/posts/:id/comments — Zod validation', () => {
  it('returns 400 for a non-integer id', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/posts/xyz/comments' })
    expect(res.statusCode).toBe(400)
  })
})

// --- upstream behaviour ---

describe('GET /api/posts/:id', () => {
  it('returns the post for a valid id', async () => {
    const post = { id: 1, title: 'test', body: 'body', userId: 1 }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => post,
    } as Response)

    const res = await app.inject({ method: 'GET', url: '/api/posts/1' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual(post)
  })

  it('propagates 404 from upstream', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    const res = await app.inject({ method: 'GET', url: '/api/posts/9999' })
    expect(res.statusCode).toBe(404)
  })
})

describe('GET /api/posts/:id/comments', () => {
  it('returns comments for a valid id', async () => {
    const comments = [{ id: 1, postId: 1, name: 'x', email: 'x@x.com', body: 'hi' }]
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => comments,
    } as Response)

    const res = await app.inject({ method: 'GET', url: '/api/posts/1/comments' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual(comments)
  })
})
