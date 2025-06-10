import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image"; // ✅ 追加

type Thread = {
  user_id: number;
  username: string;
  icon_url?: string; // プロフィール画像（任意）
  last_message: string;
  timestamp: string;
  unread_count: number;
};

export default function DMThreadsPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:8000/api/dms/threads/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("DM取得失敗");
        return res.json();
      })
      .then((data) => setThreads(data))
      .catch((err) => console.error("DM一覧取得エラー:", err));
  }, [router]); // ✅ router を依存に追加

  const handleThreadClick = (userId: number) => {
    router.push(`/dms/${userId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📬 メッセージ一覧</h1>

      {threads.length === 0 ? (
        <p className="text-gray-500">メッセージ履歴はまだありません。</p>
      ) : (
        <ul className="space-y-3">
          {threads.map((t) => (
            <li
              key={t.user_id}
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => handleThreadClick(t.user_id)}
            >
              {t.icon_url ? (
                <Image
                  src={t.icon_url}
                  alt="icon"
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-white">
                  {t.username[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="font-semibold">{t.username}</div>
                <div className="text-sm text-gray-600 truncate">
                  {t.last_message}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(t.timestamp).toLocaleString()}
                </div>
              </div>
              {t.unread_count > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {t.unread_count}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
