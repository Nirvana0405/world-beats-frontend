// import { useState, FormEvent, ChangeEvent, useEffect } from "react";

// export default function RegisterPage() {
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // ✅ コンソールでAPIのURLを確認できるように（デバッグ用）
//   useEffect(() => {
//     console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
//   }, []);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/accounts/register/`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(form),
//         }
//       );

//       if (response.ok) {
//         setMessage("✅ 仮登録に成功しました。メールを確認してください。");
//         setForm({ username: "", email: "", password: "" }); // フォームリセット
//       } else {
//         const errorData = await response.json();
//         const errors = Object.values(errorData)
//           .flat()
//           .join(" / ");
//         setError("エラー: " + errors);
//       }
//     } catch (err: unknown) {
//       console.error("通信エラー:", err);
//       setError("通信エラーが発生しました。");
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto">
//       <h1 className="text-xl font-bold mb-4">📝 ユーザー登録</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1">ユーザー名</label>
//           <input
//             type="text"
//             name="username"
//             value={form.username}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1">メールアドレス</label>
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1">パスワード</label>
//           <input
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         >
//           登録
//         </button>
//       </form>

//       {message && (
//         <p className="mt-4 text-green-600 text-center font-semibold">
//           {message}
//         </p>
//       )}
//       {error && (
//         <p className="mt-4 text-red-600 text-center font-semibold">{error}</p>
//       )}
//     </div>
//   );
// }











import { useState, FormEvent } from "react";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "登録に失敗しました");
      }

      setMessage("✅ 登録に成功しました。メールを確認してください。");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-red-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">新規登録</h1>

        {message && <p className="text-green-300 mb-4">{message}</p>}
        {error && <p className="text-red-200 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="ユーザー名"
            required
            className="w-full px-4 py-2 rounded bg-black border border-red-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="メールアドレス"
            required
            className="w-full px-4 py-2 rounded bg-black border border-red-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="パスワード"
            required
            className="w-full px-4 py-2 rounded bg-black border border-red-400 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
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
          <a href="/login" className="underline hover:text-white">
            ログイン
          </a>
        </p>
      </div>
    </div>
  );
}
