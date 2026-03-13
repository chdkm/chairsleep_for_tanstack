# Hono Web API ガイド

本プロジェクトのバックエンド（`apps/server`）では、Node.js 上で構築される軽量・高速な Web API フレームワークとして **Hono**（"炎"を意味するハワイ語）を採用しています。
このドキュメントでは、Hono の特徴や基本概念、および本プロジェクトでの具体的な実装パターンについて解説します。

---

## 1. Hono の特徴と設計思想

- **Web Standard ベース**
  - Node.js、Cloudflare Workers、Deno、Bun など、あらゆる JavaScript/TypeScript ランタイムで動作するように設計されています。
  - Web 標準の `Request` / `Response` API に準拠しているため、他の技術スタックへの移行や統合が容易です。
- **超高速・軽量**
  - 独自の構造（Trie Tree）に基づいたルーティングアルゴリズムにより、Express や Fastify と比較してもトップクラスのルーティング速度を誇ります。
- **TypeScript ファースト**
  - TypeScript で書かれており、非常に強力な型推論と型安全性を備えています。

---

## 2. Hono の基本構造と Context (`c`)

Hono では、すべてのリクエストとレスポンスの処理は **Context (`c`)** オブジェクトを中心に行われます。

Context (`c`) には以下のような機能が含まれています。
- `c.req`: リクエスト情報（ヘッダー、ボディ、パラメータ、クエリなど）の取得
- `c.json()`, `c.text()`, `c.redirect()`: レスポンスの返却
- `c.get()`, `c.set()`: 変数（ユーザー情報など）の受け渡し

### 基本的なエンドポイントの作成

`apps/server/src/index.ts` などでの一番シンプルな例です。

```typescript
import { Hono } from 'hono'

// Honoインスタンスの作成
const app = new Hono()

// GET リクエストの処理
app.get('/', (c) => {
  // c.text() でテキストを返す
  return c.text('Hello Hono!')
})

// json の返却と パラメータの取得
app.get('/api/users/:id', (c) => {
  const id = c.req.param('id') // URLパスパラメータの取得
  const page = c.req.query('page') // クエリパラメータ (?page=1) の取得
  
  return c.json({ userId: id, page })
})
```

---

## 3. ルーティングの分割

大規模なアプリケーションでは、すべてのルートを一つのファイルに書くのではなく、機能ごとにファイルを分割します。
本プロジェクトでも機能ごとにルーティングを分割し、`index.ts` で結合しています。

**例: `src/routes/posts.ts` (独立したルーターの作成)**
```typescript
import { Hono } from 'hono'

// 投稿専用のルーターを作成
const posts = new Hono()

posts.get('/', (c) => {
  return c.json({ message: '投稿一覧' })
})

posts.post('/', async (c) => {
  // リクエストボディ(JSON)の取得
  const body = await c.req.json()
  return c.json({ message: '投稿作成', data: body })
})

// エクスポートする
export default posts
```

**例: `src/index.ts` (ルーターのマウント)**
```typescript
import { Hono } from 'hono'
import posts from './routes/posts.js'

const app = new Hono()

// '/api/posts' 以下のすべてのリクエストを posts ルーターで処理する
app.route('/api/posts', posts)
```

---

## 4. ミドルウェアと型安全なカスタム変数

認証チェックやCORSなど、複数のルートにまたがる共通処理は **ミドルウェア** として実装します。
Hono の強力な機能として、ミドルウェアでセットした変数（例: ログインユーザーの情報）を、後続のハンドラで **型安全** に取り出すことができます。

### ミドルウェアの定義 (`src/middleware/auth.ts`)
```typescript
import { createMiddleware } from 'hono/factory'
import { getCookie } from 'hono/cookie'

export const authMiddleware = createMiddleware(async (c, next) => {
    // Cookie からトークンを取得
    const token = getCookie(c, 'token')
    
    if (!token) {
        return c.json({ error: 'Unauthorized' }, 401)
    }

    // トークン検証後、c.set でユーザー情報をセット
    // ※ 実際のプロジェクトでは JWT の verify などを行います
    c.set('user', { id: 123, name: 'Taro' })
    
    // 次の処理へ進む
    await next()
})
```

### ルーター側での型の定義と `c.get` の利用
ルーター作成時（`new Hono<{ ... }>()`）に変数の型を定義することで、`c.get()` 呼び出し時に補完が効くようになります。

```typescript
import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth.js'

// Variables の型を定義する
const posts = new Hono<{ Variables: { user: { id: number, name: string } } }>()

// authMiddleware を適用するルート
posts.post('/', authMiddleware, async (c) => {
    // ミドルウェアでセットした情報が完全に型付きで取得できる
    const user = c.get('user')
    
    // user.id や user.name が型推論される
    console.log(user.id) 
    
    return c.json({ message: 'Success', userId: user.id })
})
```

---

## 5. Cookie と JWT の操作

Hono は外部ライブラリに頼らずとも、標準で Cookie や JWT(JSON Web Token) の操作モジュールを提供しています。

```typescript
import { getCookie, setCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'

// Cookie のセット
setCookie(c, 'token', 'my-jwt-token', { httpOnly: true, path: '/' })

// JWT の生成と検証
const token = await sign({ id: user.id }, 'SECRET_KEY')
const payload = await verify(token, 'SECRET_KEY', 'HS256')
```

---

## まとめ (Express との違い)

Express と比較した場合、Hono には以下のような明確なメリットがあります。

1. **圧倒的なスピード**: Node.js だけでなく、Edge環境への移行も視野に入れた非常に高速な処理。
2. **Web標準への準拠**: `req` `res` といったレガシーなNode.js APIではなく、Fetch API規格ベースで作られている点。
3. **洗練された DX (Developer Experience)**: TypeScript の型推論に最適化された Context (`c`) オブジェクトやミドルウェアの変数システム。

本プロジェクトのバックエンドでは、この Hono の持つ「軽量さ」と「TypeScriptファーストな設計」を活かして、シンプルで堅牢な API を構築しています。
