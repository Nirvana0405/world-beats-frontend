import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';

type Track = {
  id: number;
  title: string;
  artist: string;
  audio_file: string;
  uploaded_by: string;
  like_count: number;
};

type Comment = {
  id: number;
  user: string;
  text: string;
  created_at: string;
};

export default function TrackDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [track, setTrack] = useState<Track | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAccessToken(localStorage.getItem('access_token'));
    }
  }, []);

  const handlePlay = async () => {
    if (!accessToken || !id) return;
    try {
      await fetch(`${API_BASE}/tracks/history/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ track: id }),
      });
    } catch (err) {
      console.error('再生履歴の保存に失敗', err);
    }
  };

  const handleLikeToggle = async () => {
    if (!accessToken || !id) return;
    const res = await fetch(`${API_BASE}/tracks/${id}/like/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.ok) {
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    }
  };

  const fetchComments = useCallback(async () => {
    if (!id || !API_BASE) return;
    try {
      const res = await fetch(`${API_BASE}/tracks/comments/?track_id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('コメント取得エラー:', err);
    }
  }, [id, API_BASE]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !accessToken || !id) return;
    const res = await fetch(`${API_BASE}/tracks/comments/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ track: id, text: newComment }),
    });

    if (res.ok) {
      setNewComment('');
      fetchComments();
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    const confirmed = window.confirm('このコメントを削除しますか？');
    if (!confirmed || !accessToken) return;

    const res = await fetch(`${API_BASE}/tracks/comments/${commentId}/delete/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.ok) {
      fetchComments();
    }
  };

  useEffect(() => {
    if (!id || !API_BASE) return;
    fetch(`${API_BASE}/tracks/${id}/`)
      .then((res) => res.ok && res.json())
      .then((data) => {
        if (data) {
          setTrack(data);
          setLikeCount(data.like_count);
        }
      });
  }, [id, API_BASE]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    if (!accessToken || !API_BASE) return;
    fetch(`${API_BASE}/accounts/profile/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.ok && res.json())
      .then((data) => data && setCurrentUsername(data.username));
  }, [accessToken, API_BASE]);

  if (!track) return <div className="p-4">読み込み中...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{track.title}</h1>
      <p className="text-gray-600">🎤 アーティスト: {track.artist}</p>
      <p className="text-gray-600">👤 投稿者: {track.uploaded_by}</p>

      <div className="mt-4 mb-2">
        <button onClick={handleLikeToggle} className="text-red-500 hover:underline">
          {liked ? '💔 いいね解除' : '❤️ いいね'}
        </button>
        <span className="ml-2">♥ {likeCount}</span>
      </div>

      <audio controls src={track.audio_file} onPlay={handlePlay} className="w-full mt-2" />

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">💬 コメント一覧</h2>
      <ul className="space-y-2">
        {comments.map((c) => (
          <li key={c.id} className="bg-gray-100 p-3 rounded">
            <strong>{c.user}</strong>: {c.text}
            <small className="text-gray-600 block">
              {new Date(c.created_at).toLocaleString()}
            </small>
            {c.user === currentUsername && (
              <button
                onClick={() => handleCommentDelete(c.id)}
                className="text-sm text-red-600 hover:underline"
              >
                削除
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <h3 className="font-bold mb-2">✍ コメントを投稿</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="w-full border p-2 rounded mb-2"
        />
        <button
          onClick={handleCommentSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          投稿する
        </button>
      </div>
    </div>
  );
}
