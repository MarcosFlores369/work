import Fastify from 'fastify'
import { userRoutes } from './routes/users'
import { postRoutes } from './routes/posts'

const server = Fastify({ logger: true })

server.register(userRoutes)
server.register(postRoutes)

server.listen({ port: 3001, host: '0.0.0.0' }, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
