import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">ようこそ！</h1>
        <p className="text-gray-700 mb-6">
          このサイトは <strong>音楽 × マッチングサービス</strong> です。
        </p>
        <ul className="space-y-3">
          <li>
            <Link href="/login">
              <span className="text-blue-500 hover:underline">🔐 ログイン</span>
            </Link>
          </li>
          <li>
            <Link href="/register">
              <span className="text-blue-500 hover:underline">📝 新規登録</span>
            </Link>
          </li>
          <li>
            <Link href="/tracks">
              <span className="text-blue-500 hover:underline">🎵 トラック一覧</span>
            </Link>
          </li>
          <li>
            <Link href="/upload">
              <span className="text-blue-500 hover:underline">⬆️ 音声アップロード</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
