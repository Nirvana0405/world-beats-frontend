"use client";

import { useState } from "react";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!title || !artist || !file) {
      setMessage("⚠️ タイトル、アーティスト、ファイルすべてを入力してください。");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setMessage("⚠️ トークンがありません。ログインしてください。");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("audio_file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tracks/upload/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setMessage("✅ アップロード成功！");
        setTitle("");
        setArtist("");
        setFile(null);
      } else {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          setMessage("❌ エラー: " + JSON.stringify(json));
        } catch {
          setMessage("❌ サーバーエラー:\n" + text);
        }
      }
    } catch {
      setMessage("❌ 通信エラーが発生しました。");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">🎵 音楽アップロード</h1>

      <input
        type="text"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-3 border rounded px-3 py-2 w-full"
      />

      <input
        type="text"
        placeholder="アーティスト名"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        className="mb-3 border rounded px-3 py-2 w-full"
      />

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-3 w-full"
      />

      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
      >
        アップロード
      </button>

      {message && (
        <p className="mt-4 text-sm text-red-600 whitespace-pre-wrap">{message}</p>
      )}
    </div>
  );
}
