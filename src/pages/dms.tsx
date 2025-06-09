import { useEffect, useState } from "react";

type Message = {
  id: number;
  sender: number;
  receiver: number;
  message: string;
  is_read: boolean;
  timestamp: string;
};

export default function DMChatPage() {
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState(""); // フォームから受信者ID入力

  const currentUserId = typeof window !== "undefined"
    ? Number(localStorage.getItem("user_id"))
    : 0;

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) return;
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) fetchMessages(token);
  }, [token]);

  const fetchMessages = async (accessToken: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/dms/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setMessages(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      console.error("DM取得失敗:", err);
    }
  };

  const handleSend = async () => {
    if (!token || !receiverId || !newMessage.trim()) {
      alert("全て入力してください");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/dms/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver: receiverId,
          message: newMessage,
        }),
      });

      if (!res.ok) throw new Error("送信失敗");

      const newMsg: Message = await res.json();
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    } catch (err) {
      console.error("送信エラー:", err);
      alert("送信に失敗しました");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="p-4 border-b font-bold text-lg bg-white">📨 ダイレクトメッセージ</div>

      {/* メッセージリスト */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.sender === currentUserId
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-gray-300 text-black"
            }`}
          >
            {msg.message}
            <div className="text-xs mt-1 text-right text-gray-200">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/* 入力フォーム */}
      <div className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          placeholder="受信者ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="border rounded p-2 w-28"
        />
        <input
          type="text"
          placeholder="メッセージ"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="border flex-1 rounded p-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          送信
        </button>
      </div>
    </div>
  );
}
