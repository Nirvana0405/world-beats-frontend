import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/router";

type Message = {
  id: number;
  sender: number;
  receiver: number;
  message: string;
  is_read: boolean;
  timestamp: string;
};

export default function DMChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      router.push("/login");
      return;
    }

    setCurrentUserId(Number(userId));
    fetchMessages(token);
  }, [router]);

  const fetchMessages = async (accessToken: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dms/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      const results = Array.isArray(data.results) ? data.results : [];
      setMessages(
        results.sort(
          (a: Message, b: Message) =>
            Date.parse(a.timestamp) - Date.parse(b.timestamp)
        )
      );
    } catch (err: unknown) {
      console.error("DM取得失敗:", err);
    }
  };

  const handleSend = async () => {
    const token = getToken();
    if (!token || !receiverId || !newMessage.trim()) {
      alert("全て入力してください");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dms/`, {
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
    } catch (err: unknown) {
      console.error("送信エラー:", err);
      alert("送信に失敗しました");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-4 border-b font-bold text-lg bg-white">
        📨 ダイレクトメッセージ
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-500">メッセージがありません</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-xs px-4 py-2 rounded-lg break-words ${
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
          ))
        )}
      </div>

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
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
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
