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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("プロフィール取得エラー");

        const data: Profile[] = await res.json();
        setProfiles(data);
      } catch (err: unknown) {
        console.error("検索エラー:", err instanceof Error ? err.message : err);
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
              <Link href={`/profiles/${profile.id}`}>
                <a className="text-blue-600 font-semibold hover:underline">
                  {profile.display_name}
                </a>
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
