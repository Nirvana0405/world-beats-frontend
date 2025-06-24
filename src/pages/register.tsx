import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/register/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (response.ok) {
        setMessage("✅ 仮登録に成功しました。メールを確認してください。");
        setForm({ username: "", email: "", password: "" });
      } else {
        const errorData = await response.json();
        setError("エラー: " + JSON.stringify(errorData));
      }
    } catch (error) {
      setError("サーバーに接続できませんでした。");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-red-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">新規登録</h1>
        {message && <p className="text-green-200 mb-4">{message}</p>}
        {error && <p className="text-red-200 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="ユーザー名"
            className="w-full px-4 py-2 rounded bg-black border border-red-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="メールアドレス"
            className="w-full px-4 py-2 rounded bg-black border border-red-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="パスワード"
            className="w-full px-4 py-2 rounded bg-black border border-red-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-white text-red-800 font-bold py-2 rounded hover:bg-red-200 transition"
          >
            登録
          </button>
        </form>

        <p className="text-sm mt-6 text-center text-red-300">
          すでにアカウントをお持ちですか？{" "}
          <Link href="/login" className="underline hover:text-white">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
