---
name: find-skills-jp
description: ユーザーが「〜をするにはどうすればいいか」「〜のためのスキルを探して」「〜ができるスキルはあるか」と尋ねたり、機能を拡張したい意図を示したりした際に、エージェントスキルの発見とインストールを支援します。インストール可能なスキルとして存在する可能性のある機能を探している場合に使用します。
---

# スキルを探す (Find Skills)

このスキルは、オープンなエージェントスキル・エコシステムからスキルを発見し、インストールするお手伝いをします。

## このスキルを使用するタイミング

ユーザーが以下の行動をとった時に使用してください：

- **具体的なタスクの質問**: 「Xをするにはどうすればいい？」といった質問に対し、解決策が既存のスキルとして存在する可能性がある場合。
- **スキルの直接リクエスト**: 「Xのためのスキルを探して」「Xができるスキルはある？」と依頼された場合。
- **専門能力の確認**: 「X（専門的な作業）はできる？」と尋ねられた場合。
- **拡張への関心**: エージェントの機能を拡張することに興味を示した場合。
- **リソース検索**: ツール、テンプレート、ワークフローを検索したい場合。
- **特定ドメインの支援**: デザイン、テスト、デプロイなどの分野で助けを求めている場合。

## Skills CLI とは？

**Skills CLI (npx skills)** は、オープンなエージェントスキル・エコシステムのためのパッケージマネージャーです。スキルは、専門知識、ワークフロー、ツールを使用してエージェントの機能を拡張するモジュール式のパッケージです。



**主なコマンド:**

- **npx skills find [query]**: キーワードでスキルを対話的に検索する。
- **npx skills add <package>**: GitHubなどのソースからスキルをインストールする。
- **npx skills check**: スキルのアップデートを確認する。
- **npx skills update**: インストール済みのすべてのスキルを更新する。

**スキルをブラウザで探す:** https://skills.sh/

---

## ユーザーがスキルを探すのを手伝う方法

### ステップ 1: ニーズを理解する
ユーザーが助けを求めたら、以下を特定します：
1. **ドメイン**: (例: React, テスト, デザイン, デプロイ)
2. **具体的なタスク**: (例: テストを書く, アニメーションを作る, PRをレビューする)
3. **スキルの有無**: それが一般的なタスクで、スキルが存在しそうかどうか。

### ステップ 2: スキルを検索する
関連するクエリで **find** コマンドを実行します。

**コマンド:**
npx skills find [query]

**実行例:**
- 「Reactアプリを速くしたい」 → **npx skills find react performance**
- 「PRのレビューを手伝って」 → **npx skills find pr review**
- 「チェンジログを作成したい」 → **npx skills find changelog**

コマンドを実行すると、以下のような結果が返されます：
`Install with npx skills add <owner/repo@skill>`

### ステップ 3: ユーザーに選択肢を提示する
関連するスキルが見つかったら、以下の内容をユーザーに伝えます：
1. スキルの名前と機能。
2. 実行すべきインストールコマンド。
3. 詳細を確認するための **skills.sh** へのリンク。

**回答例:**
> I found a skill that might help! The "vercel-react-best-practices" skill provides React and Next.js performance optimization guidelines from Vercel Engineering.
> 
> **To install it:**
> npx skills add vercel-labs/agent-skills@vercel-react-best-practices
> 
> **Learn more:** https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices

### ステップ 4: インストールを提案する
ユーザーが進めたい場合は、代わりにインストールを実行できます。

**実行コマンド:**
npx skills add <owner/repo@skill> -g -y

> ※ `-g` はグローバルインストール、 `-y` は確認プロンプトのスキップを意味します。

---

## 主要なスキルカテゴリ

検索の際は、以下のカテゴリを考慮してください。

| カテゴリ | クエリ例 |
| :--- | :--- |
| **Web開発** | react, nextjs, typescript, css, tailwind |
| **テスト** | testing, jest, playwright, e2e |
| **DevOps** | deploy, docker, kubernetes, ci-cd |
| **ドキュメント** | docs, readme, changelog, api-docs |
| **コード品質** | review, lint, refactor, best-practices |
| **デザイン** | ui, ux, design-system, accessibility |
| **生産性** | workflow, automation, git |

---

## 効果的に検索するためのヒント

1. **具体的なキーワードを使う**: 単に「testing」とするより「react testing」とする方が正確な結果が得られます。
2. **別の言葉を試す**: 「deploy」で見つからない場合は「deployment」や「ci-cd」を試してください。
3. **主要なソースを確認する**: 多くのスキルは `vercel-labs/agent-skills` や `ComposioHQ/awesome-claude-skills` から提供されています。

## スキルが見つからない場合

該当するスキルがない場合は：
1. 既存のスキルが見つからなかったことを伝える。
2. 自身の一般的な能力を使って、そのタスクを直接手伝うことを提案する。
3. ユーザー自身でスキルを作成できることを提案する（**npx skills init**）。

**回答例:**
> 「〇〇〇」に関するスキルを探しましたが、見つかりませんでした。代わりに、私が直接このタスクをお手伝いしましょうか？
> 
> もしこれが頻繁に行う作業であれば、ご自身でスキルを作成することも可能です：
> npx skills init my-〇〇〇-skill