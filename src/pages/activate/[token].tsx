import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link"; // ✅ 追加

type Status = "loading" | "success" | "error";

export default function ActivatePage() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token || typeof token !== "string") return;

    const activateAccount = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/accounts/activate/${token}/`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Activation error:", error);
        setStatus("error");
      }
    };

    activateAccount();
  }, [token]);

  const renderContent = () => {
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
      {renderContent()}
    </div>
  );
}
