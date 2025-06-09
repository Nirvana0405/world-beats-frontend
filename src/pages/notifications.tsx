import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Notification = {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/notifications/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("通知の取得に失敗しました");
        const data = await res.json();
        setNotifications(data);
      } catch (_err) {
        console.error("通知取得エラー");
        alert("通知の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">🔔 通知一覧</h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">通知はありません</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-3 border rounded transition ${
                n.is_read ? "bg-white" : "bg-yellow-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{n.is_read ? "✅" : "🆕"}</span>
                <span>{n.message}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(n.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
