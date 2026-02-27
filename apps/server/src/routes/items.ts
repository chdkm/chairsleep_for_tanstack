import { Hono } from 'hono'
import { prisma } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'
import { serializeBigInt } from '../utils.js'

const items = new Hono<{ Variables: { user: { id: number } } }>()

const RAKUTEN_API_KEY = process.env.RAKUTEN_API_KEY || ''
const RAKUTEN_API_URL = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601'

interface RakutenItem {
    itemName: string
    itemPrice: number
    mediumImageUrls: { imageUrl: string }[]
    itemCode: string
    itemUrl: string
    shopName: string
}

interface RakutenResponse {
    Items: { Item: RakutenItem }[]
    count: number
    page: number
    pageCount: number
}

const searchRakuten = async (keyword?: string, itemCode?: string) => {
    const params = new URLSearchParams({
        format: 'json',
        applicationId: RAKUTEN_API_KEY,
    })
    if (keyword) params.set('keyword', keyword)
    if (itemCode) params.set('itemCode', itemCode)

    const res = await fetch(`${RAKUTEN_API_URL}?${params.toString()}`)
    if (!res.ok) {
        console.error('Rakuten API error:', res.status, await res.text())
        return []
    }

    const data = await res.json() as RakutenResponse
    return (data.Items || []).map((entry) => {
        const item = entry.Item
        return {
            name: item.itemName,
            price: item.itemPrice,
            imageUrl: item.mediumImageUrls?.[0]?.imageUrl || '',
            rakutenItemId: item.itemCode,
            itemUrl: item.itemUrl,
            shopName: item.shopName,
        }
    })
}

items.get('/search', async (c) => {
    const keyword = c.req.query('keyword')
    const itemCode = c.req.query('itemCode')
    if (!keyword && !itemCode) return c.json({ items: [] })

    const results = await searchRakuten(keyword, itemCode)
    return c.json({ items: results })
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

    return c.json({ item: serializeBigInt(item) })
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
