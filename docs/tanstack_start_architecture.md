# TanStack Start (Router) アーキテクチャガイド

本プロジェクト（`apps/web`）ではフロントエンドのルーティングおよびパラレルデータフェッチの基盤として **TanStack Router（TanStack Start のエコシステム）** を採用しています。このドキュメントでは、本プロジェクトにおける TanStack Router の基本的な動作原理や実装パターンについて解説します。

---

## 1. ファイルベースルーティング (File-Based Routing)

TanStack Router は、`src/routes` ディレクトリ内のファイル構造を自動的に読み取り、ルートツリー（`routeTree.gen.ts`）を生成するファイルベースルーティングを採用しています。

**ディレクトリ構造の例:**
```text
src/routes/
├── __root.tsx          # 全てのルートの親となるRootレイヤー（シェル）
├── index.tsx           # `/` (ホーム画面)
├── login.tsx           # `/login` (ログイン画面)
├── signup.tsx          # `/signup` (サインアップ画面)
└── posts/
    ├── index.tsx       # `/posts` (投稿一覧画面)
    ├── new.tsx         # `/posts/new` (新規投稿画面)
    └── $id.tsx         # `/posts/:id` (投稿詳細画面、動的パラメータ)
```

- **`__root.tsx`**: 一番外側のHTMLシェルを提供する特別なファイルです。`<AuthProvider>` や全体のヘッダー/フッターを定義した `<Layout>` コンポーネントがここに配置されます。
- **動的ルーティング (`$id.tsx`)**: ファイル名に `$` を付けることで動的パスパラメータとして認識されます（例: `/posts/123`）。

---

## 2. ルートの定義とデータフェッチ (Loaders)

各ルートファイルでは `createFileRoute` を使用してルートを定義します。
コンポーネントがマウントされる「前」にデータを取得する仕組みとして **Loader（ローダー）** を使用します。これにより、クライアントサイドでのウォーターフォール（レンダリング後のデータフェッチ待ち）を防ぎます。

**実装例 (`src/routes/posts/$id.tsx`):**
```tsx
import { createFileRoute, notFound } from '@tanstack/react-router'
import { apiFetch } from '../../utils/api'

export const Route = createFileRoute('/posts/$id')({
    // (1) Loader: コンポーネント描画前に実行されるデータ取得ロジック
    loader: async ({ params }) => {
        // params には動的パスパラメータ(ここでは id) が入る
        const data = await apiFetch(`/posts/${params.id}`) as { post: Post | null }
        
        // データが存在しない場合は router の notFound() をスローする
        if (!data.post) throw notFound()
        
        return { post: data.post as Post }
    },
    
    // (2) Component: 画面のUI定義
    component: PostDetail,
})
```

---

## 3. データの消費 (Type-Safe Data Consumption)

ローダーで取得したデータは `Route.useLoaderData()` を通じて、コンポーネント内で**完全に型安全な状態**で利用できます。

```tsx
function PostDetail() {
    // loader で return したオブジェクトの型が自動推論される
    const { post } = Route.useLoaderData()

    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
        </div>
    )
}
```

---

## 4. ナビゲーションと型安全な Link コンポーネント

TanStack Router の大きな特徴は、**URLパス・クエリパラメータ・動的パスパラメータすべてがTypeScriptによって型チェックされる** 点です。存在しないURLを指定したり、必要なパラメータを渡し忘れるとコンパイルエラーになります。

**`<Link>` コンポーネントの使用例:**
```tsx
import { Link } from '@tanstack/react-router'

// ⭕️ 正しい使い方 (静的パス)
<Link to="/posts">投稿一覧</Link>

// ⭕️ 正しい使い方 (動的パス)
// 動的パスの場合、テンプレートリテラル( `/posts/${id}` ) は使わず、
// 必ず `params` プロパティを使って変数を渡します。
<Link to="/posts/$id" params={{ id: String(post.id) }}>
    {post.title}
</Link>

// ❌ エラーになる使い方 (存在しないパス)
// <Link to="/not-found-page">エラー</Link> => TypeScript エラー

// ❌ エラーになる使い方 (テンプレートリテラル直書き)
// <Link to={`/posts/${post.id}`}>エラー</Link> => TypeScript エラー
```

---

## 5. ルーターの生成と全体設定 (`src/router.tsx`)

`src/router.tsx` では `createTanStackRouter` を使用してルーターインスタンスを作成しています。

```tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  return createTanStackRouter({
    routeTree, // 自動生成されたルート定義を適用
    scrollRestoration: true, // ページ遷移時のスクロール位置復元を有効化
    defaultPreload: 'intent', // リンクホバー時などに遷移先をプリロードする設定
    defaultPreloadStaleTime: 0,
  })
}

// 型定義の拡張: これによりプロジェクト全体でルーターの型推論が効くようになる
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
```

---

## まとめ

本プロジェクトでの TanStack Router の基本的なフローは以下の通りです：

1. `src/routes/` 以下のファイル配置でURLの階層が決まる。
2. 画面遷移が発生すると、対象ルートの `loader` がバックエンドAPI (`apiFetch`) を呼び出し、必要なデータを取得する。
3. データ取得完了後、紐づけられた `component` がレンダリングされ、`Route.useLoaderData()` を使って型安全にUIを構築する。
4. 画面間の移動は、型チェックの効いた `<Link>` コンポーネントで行う。
