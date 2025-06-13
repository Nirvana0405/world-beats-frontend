// /src/pages/activate/[token].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ActivatePage() {
  const router = useRouter();
  const { token } = router.query;

  const [message, setMessage] = useState("アカウントを有効化しています...");
  const [error, setError] = useState("");

  useEffect(() => {
    const activateUser = async () => {
      if (!token || typeof token !== "string") return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/accounts/activate/${token}/`,
          {
            method: "GET",
          }
        );

        if (res.ok) {
          setMessage("✅ アカウントが有効化されました。ログインできます。");
        } else {
          const errorData = await res.json();
          setError("❌ 有効化に失敗しました: " + (errorData.detail || "不明なエラー"));
        }
      } catch (err) {
        console.error("アクティベーション通信エラー:", err);
        setError("❌ サーバーへの接続に失敗しました。");
      }
    };

    activateUser();
  }, [token]);

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-xl font-bold mb-4">アカウント有効化</h1>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className="text-green-600">{message}</p>
      )}
    </div>
  );
}
