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

// LINE OAuth
const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID || ''
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || ''
const LINE_CALLBACK_URL = process.env.LINE_CALLBACK_URL || 'http://localhost:4000/api/auth/line/callback'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

auth.get('/line', (c) => {
    const state = crypto.randomUUID()
    setCookie(c, 'line_state', state, { httpOnly: true, path: '/', maxAge: 300 })
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: LINE_CHANNEL_ID,
        redirect_uri: LINE_CALLBACK_URL,
        state,
        scope: 'profile openid email',
        bot_prompt: 'aggressive',
    })
    return c.redirect(`https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`)
})

auth.get('/line/callback', async (c) => {
    const code = c.req.query('code')
    const state = c.req.query('state')
    const savedState = getCookie(c, 'line_state')

    // Clear state cookie
    setCookie(c, 'line_state', '', { httpOnly: true, path: '/', maxAge: 0 })

    if (!code || !state || state !== savedState) {
        return c.redirect(`${FRONTEND_URL}/login?error=line_auth_failed`)
    }

    try {
        // Exchange code for access token
        const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: LINE_CALLBACK_URL,
                client_id: LINE_CHANNEL_ID,
                client_secret: LINE_CHANNEL_SECRET,
            }),
        })
        const tokenData = await tokenRes.json() as { access_token?: string }
        if (!tokenData.access_token) {
            return c.redirect(`${FRONTEND_URL}/login?error=line_token_failed`)
        }

        // Fetch LINE profile
        const profileRes = await fetch('https://api.line.me/v2/profile', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        })
        const profile = await profileRes.json() as { userId: string; displayName: string }
        if (!profile.userId) {
            return c.redirect(`${FRONTEND_URL}/login?error=line_profile_failed`)
        }

        // Find or create user via Authentication table
        const existingAuth = await prisma.authentication.findFirst({
            where: { provider: 'line', uid: profile.userId },
            include: { user: true },
        })

        let user
        if (existingAuth) {
            user = existingAuth.user
            // Update line_user_id if not set
            if (!user.lineUserId) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lineUserId: profile.userId, lineLogin: true },
                })
            }
        } else {
            // Create new user + authentication record
            user = await prisma.user.create({
                data: {
                    email: `line_${profile.userId}@line.local`,
                    name: profile.displayName,
                    lineLogin: true,
                    lineUserId: profile.userId,
                    authentications: {
                        create: {
                            provider: 'line',
                            uid: profile.userId,
                            lineUserId: profile.userId,
                        },
                    },
                },
            })
        }

        // Issue JWT and redirect to frontend
        const token = await sign({ id: user.id, email: user.email }, JWT_SECRET)
        setCookie(c, 'token', token, { httpOnly: true, path: '/' })
        return c.redirect(`${FRONTEND_URL}/line-callback`)
    } catch (e) {
        console.error('LINE auth error:', e)
        return c.redirect(`${FRONTEND_URL}/login?error=line_auth_error`)
    }
})

export default auth
