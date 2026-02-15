import { Hono } from 'hono'
import { prisma } from '../db.js'
import { getCookie, setCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import { hash, compare } from 'bcryptjs'

const auth = new Hono()
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

auth.post('/signup', async (c) => {
    const { email, password, name } = await c.req.json()
    if (!email || !password || !name) return c.json({ error: 'Missing fields' }, 400)

    const hashedPassword = await hash(password, 10)
    try {
        const user = await prisma.user.create({
            data: {
                email,
                cryptedPassword: hashedPassword,
                name,
                salt: 'bcrypt', // Placeholder for compatibility
            },
        })
        const token = await sign({ id: user.id, email: user.email }, JWT_SECRET)
        setCookie(c, 'token', token, { httpOnly: true, path: '/' })
        return c.json({ user: { id: user.id, email: user.email, name: user.name } })
    } catch (e) {
        return c.json({ error: 'User already exists' }, 400)
    }
})

auth.post('/login', async (c) => {
    const { email, password } = await c.req.json()
    if (!email || !password) return c.json({ error: 'Missing fields' }, 400)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.cryptedPassword) return c.json({ error: 'Invalid credentials' }, 401)

    const valid = await compare(password, user.cryptedPassword)
    if (!valid) return c.json({ error: 'Invalid credentials' }, 401)

    const token = await sign({ id: user.id, email: user.email }, JWT_SECRET)
    setCookie(c, 'token', token, { httpOnly: true, path: '/' })
    return c.json({ user: { id: user.id, email: user.email, name: user.name } })
})

auth.get('/me', async (c) => {
    const token = getCookie(c, 'token')
    if (!token) return c.json({ user: null })

    try {
        const payload = await verify(token, JWT_SECRET, 'HS256')
        const user = await prisma.user.findUnique({ where: { id: Number(payload.id) } })
        if (!user) return c.json({ user: null })
        return c.json({ user: { id: user.id, email: user.email, name: user.name } })
    } catch (e) {
        return c.json({ user: null })
    }
})

auth.post('/logout', (c) => {
    setCookie(c, 'token', '', { httpOnly: true, path: '/', maxAge: 0 })
    return c.json({ message: 'Logged out' })
})

// Line auth endpoint placeholder
auth.post('/line', (c) => {
    return c.json({ message: 'Line auth endpoint' })
})

export default auth
