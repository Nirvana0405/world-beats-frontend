import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* ✅ ナビゲーションバー */}
      <nav className="bg-black bg-opacity-80 backdrop-blur-md shadow-lg p-4 flex justify-between items-center border-b border-red-700 sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold tracking-widest text-red-500 hover:text-red-300 transition duration-300">
          WORLD BEATS
        </h1>
        <div className="space-x-6 text-sm font-medium">
          <NavLink href="/" label="トップ" />
          <NavLink href="/upload" label="音楽投稿" />
          <NavLink href="/profile" label="プロフィール" />
          <NavLink href="/register" label="新規登録" />
          <NavLink href="/login" label="ログイン" />
        </div>
      </nav>

      {/* ✅ メインビジュアル */}
      <header className="text-center py-20 px-6">
        <h2 className="text-5xl font-black mb-6 text-red-100 drop-shadow-lg">
          音楽でつながろう。
        </h2>
        <p className="text-xl mb-8 text-red-300">
          ミュージシャンとリスナーが出会う場所。
        </p>

        {isLoggedIn ? (
          <Link
            href="/profile"
            className="bg-white text-red-700 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-red-200 transition"
          >
            マイページへ
          </Link>
        ) : (
          <div className="flex justify-center gap-4">
            <CallToAction href="/register" label="新規登録" />
            <CallToAction href="/login" label="ログイン" />
          </div>
        )}
      </header>

      {/* ✅ サービス紹介 */}
      <section className="py-16 px-6 text-center bg-black border-t border-red-800">
        <h3 className="text-3xl font-bold mb-6 text-red-400">あなたの音楽を世界へ</h3>
        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-md mb-10">
          WORLD BEATS は、音楽を通じて仲間とつながるマッチングプラットフォームです。
          自分の音楽を投稿して、共感してくれるリスナーやコラボ相手を見つけよう。
        </p>

        {/* ✅ 画像表示（紹介文の下） */}
        <div className="flex justify-center">
          <img
            src="/people-2943124_1280.jpg"
            alt="背景画像"
            className="rounded-lg shadow-xl max-w-4xl w-full"
          />
        </div>
      </section>
    </div>
  );
}

// ✅ 共通リンクコンポーネント
const NavLink = ({ href, label }: { href: string; label: string }) => (
  <Link href={href} className="hover:text-red-300 transition duration-200">
    {label}
  </Link>
);

// ✅ Call To Action ボタン
const CallToAction = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="bg-white text-red-700 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-red-200 transition"
  >
    {label}
  </Link>
);
