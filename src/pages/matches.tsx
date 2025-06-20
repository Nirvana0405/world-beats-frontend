// src/pages/matches.tsx

import { useEffect, useState } from "react";
import { getToken, isLoggedIn } from "@/lib/auth";
import { useRouter } from "next/router";

type Match = {
  id: number;
  matched_user: {
    id: number;
    display_name: string;
    bio: string;
    favorite_genres: string[];
    favorite_artists: string;
    icon?: string;
  };
  matched_at: string;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    const token = getToken();
    if (!token) return;

    const fetchMatches = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("マッチ一覧の取得に失敗");

        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error("マッチ取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">💘 マッチ一覧</h1>
      {loading ? (
        <p>読み込み中...</p>
      ) : matches.length === 0 ? (
        <p className="text-gray-500">まだマッチしていません</p>
      ) : (
        <ul className="space-y-3">
          {matches.map((m) => (
            <li key={m.id} className="p-4 border rounded bg-white shadow">
              <p className="font-semibold">{m.matched_user.display_name}</p>
              <p className="text-sm text-gray-500">{m.matched_user.bio}</p>
              <p className="text-xs text-gray-400 mt-1">
                マッチ日: {new Date(m.matched_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
