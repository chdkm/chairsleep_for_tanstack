import { Hono } from 'hono'
import { prisma } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const items = new Hono<{ Variables: { user: { id: number } } }>()

// Placeholder for Rakuten API Client
const searchRakuten = async (keyword: string) => {
    // In a real app, use Rakuten Webservice SDK or fetch logic here
    return [
        {
            name: `Sample Item matching ${keyword}`,
            price: 1000,
            imageUrl: 'https://placehold.co/200',
            rakutenItemId: 'item_123'
        }
    ]
}

items.get('/search', async (c) => {
    const keyword = c.req.query('keyword')
    if (!keyword) return c.json({ items: [] })

    const items = await searchRakuten(keyword)
    return c.json({ items })
})

items.post('/', authMiddleware, async (c) => {
    const { name, price, imageUrl, rakutenItemId, postId } = await c.req.json()
    const user = c.get('user')

    if (!postId) return c.json({ error: 'Missing fields' }, 400)

    const post = await prisma.post.findUnique({ where: { id: Number(postId) } })
    if (!post) return c.json({ error: 'Post not found' }, 404)
    if (post.userId !== Number(user.id)) return c.json({ error: 'Forbidden' }, 403)

    const item = await prisma.item.create({
        data: {
            name,
            price: Number(price),
            imageUrl,
            rakutenItemId,
            postId: Number(postId),
            userId: Number(user.id)
        }
    })

    const serialized = JSON.stringify(item, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    )
    return c.json({ item: JSON.parse(serialized) })
})

items.delete('/:id', authMiddleware, async (c) => {
    const id = Number(c.req.param('id'))
    const user = c.get('user')

    const item = await prisma.item.findUnique({ where: { id } })
    if (!item) return c.json({ error: 'Item not found' }, 404)
    if (item.userId !== Number(user.id)) return c.json({ error: 'Forbidden' }, 403)

    await prisma.item.delete({ where: { id } })
    return c.json({ message: `Deleted item ${id}` })
})

export default items
