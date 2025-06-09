// pages/profiles.tsx
import { useState, useEffect } from "react";
import Link from "next/link";

type Profile = {
  id: number;
  display_name: string;
  favorite_genres: string[];
  favorite_artists: string;
};

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/profiles/?q=${query}`);
        if (!res.ok) throw new Error("プロフィール取得エラー");
        const data = await res.json();
        setProfiles(data);
      } catch (err) {
        console.error("検索エラー:", err);
      }
    };

    fetchProfiles();
  }, [query]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎵 ユーザー検索</h1>

      <input
        type="text"
        placeholder="表示名、ジャンル、アーティストで検索"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded mb-6"
      />

      {profiles.length === 0 ? (
        <p className="text-gray-500">該当するユーザーが見つかりません。</p>
      ) : (
        <ul className="space-y-4">
          {profiles.map((profile) => (
            <li key={profile.id} className="p-4 border rounded shadow-sm bg-white">
              <Link
                href={`/profiles/${profile.id}`}
                className="text-blue-600 font-semibold hover:underline"
              >
                {profile.display_name}
              </Link>
              <div className="text-sm text-gray-600">
                🎧 {profile.favorite_genres.join(", ") || "未設定"}
              </div>
              <div className="text-sm text-gray-600">
                🎤 {profile.favorite_artists || "未設定"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}




// pages/profile.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Profile = {
  display_name: string;
  bio: string;
  favorite_genres: string[];
  favorite_artists: string;
  icon?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:8000/api/accounts/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <p>読み込み中...</p>;
  if (!profile) return <p>プロフィールが見つかりません</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{profile.display_name}</h1>

      {/* ✅ プロフィール画像の表示 */}
      {profile.icon && (
        <img
          src={`http://localhost:8000${profile.icon}`}
          alt="プロフィール画像"
          className="w-24 h-24 rounded-full mb-4"
        />
      )}

      <p className="mb-2">自己紹介: {profile.bio}</p>
      <p className="mb-2">好きなジャンル: {profile.favorite_genres.join(", ")}</p>
      <p className="mb-2">好きなアーティスト: {profile.favorite_artists}</p>
    </div>
  );
}
