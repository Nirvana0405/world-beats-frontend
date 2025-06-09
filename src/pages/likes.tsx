import { useEffect, useState } from 'react';

type Track = {
  id: number;
  title: string;
  artist: string;
  audio_file: string;
};

export default function LikesPage() {
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tracks/liked/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setLikedTracks(data))
      .catch(err => console.error('エラー:', err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">💖 いいねした楽曲一覧</h1>
      {likedTracks.length === 0 ? (
        <p className="text-gray-500">まだいいねした曲がありません。</p>
      ) : (
        <div className="space-y-4">
          {likedTracks.map(track => (
            <div key={track.id} className="border p-3 rounded shadow">
              <p className="font-semibold">{track.title} - {track.artist}</p>
              <audio controls src={track.audio_file} className="w-full mt-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
