import { createMiddleware } from 'hono/factory'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import { JWT_SECRET } from '../utils.js'

export const authMiddleware = createMiddleware(async (c, next) => {
    const token = getCookie(c, 'token')
    if (!token) {
        return c.json({ error: 'Unauthorized' }, 401)
    }

    try {
        const payload = await verify(token, JWT_SECRET, 'HS256')
        c.set('user', payload)
        await next()
    } catch (e) {
        return c.json({ error: 'Unauthorized' }, 401)
    }
})
