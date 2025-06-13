import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Status = "loading" | "success" | "error";

export default function ActivatePage() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<Status>("loading");

  const activateAccount = useCallback(async (tokenStr: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/activate/${encodeURIComponent(tokenStr)}/`,
        {
          method: "GET",
        }
      );
      setStatus(response.ok ? "success" : "error");
    } catch (error) {
      console.error("Activation error:", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (typeof token === "string") {
      activateAccount(decodeURIComponent(token));
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
            <p>
              <Link href="/login">ログインはこちら</Link>
            </p>
          </>
        );
      case "error":
        return (
          <p>
            ❌ 有効化に失敗しました。リンクが無効か、有効期限が切れている可能性があります。
          </p>
        );
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
