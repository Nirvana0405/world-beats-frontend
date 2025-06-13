// src/pages/activate/[token].tsx

import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Status = "loading" | "success" | "error" | "already";

export default function ActivatePage() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<Status>("loading");

  const activateAccount = useCallback(async (tokenStr: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/activate/${tokenStr}/`,
        { method: "GET" }
      );

      const text = await res.text();

      if (res.ok) {
        if (text.includes("すでに有効化済み")) {
          setStatus("already");
        } else if (text.includes("✅") || text.includes("有効化されました")) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Activation error:", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (typeof token === "string") {
      activateAccount(token);
    }
  }, [token, activateAccount]);

  const renderMessage = () => {
    switch (status) {
      case "loading":
        return <p>🔄 アカウントを有効化しています...</p>;
      case "success":
        return (
          <>
            <h2>✅ アカウントが有効化されました！</h2>
            <p><Link href="/login">ログインはこちら</Link></p>
          </>
        );
      case "already":
        return (
          <>
            <h2>⚠️ このアカウントはすでに有効化されています。</h2>
            <p><Link href="/login">ログインはこちら</Link></p>
          </>
        );
      case "error":
        return <p>❌ 有効化に失敗しました。リンクが無効か、有効期限が切れています。</p>;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {renderMessage()}
    </div>
  );
}
