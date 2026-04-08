import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import Fastify from 'fastify'
import { userRoutes } from './users'

vi.stubGlobal('fetch', vi.fn())

const app = Fastify()
beforeAll(async () => {
  await app.register(userRoutes)
  await app.ready()
})
beforeEach(() => vi.clearAllMocks())

// --- id validation ---

describe('GET /api/users/:id — Zod validation', () => {
  it('returns 400 for a string id', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/users/abc' })
    expect(res.statusCode).toBe(400)
    expect(res.json()).toMatchObject({ error: 'id must be a positive integer' })
  })

  it('returns 400 for zero', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/users/0' })
    expect(res.statusCode).toBe(400)
  })

  it('returns 400 for a negative number', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/users/-3' })
    expect(res.statusCode).toBe(400)
  })

  it('returns 400 for a float', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/users/1.5' })
    expect(res.statusCode).toBe(400)
  })
})

describe('GET /api/users/:id/posts — Zod validation', () => {
  it('returns 400 for a non-integer id', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/users/foo/posts' })
    expect(res.statusCode).toBe(400)
    expect(res.json()).toMatchObject({ error: 'id must be a positive integer' })
  })
})

// --- upstream behaviour ---

describe('GET /api/users', () => {
  it('returns the upstream response', async () => {
    const users = [{ id: 1, name: 'Leanne Graham' }]
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => users,
    } as Response)

    const res = await app.inject({ method: 'GET', url: '/api/users' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual(users)
  })

  it('returns 502 when upstream fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 502,
    } as Response)

    const res = await app.inject({ method: 'GET', url: '/api/users' })
    expect(res.statusCode).toBe(502)
    expect(res.json()).toMatchObject({ error: 'Upstream error' })
  })
})

describe('GET /api/users/:id', () => {
  it('returns the user for a valid id', async () => {
    const user = { id: 1, name: 'Leanne Graham', email: 'a@a.com' }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => user,
    } as Response)

    const res = await app.inject({ method: 'GET', url: '/api/users/1' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual(user)
  })

  it('propagates 404 from upstream', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    const res = await app.inject({ method: 'GET', url: '/api/users/999' })
    expect(res.statusCode).toBe(404)
  })
})
