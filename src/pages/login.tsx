// import { useState } from 'react';
// import { useRouter } from 'next/router';

// const LoginPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       if (res.ok) {
//         const data = await res.json();
//         localStorage.setItem('access_token', data.access);
//         localStorage.setItem('refresh_token', data.refresh);
//         router.push('/profile');
//       } else {
//         setError('ユーザー名またはパスワードが間違っています');
//       }
//     } catch (err) {
//       console.error('ログインエラー:', err);
//       setError('サーバーに接続できませんでした');
//     }
//   };

//   return (
//     <div className="p-8 max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">ログイン</h2>
//       <form onSubmit={handleLogin} className="space-y-4">
//         <div>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="ユーザー名"
//             required
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>
//         <div>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="パスワード"
//             required
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//           ログイン
//         </button>
//       </form>
//       {error && <p className="text-red-500 mt-4">{error}</p>}
//     </div>
//   );
// };

// export default LoginPage;



















import { useState, FormEvent } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    } catch (err) {
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
            ログイン
          </button>
        </form>

        <p className="text-sm mt-6 text-center text-red-300">
          アカウントをお持ちでないですか？{" "}
          <a href="/register" className="underline hover:text-white">
            新規登録
          </a>
        </p>
      </div>
    </div>
  );
}
