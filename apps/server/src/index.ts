import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import auth from './routes/auth.js'
import posts from './routes/posts.js'
import items from './routes/items.js'

const app = new Hono()

app.use('/*', cors({
  origin: 'http://localhost:3000', // Frontend port
  credentials: true,
}))

app.route('/api/auth', auth)
app.route('/api/posts', posts)
app.route('/api/items', items)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: 4000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
