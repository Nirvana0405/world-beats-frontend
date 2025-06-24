// ✅ login.tsx
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("ログイン失敗");

      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      router.push("/profile");
    } catch {
      setError("ユーザー名またはパスワードが間違っています。");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-red-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
        {error && <p className="text-red-200 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="ユーザー名"
            className="w-full px-4 py-2 rounded bg-black border border-red-400 text-white"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="パスワード"
            className="w-full px-4 py-2 rounded bg-black border border-red-400 text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-white text-red-800 font-bold py-2 rounded hover:bg-red-200 transition"
          >
            ログイン
          </button>
        </form>

        <p className="text-sm mt-6 text-center text-red-300">
          アカウントをお持ちでないですか？{" "}
          <Link href="/register" className="underline hover:text-white">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}

// ✅ register.tsx
// ...同様に修正して提供します（続く）
