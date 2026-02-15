import { Hono } from 'hono'
import { prisma } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const posts = new Hono<{ Variables: { user: { id: number } } }>()

posts.get('/', async (c) => {
    // Simple pagination or all posts
    const posts = await prisma.post.findMany({
        include: { user: true, items: true },
        orderBy: { createdAt: 'desc' }
    })
    // Handle BigInt serialization
    const serialized = JSON.stringify(posts, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    )
    return c.json({ posts: JSON.parse(serialized) })
})

posts.post('/', authMiddleware, async (c) => {
    const { title, content } = await c.req.json()
    const user = c.get('user')

    if (!title || !content) return c.json({ error: 'Missing fields' }, 400)

    const post = await prisma.post.create({
        data: {
            title,
            content,
            userId: Number(user.id),
            likesCount: 0
        }
    })

    const serialized = JSON.stringify(post, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    )
    return c.json({ post: JSON.parse(serialized) })
})

posts.get('/:id', async (c) => {
    const id = Number(c.req.param('id'))
    const post = await prisma.post.findUnique({
        where: { id },
        include: { user: true, items: true, comments: { include: { user: true } } }
    })

    if (!post) return c.json({ error: 'Post not found' }, 404)

    const serialized = JSON.stringify(post, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    )
    return c.json({ post: JSON.parse(serialized) })
})

posts.delete('/:id', authMiddleware, async (c) => {
    const id = Number(c.req.param('id'))
    const user = c.get('user')

    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return c.json({ error: 'Post not found' }, 404)
    if (post.userId !== Number(user.id)) return c.json({ error: 'Forbidden' }, 403)

    await prisma.post.delete({ where: { id } })
    return c.json({ message: 'Deleted post' })
})

export default posts
