import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

type Message = {
  id: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
  is_read: boolean;
};

export default function DMThreadPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const rawUserId = router.query.userId;
  const userId = typeof rawUserId === "string" ? Number(rawUserId) : NaN;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [myUserId, setMyUserId] = useState<number | null>(null);

  // トークン・ユーザーIDの取得（クライアントのみ）
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("access_token"));
      setMyUserId(Number(localStorage.getItem("user_id")));
    }
  }, []);

  // 共通fetch関数
  const fetchWithToken = async (url: string, options: RequestInit = {}) => {
    if (!token) throw new Error("未認証");

    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  // メッセージ取得
  const fetchMessages = async () => {
    if (!token || isNaN(userId)) return;
    try {
      const res = await fetchWithToken(`http://localhost:8000/api/dms/threads/${userId}/`);
      if (!res.ok) throw new Error(`DM取得失敗 (${res.status})`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("DM取得エラー:", err);
    }
  };

  // メッセージ送信
  const sendMessage = async () => {
    if (!newMessage.trim() || !token || isNaN(userId)) return;

    try {
      const res = await fetchWithToken(`http://localhost:8000/api/dms/direct-messages/`, {
        method: "POST",
        body: JSON.stringify({ receiver: userId, message: newMessage }),
      });

      if (!res.ok) throw new Error(`送信失敗 (${res.status})`);
      const sent = await res.json();
      setMessages((prev) => [...prev, sent]);
      setNewMessage("");
    } catch (err) {
      console.error("送信エラー:", err);
    }
  };

  // 初回・定期取得
  useEffect(() => {
    if (isNaN(userId)) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [userId, token]);

  // 未読→既読処理
  useEffect(() => {
    if (!token || isNaN(userId)) return;

    const unreadIds = messages
      .filter((msg) => msg.sender === userId && !msg.is_read)
      .map((msg) => msg.id);

    if (unreadIds.length === 0) return;

    const markAsRead = async () => {
      try {
        await Promise.all(
          unreadIds.map((id) =>
            fetchWithToken(`http://localhost:8000/api/dms/direct-messages/${id}/`, {
              method: "PATCH",
              body: JSON.stringify({ is_read: true }),
            })
          )
        );
      } catch (err) {
        console.error("既読化エラー:", err);
      }
    };

    markAsRead();
  }, [messages]);

  // スクロール処理
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">💬 チャット</h2>

      <div
        className="border rounded-lg p-4 h-96 overflow-y-auto bg-white"
        ref={scrollRef}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded-md w-fit max-w-[70%] ${
              msg.sender === myUserId
                ? "ml-auto bg-blue-100"
                : "bg-gray-200"
            }`}
          >
            <p className="text-sm">{msg.content}</p>
            <p className="text-xs text-right text-gray-500">
              {new Date(msg.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="メッセージを入力"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          送信
        </button>
      </div>
    </div>
  );
}
