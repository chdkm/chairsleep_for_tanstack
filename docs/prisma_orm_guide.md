# Prisma ORM ガイド (ChairSleep プロジェクト)

本プロジェクトのバックエンド（`apps/server`）では、データベース操作のORMとして **Prisma** を採用しています。このドキュメントでは、`schema.prisma` に基づいた基本的なデータの CRUD（Create, Read, Update, Delete）操作や、リレーションの扱い方について解説します。

---

## 1. Prisma Client のインポート

データベース操作を行う際は、単一の Prisma インスタンス（Singleton）を使用します。これによりデータベース接続数が枯渇するのを防ぎます。

```typescript
// 推奨されるインポート方法 (ルーティングなどから)
import { prisma } from '../db.js'

// NGな例 (都度インスタンスを生成しない)
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
```

---

## 2. 基本的な CRUD 操作

### Create (作成)

例: 新規ユーザー(`User`)の作成

```typescript
const newUser = await prisma.user.create({
  data: {
    email: 'test@example.com',
    name: 'テストユーザー',
    cryptedPassword: 'hashed_password_here'
  }
})
```

例: ユーザーに関連づいた投稿(`Post`)を作成する（リレーションの作成）

```typescript
const newPost = await prisma.post.create({
  data: {
    title: '最高の椅子寝スタイル',
    content: '背もたれを150度倒すのがコツです。',
    userId: 1 // 既存のユーザーIDを指定
    // または connect を使用:
    // user: { connect: { id: 1 } }
  }
})
```

### Read (読み取り)

#### 単一レコードの取得 (`findUnique`, `findFirst`)

```typescript
// IDなどでユニークな検索 (findUnique)
const user = await prisma.user.findUnique({
  where: { email: 'test@example.com' }
})

// 条件に一致する最初の1件を取得 (findFirst)
const latestPost = await prisma.post.findFirst({
  where: { userId: 1 },
  orderBy: { createdAt: 'desc' }
})
```

#### 複数レコードの取得 (`findMany`) とページネーション

```typescript
// 条件に一致する全てを取得
const posts = await prisma.post.findMany({
  where: { likesCount: { gte: 10 } }, // いいね数が10以上
  orderBy: { createdAt: 'desc' },      // 最新順
  take: 20,                            // LIMIT 20
  skip: 0                              // OFFSET 0
})
```

### Update (更新)

```typescript
// 特定のIDのレコードを更新
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: { name: '新しい名前' }
})

// 条件に一致する複数のレコードを一括更新
const batchPayload = await prisma.post.updateMany({
  where: { userUid: null },
  data: { userUid: 'migrated_uid' }
})
```

### Delete (削除)

```typescript
// 特定のIDのレコードを削除
await prisma.post.delete({
  where: { id: 10 }
})

// 条件に一致する複数を削除 (一括削除)
await prisma.item.deleteMany({
  where: { postId: 10 }
})
```

---

## 3. リレーション（関連データ）の操作

`schema.prisma` では、モデル間に多数のリレーション（1対多、多対多）が定義されています。Prismaではこれらの関連データを簡単に同時に取得・操作できます。

### 関連データの同時取得 (`include`)

例: 投稿と一緒に、投稿者(`User`)、登録アイテム(`Item`)、コメント(`Comment`)とそのコメントをしたユーザーも全て取得する

```typescript
const postWithDetails = await prisma.post.findUnique({
  where: { id: 1 },
  include: {
    user: true,       // 投稿者情報を含める
    items: true,      // 登録アイテム一覧を含める
    comments: {
      include: {
        user: true    // 各コメントの作成者情報も含める
      }
    }
  }
})

// 結果の型は安全に推論されるため、 postWithDetails.user.name などにアクセス可能
```

### 関連データの絞り込み (`select`)

必要なカラムだけを取得したい場合（セキュリティ上の理由でパスワードを除外したい場合など）は `select` を使用します。
※ `include` と `select` を同じレベルで同時に使うことはできません。

```typescript
const userProfiles = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // cryptedPassword は含まれない
    posts: {
      select: { title: true, createdAt: true }
    }
  }
})
```

---

## 4. 特記事項 (ChairSleep プロジェクト固有の注意点)

### BigInt のシリアライズについて
Prismaから返却されるデータの中に、極稀に `BigInt` 型（巨大な数値）が含まれる場合があります。`JSON.stringify` はデフォルトで `BigInt` をシリアライズできないためエラーになります。
これを防ぐため、バックエンドではデータをクライアントに返す前に `serializeBigInt` ヘルパー（`apps/server/src/utils.ts`）を使用してください。

```typescript
import { serializeBigInt } from '../utils.js'

posts.get('/', async (c) => {
    const posts = await prisma.post.findMany({ include: { user: true } })
    // クライアントへ返す前に確実にJSON化できるようにする
    return c.json({ posts: serializeBigInt(posts) })
})
```

### データベース上のカラム名のマッピング (`@map`)
Prismaのスキーマ定義では、JavaScriptコード上ではキャメルケース（例: `cryptedPassword`, `lineUserId`）で扱いますが、実際のデータベースのテーブル上はスネークケース（例: `crypted_password`, `line_user_id`）に変換されるよう設定されています（`@map` および `@@map` アノテーション）。
**TypeScript上でコードを書く際は常にキャメルケースを使用してください。**
