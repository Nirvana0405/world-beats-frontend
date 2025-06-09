// src/pages/profiles/[id].tsx
"use client";

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/${id}/`);
        if (!res.ok) throw new Error("プロフィール取得失敗");
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("読み込みエラー:", error);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) return <p>読み込み中...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{profile.display_name}</h1>
      <p>{profile.bio}</p>
      <p>好きなジャンル: {profile.favorite_genres.join(', ')}</p>
      <p>好きなアーティスト: {profile.favorite_artists}</p>

      {profile.icon && (
        <div className="my-4">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${profile.icon}`}
            alt="プロフィール画像"
            width={100}
            height={100}
          />
        </div>
      )}

      <h2 className="mt-6 text-lg font-semibold">投稿トラック</h2>
      <ul>
        {profile.tracks.map((track) => (
          <li key={track.id} className="mb-4">
            <p>{track.title} - {track.artist}</p>
            <audio controls src={`${process.env.NEXT_PUBLIC_API_URL}${track.audio_file}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
