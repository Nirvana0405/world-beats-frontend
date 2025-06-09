import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isLoggedIn } from "@/lib/auth";

const ProtectedPage = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<null | boolean>(null); // null = 判定中

  useEffect(() => {
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
    }
  }, []);

  if (authorized === null) {
    return <p className="p-4">ログイン確認中...</p>; // ローディング状態
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔐 保護されたページ</h1>
      <p>このページはログイン済みユーザーのみが閲覧できます。</p>
    </div>
  );
};

export default ProtectedPage;
