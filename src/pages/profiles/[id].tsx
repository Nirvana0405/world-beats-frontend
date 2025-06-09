"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

type Track = {
  id: number;
  title: string;
  artist: string;
  audio_file: string;
};

type Profile = {
  user_id: number;
  display_name: string;
  bio: string;
  icon?: string;
  favorite_genres: string[];
  favorite_artists: string;
  tracks: Track[];
};

export default function PublicProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/${id}/`);
        if (!res.ok) throw new Error("プロフィール取得失敗");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("読み込みエラー:", err);
        setError("プロフィールの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <p className="p-6">読み込み中...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!profile) return <p className="p-6 text-red-600">プロフィールが見つかりません。</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">{profile.display_name} さんのプロフィール</h1>

      {/* ✅ プロフィール画像 */}
      {profile.icon && (
        <div className="mb-4">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${profile.icon}`}
            alt="プロフィール画像"
            width={120}
            height={120}
            className="rounded-full object-cover"
            unoptimized
          />
          {/* Next.js の Image を使わない場合はこちら */}
          {/* <img src={`${process.env.NEXT_PUBLIC_API_URL}${profile.icon}`} alt="プロフィール画像" className="w-24 h-24 rounded-full" /> */}
        </div>
      )}

      <div className="space-y-2 mb-6">
        <p><strong>自己紹介:</strong> {profile.bio || "未記入"}</p>
        <p><strong>好きなジャンル:</strong> {profile.favorite_genres.length ? profile.favorite_genres.join(", ") : "未記入"}</p>
        <p><strong>好きなアーティスト:</strong> {profile.favorite_artists || "未記入"}</p>
      </div>

      {/* ✅ トラック一覧 */}
      <h2 className="text-xl font-semibold mb-2">🎵 投稿トラック一覧</h2>
      {profile.tracks.length === 0 ? (
        <p className="text-gray-500">このユーザーはまだトラックを投稿していません。</p>
      ) : (
        <ul className="space-y-4">
          {profile.tracks.map((track) => (
            <li key={track.id}>
              <p className="font-medium">{track.title} - {track.artist}</p>
              <audio
                controls
                src={`${process.env.NEXT_PUBLIC_API_URL}${track.audio_file}`}
                className="w-full mt-1"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
