import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ActivatePage() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState('アカウントを有効化中です...');

  useEffect(() => {
    if (!token) return;

    fetch(`http://localhost:8000/api/accounts/activate/${token}/`)
      .then(res => {
        if (res.ok) {
          setMessage('✅ アカウントが有効化されました！ログインしてください。');
        } else {
          setMessage('❌ 有効化に失敗しました。リンクの有効期限が切れている可能性があります。');
        }
      })
      .catch(() => {
        setMessage('❌ サーバーへの接続に失敗しました。');
      });
  }, [token]);

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">アカウント有効化</h1>
      <p>{message}</p>
    </div>
  );
}
