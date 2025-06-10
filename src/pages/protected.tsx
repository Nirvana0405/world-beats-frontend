import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isLoggedIn } from "@/lib/auth";

const ProtectedPage = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true); // 判定中状態を分離

  useEffect(() => {
    const checkAuth = () => {
      try {
        const auth = isLoggedIn();
        if (!auth) {
          router.push("/login");
        } else {
          setAuthorized(true);
        }
      } catch (error) {
        console.error("認証チェック中にエラー:", error);
        router.push("/login");
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (checking) {
    return <p className="p-4">🔒 ログイン状態を確認しています...</p>;
  }

  if (!authorized) {
    return null; // 認証されてない場合は何も表示しない（push中）
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔐 保護されたページ</h1>
      <p>このページはログイン済みユーザーのみが閲覧できます。</p>
    </div>
  );
};

export default ProtectedPage;
