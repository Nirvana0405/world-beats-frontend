import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/router";

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/notifications/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("通知の取得に失敗しました");
        }

        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error("通知取得エラー", error);
        setError("通知の取得に失敗しました。");
      }
    };

    fetchNotifications();
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-red-500">通知一覧</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 rounded-lg shadow-md border ${
                notification.is_read ? "border-gray-600" : "border-red-500"
              }`}
            >
              <p className="text-sm mb-1">{notification.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(notification.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
