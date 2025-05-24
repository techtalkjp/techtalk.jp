import { useState } from 'react'
import { ARTIFACT_TYPES } from '../types/artifact'
import { MESSAGE_ROLES, type Message } from '../types/message'

export const useChat = ({
  api,
  initialMessages = [],
}: {
  api: string
  initialMessages: Message[]
}) => {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: MESSAGE_ROLES.USER,
      content: input,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: MESSAGE_ROLES.ASSISTANT,
        content: `「${currentInput}」についてお答えします。`,
        createdAt: new Date(),
      }

      // Generate artifacts based on keywords
      if (
        currentInput.includes('コード') ||
        currentInput.includes('プログラム')
      ) {
        assistantMessage.content +=
          '\n\nPythonでのサンプルコードを作成しました：'
        assistantMessage.artifacts = [
          {
            id: `artifact_${Date.now()}`,
            type: ARTIFACT_TYPES.CODE,
            language: 'python',
            title: 'サンプルPythonコード',
            content: `def hello_world():
    """
    シンプルなHello World関数
    """
    print("Hello, World!")
    return "Hello, World!"

def calculate_fibonacci(n):
    """
    フィボナッチ数列を計算する関数
    """
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# メイン実行部分
if __name__ == "__main__":
    hello_world()
    
    # フィボナッチ数列の最初の10項を表示
    print("フィボナッチ数列:")
    for i in range(10):
        print(f"F({i}) = {calculate_fibonacci(i)}")`,
            createdAt: new Date(),
          },
        ]
      } else if (
        currentInput.includes('HTML') ||
        currentInput.includes('ウェブ')
      ) {
        assistantMessage.content += '\n\nモダンなHTMLページを作成しました：'
        assistantMessage.artifacts = [
          {
            id: `artifact_${Date.now()}`,
            type: ARTIFACT_TYPES.HTML,
            title: 'モダンWebページ',
            content: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>モダンWebアプリ</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            padding: 2rem;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            color: white;
            max-width: 500px;
            width: 90%;
        }
        .btn {
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            margin: 20px 10px;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(76, 175, 80, 0.4);
        }
        .card {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 15px;
            margin: 20px 0;
            border-left: 4px solid #4CAF50;
            display: none;
        }
        h1 { margin-bottom: 20px; font-size: 2.5em; }
        p { line-height: 1.6; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 モダンWebアプリ</h1>
        <p>shadcn/uiスタイルで作成されたインタラクティブなWebページです</p>
        <button class="btn" onclick="showFeatures()">機能を見る</button>
        <button class="btn" onclick="showStats()">統計を表示</button>
        <div id="content"></div>
    </div>
    
    <script>
        function showFeatures() {
            document.getElementById('content').innerHTML = 
                '<div class="card" style="display:block;"><h3>✨ 主な機能</h3><p>• レスポンシブデザイン<br>• モダンなUI/UX<br>• インタラクティブな要素<br>• アニメーション効果</p></div>';
        }
        
        function showStats() {
            document.getElementById('content').innerHTML = 
                '<div class="card" style="display:block;"><h3>📊 統計情報</h3><p>• 99% のユーザー満足度<br>• 50ms の高速レスポンス<br>• 100% モバイル対応<br>• AAA アクセシビリティ</p></div>';
        }
    </script>
</body>
</html>`,
            createdAt: new Date(),
          },
        ]
      } else if (
        currentInput.includes('文書') ||
        currentInput.includes('ドキュメント')
      ) {
        assistantMessage.content +=
          '\n\n構造化されたプロジェクト仕様書を作成しました：'
        assistantMessage.artifacts = [
          {
            id: `artifact_${Date.now()}`,
            type: ARTIFACT_TYPES.DOCUMENT,
            title: 'プロジェクト仕様書 v2.0',
            content: `# プロジェクト仕様書 v2.0

## 🎯 プロジェクト概要
最新のWeb技術を活用したモダンなアプリケーション開発プロジェクトです。

## 📋 プロジェクト目標
- **ユーザビリティ**: 直感的で使いやすいインターフェース
- **パフォーマンス**: 高速で応答性の良いアプリケーション  
- **スケーラビリティ**: 将来の成長に対応できる設計
- **セキュリティ**: 堅牢なセキュリティ対策

## 🛠 技術スタック

### フロントエンド
- **Framework**: React 18 + TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand / Redux Toolkit
- **Router**: React Router v6

### バックエンド  
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **API**: tRPC / GraphQL

### DevOps & Tools
- **Build Tool**: Vite / Next.js
- **Testing**: Vitest + React Testing Library
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel / AWS

## 📅 開発スケジュール

| Phase | 期間 | 主な成果物 | 担当チーム |
|-------|------|------------|------------|
| 🎨 設計 | 2週間 | UI/UX設計、API設計書 | Design Team |
| 💻 開発 | 8週間 | MVP版アプリケーション | Dev Team |
| 🧪 テスト | 3週間 | テスト完了済みアプリ | QA Team |
| 🚀 リリース | 1週間 | 本番環境デプロイ | DevOps Team |

## 🔒 セキュリティ要件
- HTTPS通信必須
- OWASP Top 10対策実装
- セキュリティヘッダー設定
- 定期的な脆弱性スキャン

## 📊 成功指標 (KPI)
- ページロード時間: < 2秒
- Core Web Vitals: すべて緑
- ユーザー満足度: > 4.5/5.0
- バグ発生率: < 0.1%

## 📝 補足事項
⚠️ **重要**: すべてのコードレビューは必須（最低2名承認）
📖 **ドキュメント**: コード変更時はドキュメントも同時更新
🔄 **アジャイル**: 2週間スプリントで進行`,
            createdAt: new Date(),
            format: 'markdown',
          },
        ]
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('API Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.currentTarget.value)
  }

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
  }
}
