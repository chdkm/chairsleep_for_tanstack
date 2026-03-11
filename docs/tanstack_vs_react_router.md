# TanStack Router vs React Router 比較ガイド

Reactエコシステムにおいて、ルーティングライブラリとしてデファクトスタンダードである **React Router** と、近年急速に支持を集めている **TanStack Router**。
本ドキュメントでは、両者の設計思想の違い、主な機能の比較、およびプロジェクトの要件に応じた選び方をわかりやすく解説します。

---

## 1. コンセプトと設計思想の違い

### TanStack Router
- **「型安全 (Type-Safety)」を最優先**
  - URL、パスパラメータ、クエリパラメータ（Search Params）に至るまで、TypeScriptによる完全な型チェックを提供します。
  - ルーティング定義から自動的に型が生成され、コード補完やコンパイルエラーによって実行時エラーを未然に防ぎます。
- **データフェッチングファースト**
  - Next.jsなどのメタフレームワークのように、ルーティングとデータ取得（Loaders）が密接に統合されています。
  - キャッシュやステート管理に強く、TanStack Query（旧 React Query）との相性が抜群です。

### React Router
- **「柔軟性 (Flexibility)」と「歴史的実績」**
  - React登場初期から存在する歴史の長いライブラリであり、圧倒的なシェアと豊富なコミュニティの知見があります。
  - v6 以降は Remix の設計思想を取り入れ、Loader / Action といったデータフェッチ機能が追加されましたが、後方互換性や柔軟性を重視しています。

---

## 2. 主要機能の比較

| 機能・特徴 | TanStack Router | React Router (v6) |
| :--- | :--- | :--- |
| **型安全性** | **極めて高い (100% Type-Safe)**<br>パスのタイポや引数忘れがコンパイルエラーになる。 | **部分的 / 手動**<br>パス名は文字列指定が基本。型の恩恵を受けるには手動での型定義が必要。 |
| **Search Params (Query)** | **スキーマ検証組み込み**<br>Zod等を使ってクエリの型と検証を簡単に定義できる。 | **文字列ベース**<br>`URLSearchParams` を手動でパース・型キャストする必要がある。 |
| **ファイルベースルーティング** | **標準サポート**<br>`src/routes` ディレクトリ構造から自動生成される。コードベースルーティングもハイブリッドで可能。 | **基本的にコードベースベース**<br>Remixなどのフレームワークを使わない限り、自分でコンポーネントツリーを定義する。（※今後のReact Router v7で統合予定） |
| **エコシステムとの連携** | **TanStack Query との高度な統合** | **独立性が高い**<br>特定のデータフェッチライブラリに依存しない。 |
| **学習コスト** | **やや高い**<br>TypeScriptの高度な機能（ジェネリクス等）を活用するため、型の理解が必要。 | **低い〜中程度**<br>情報が多く、段階的に学べる。 |

---

## 3. 具体的なコード比較

### 1. リンクの作成

**❌ React Router の場合**
タイポしてもエディタは気づかず、実行時 (ブラウザ上) で 404 エラーになります。
```tsx
// "posts" を "post" とタイポしてもエラーにならない
<Link to="/post/123">詳細へ</Link>
```

**✅ TanStack Router の場合**
存在しないパスや、必要なパラメータ (`id`) が欠けていると TypeScript がエラーを出します。
```tsx
import { Link } from '@tanstack/react-router'

// コンパイルエラー！ '/post' というパスは存在しない
// エラー: Type '"/post"' is not assignable to type...
// <Link to="/post">詳細へ</Link>

// 正しい書き方：自動補完が効き、推論される
<Link to="/posts/$id" params={{ id: '123' }}>
  詳細へ
</Link>
```

### 2. Search Params（クエリパラメータ）の扱い

**React Router の場合**
```tsx
const [searchParams] = useSearchParams();
// 全て文字列として扱われるため、手動で変換と型付けが必要
const page = parseInt(searchParams.get('page') || '1', 10);
const keyword = searchParams.get('keyword');
```

**TanStack Router の場合**
ルート定義で Search Params のスキーマを設定でき、コンポーネント内では完全に型付けされたオブジェクトとして直接受け取れます。
```tsx
// ルート定義側で型とデフォルト値を設定 (Zodも利用可能)
export const Route = createFileRoute('/search')({
  validateSearch: (search) => ({
    page: Number(search?.page ?? 1),
    keyword: String(search?.keyword ?? ''),
  }),
})

// コンポーネント側
const { page, keyword } = Route.useSearch()
// page は number 型、keyword は string 型として完全に推論される
```

---

## 4. どちらを選ぶべきか？

### TanStack Router を選ぶべきケース
* 中〜大規模なアプリケーションを開発する。
* **TypeScript をフル活用し、型安全性を極限まで高めたい。**
* 動的なクエリパラメータ (検索条件、ページネーション、タブ状態など) を多用する。
* すでに TanStack Query を使用しており、データフェッチ周りのUXを向上させたい。
* （※本 ChairSleep プロジェクトのように、将来的にメタフレームワーク "TanStack Start" を見据えている場合）

### React Router を選ぶべきケース
* 既存の React Router プロジェクトを保守・拡張する。
* チームメンバーが TypeScript の高度な型システムに慣れていない。
* 要件がシンプルで、ルーティングの型安全性にそこまで重きを置いていない。
* インターネット上の豊富な日本語記事やドキュメントを頼りに開発を進めたい。

---

## 5. まとめ

* **React Router** は長年の実績と柔軟性が魅力の「王道」の選択肢です。
* **TanStack Router** は、現代の開発者が求める「型安全性」と「優れたDX (開発体験)」を徹底的に追求した「次世代」の選択肢です。

本プロジェクトでは**堅牢性と開発体験の向上**を重視し、パス間違いによるバグやURLパラメータのパース処理の煩雑さを排除できる **TanStack Router** を採用しています。
