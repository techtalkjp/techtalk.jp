import { sql } from 'kysely'
import { db } from '~/services/db.server'
import { tokenize } from './tokenize'

export const addContent = async (title: string, body: string) => {
  const tokenizedTitle = tokenize(title)
  const tokenizedBody = tokenize(body)

  return await db.transaction().execute(async (trx) => {
    const result = await trx
      .insertInto('ftsContents')
      .values({ title, body })
      .executeTakeFirstOrThrow()

    const id = Number(result.insertId)

    await sql`
      INSERT INTO fts_index (rowid, title, body)
      VALUES (${id}, ${tokenizedTitle}, ${tokenizedBody})
    `.execute(trx)

    return id
  })
}

export const deleteContent = async (id: number) => {
  await db.transaction().execute(async (trx) => {
    await sql`DELETE FROM fts_index WHERE rowid = ${id}`.execute(trx)
    await trx.deleteFrom('ftsContents').where('id', '=', id).execute()
  })
}

export const seedSampleData = async () => {
  const samples = [
    {
      title: 'React Server Components の仕組み',
      body: 'React Server Components はサーバー側でレンダリングされるコンポーネントです。クライアントに JavaScript を送信せず、HTML として結果を返します。データベースへの直接アクセスやファイルシステムの読み取りが可能で、バンドルサイズの削減に貢献します。',
    },
    {
      title: 'Cloudflare Workers で始めるエッジコンピューティング',
      body: 'Cloudflare Workers はエッジで動作するサーバーレスプラットフォームです。V8 エンジン上で JavaScript や TypeScript を実行でき、世界中のデータセンターでコードが実行されるため低レイテンシを実現します。D1 データベースや R2 ストレージとの連携も強力です。',
    },
    {
      title: 'TypeScript の型システムを活用した堅牢な設計',
      body: 'TypeScript の型システムは単なるエラー検出を超え、ドメインモデルの表現や API の契約として機能します。Discriminated Union やテンプレートリテラル型、条件型を組み合わせることで、実行時エラーをコンパイル時に防ぐことができます。',
    },
    {
      title: 'Tailwind CSS v4 の新機能まとめ',
      body: 'Tailwind CSS v4 では CSS ベースの設定が導入され、tailwind.config.js が不要になりました。新しい Oxide エンジンにより、ビルド速度が大幅に向上。CSS カスタムプロパティとの統合が強化され、より柔軟なテーマ設定が可能です。',
    },
    {
      title: 'SQLite の全文検索 FTS5 入門',
      body: 'SQLite の FTS5 モジュールは高速な全文検索を提供します。仮想テーブルとして作成され、MATCH 演算子でクエリを実行します。BM25 ランキングにより関連性の高い結果を返すことができ、プレフィックスクエリやフレーズ検索にも対応しています。',
    },
    // --- 以下、表記揺れで検索がうまくいかないケースを含むデータ ---
    {
      title: 'フロントエンド開発のベストプラクティス 2026年版',
      body: 'フロントエンド開発においてベストプラクティスを守ることは重要です。パフォーマンス最適化、アクセシビリティ対応、セキュリティ対策など、多岐にわたる観点を総合的に考慮する必要があります。',
    },
    {
      title: '推し活エンジニアの技術スタック',
      body: '推し活に全力を注ぐエンジニアが、推しの配信スケジュール管理アプリを個人開発した話。React Native と Supabase で爆速開発しました。',
    },
    {
      title: 'Web API インターフェース設計の原則',
      body: 'RESTful なインターフェース設計では、リソース指向のURL設計とHTTPメソッドの適切な使い分けが重要です。OpenAPI仕様に準拠したドキュメント生成やバリデーションの自動化により、開発効率が大幅に向上します。',
    },
    {
      title: 'CSS カスタムプロパティ活用ガイド',
      body: 'CSS カスタムプロパティ（CSS変数）を活用することで、テーマの切り替えやレスポンシブデザインの管理が容易になります。JavaScript からプロパティを動的に変更することも可能です。',
    },
    {
      title: 'WebAssembly で高速メモリ管理',
      body: 'WebAssembly の線形メモリモデルを活用した高速なメモリ管理手法を解説します。Rust や C++ から Wasm へのコンパイル時に、メモリアロケータの選択がパフォーマンスに大きく影響します。',
    },
  ]

  await db.transaction().execute(async (trx) => {
    for (const sample of samples) {
      const result = await trx
        .insertInto('ftsContents')
        .values(sample)
        .executeTakeFirstOrThrow()

      const id = Number(result.insertId)
      const tokenizedTitle = tokenize(sample.title)
      const tokenizedBody = tokenize(sample.body)

      await sql`
        INSERT INTO fts_index (rowid, title, body)
        VALUES (${id}, ${tokenizedTitle}, ${tokenizedBody})
      `.execute(trx)
    }
  })

  return samples.length
}
