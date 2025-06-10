// src/pages/others.tsx

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getToken, isLoggedIn } from "@/lib/auth";
import { useRouter } from "next/router";

type Profile = {
  id: number;
  display_name: string;
  bio: string;
  favorite_genres: string[];
  favorite_artists: string;
  icon?: string;
  user: number;
};

export default function OthersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const router = useRouter();

  const fetchProfiles = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles/others/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("プロフィールの取得に失敗しました");
      const data = await res.json();
      setProfiles(data);
    } catch (err) {
      console.error("プロフィール取得エラー:", err);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    fetchProfiles();
  }, [router, fetchProfiles]);

  const handleLike = async (toUserId: number) => {
    const token = getToken();
    if (!token) {
      alert("ログインが必要です");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tracks/like/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ to_user: toUserId }),
        }
      );

      if (res.ok) {
        alert("♥ Likeしました！");
      } else {
        const errorData = await res.json();
        alert("エラー：" + (errorData?.detail || "Likeに失敗しました"));
      }
    } catch (err) {
      console.error("Like送信エラー:", err);
      alert("ネットワークエラーが発生しました");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🎵 ユーザー一覧（マッチ候補）</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <li key={profile.id} className="border p-4 rounded shadow-md">
            {profile.icon && (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${profile.icon}`}
                alt="icon"
                width={64}
                height={64}
                className="rounded-full mb-2"
                unoptimized
              />
            )}
            <h2 className="text-lg font-semibold">{profile.display_name}</h2>
            <p className="text-sm text-gray-600">{profile.bio}</p>
            <button
              onClick={() => handleLike(profile.user)}
              className="mt-3 px-4 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition"
            >
              ♥ いいね
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
