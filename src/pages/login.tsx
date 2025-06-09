// // pages/login.tsx
// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { loginUser } from '../lib/api'; // '@/lib/api' ではなく相対パスに修正
// import { setToken } from '../utils/auth'; // '@/lib/auth' ではなく相対パスに修正

// const LoginPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const data = await loginUser(username, password);
//       setToken(data.access);
//       router.push('/profile'); // ログイン成功後の遷移先
//     } catch (err) {
//       console.error(err);
//       setError('ログインに失敗しました');
//     }
//   };

//   return (
//     <div>
//       <h2>ログイン</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="ユーザー名"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="パスワード"
//         />
//         <button type="submit">ログイン</button>
//       </form>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// };

// export default LoginPage;






// const handleLogin = async () => {
//   const res = await fetch("http://127.0.0.1:8000/api/token/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ username, password }),
//   });

//   if (res.ok) {
//     const data = await res.json();
//     localStorage.setItem("access_token", data.access);
//     localStorage.setItem("refresh_token", data.refresh);
//     router.push("/profile"); // ログイン後に遷移
//   } else {
//     alert("ログインに失敗しました");
//   }
// };









// import { useRouter } from "next/router"
// const router = useRouter()

// const handleLogin = async () => {
//   const res = await fetch("http://127.0.0.1:8000/api/token/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ username, password }),
//   });

//   if (res.ok) {
//     const data = await res.json();
//     localStorage.setItem("access_token", data.access);
//     localStorage.setItem("refresh_token", data.refresh);

//     // ✅ ログイン成功後にプロフィールページへリダイレクト
//     router.push("/profile");
//   } else {
//     alert("ログインに失敗しました");
//   }
// };










import { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // エラー初期化

    try {
      const res = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        router.push('/profile'); // ✅ ログイン後に遷移
      } else {
        setError('ユーザー名またはパスワードが間違っています');
      }
    } catch (err) {
      console.error('ログインエラー:', err);
      setError('サーバーに接続できませんでした');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>ログイン</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            required
          />
        </div>
        <button type="submit">ログイン</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
