// pages/profile.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Profile = {
  display_name: string;
  bio: string;
  icon?: string;
  favorite_genres: string[];
  favorite_artists: string;
};

type Track = {
  id: number;
  title: string;
  audio_file: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, tracksRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/profile/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/tracks/my/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!profileRes.ok || !tracksRes.ok) throw new Error("取得エラー");

        const profileData = await profileRes.json();
        const tracksData = await tracksRes.json();

        setProfile(profileData);
        setTracks(tracksData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("データ取得エラー:", err.message);
        } else {
          console.error("データ取得エラー:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <p className="p-4">読み込み中...</p>;
  if (!profile) return <p className="p-4">プロフィールが見つかりません</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">マイプロフィール</h1>

      {profile.icon && (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${profile.icon}`}
          alt="プロフィール画像"
          width={120}
          className="rounded-full mb-4"
        />
      )}

      <div className="space-y-1 mb-4">
        <p><strong>表示名:</strong> {profile.display_name || "未設定"}</p>
        <p><strong>自己紹介:</strong> {profile.bio || "未設定"}</p>
        <p><strong>好きなジャンル:</strong> {profile.favorite_genres.join(", ") || "未設定"}</p>
        <p><strong>好きなアーティスト:</strong> {profile.favorite_artists || "未設定"}</p>
      </div>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => router.push("/profile-edit")}
      >
        プロフィールを編集
      </button>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">あなたのアップロード曲</h2>
      {tracks.length === 0 ? (
        <p>まだ曲が投稿されていません。</p>
      ) : (
        <ul className="space-y-3">
          {tracks.map((track) => (
            <li key={track.id}>
              <p>{track.title}</p>
              {track.audio_file ? (
                <audio controls src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${track.audio_file}`} />
              ) : (
                <p className="text-gray-500">音源がありません</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
