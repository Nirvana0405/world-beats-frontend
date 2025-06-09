import { useEffect, useState } from "react";

interface Track {
  id: number;
  title: string;
  artist: string;
  audio_file?: string;
}

interface Comment {
  id: number;
  user: string;
  text: string;
  track: number;
}

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tracks/")
      .then((res) => res.json())
      .then(setTracks)
      .catch((err) => console.error("トラック取得エラー:", err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/tracks/comments/");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("コメント取得エラー:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token || !currentTrack) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/tracks/comments/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          track: currentTrack.id,
          text: newComment,
        }),
      });

      if (res.ok) {
        setNewComment("");
        fetchComments();
      } else {
        console.error("コメント投稿失敗");
      }
    } catch (err) {
      console.error("投稿エラー:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎵 アップロードされた曲一覧</h1>
      <ul>
        {tracks.map((track) => (
          <li key={track.id} style={{ marginBottom: "1rem" }}>
            <strong>{track.title} - {track.artist}</strong>
            <br />
            <button onClick={() => setCurrentTrack(track)}>▶ 再生</button>
          </li>
        ))}
      </ul>

      {currentTrack && (
        <div style={{ marginTop: "2rem" }}>
          <h2>🎧 再生中: {currentTrack.title}</h2>

          {currentTrack.audio_file ? (
            <audio
              controls
              autoPlay
              src={currentTrack.audio_file}
              className="w-full mt-2"
            />
          ) : (
            <p style={{ color: 'gray' }}>オーディオファイルが存在しません。</p>
          )}

          <h3 style={{ marginTop: "1rem" }}>💬 コメント</h3>
          <ul>
            {comments
              .filter((c) => c.track === currentTrack.id)
              .map((comment) => (
                <li key={comment.id}>
                  <strong>{comment.user}:</strong> {comment.text}
                </li>
              ))}
          </ul>

          {isLoggedIn ? (
            <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="コメントを書く"
                rows={3}
                cols={50}
              />
              <br />
              <button type="submit">コメントを投稿</button>
            </form>
          ) : (
            <p style={{ color: "gray" }}>※ コメント投稿にはログインが必要です。</p>
          )}
        </div>
      )}
    </div>
  );
}
