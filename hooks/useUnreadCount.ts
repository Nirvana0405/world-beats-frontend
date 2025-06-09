// hooks/useUnreadCount.ts
import { useEffect, useState } from "react";

export const useUnreadCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const fetchCount = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/notifications/unread_count/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("取得失敗");
        const data = await res.json();
        setCount(data.unread_count);
      } catch (err) {
        console.error("未読数取得エラー:", err);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 5000); // 5秒ごとに更新

    return () => clearInterval(interval);
  }, []);

  return count;
};
