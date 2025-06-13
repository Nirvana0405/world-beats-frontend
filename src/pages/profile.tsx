import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

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

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("プロフィール取得エラー");

        const data: Profile = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) return <p className="p-6">読み込み中...</p>;
  if (!profile) return <p className="p-6">プロフィールが見つかりません</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{profile.display_name || "未設定"}</h1>

      {profile.icon && (
        <div className="w-24 h-24 relative mb-4">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${profile.icon}`}
            alt="プロフィール画像"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
      )}

      <p className="mb-2">📝 自己紹介: {profile.bio || "未設定"}</p>
      <p className="mb-2">
        🎧 好きなジャンル:{" "}
        {profile.favorite_genres && profile.favorite_genres.length > 0
          ? profile.favorite_genres.join(", ")
          : "未設定"}
      </p>
      <p className="mb-2">🎤 好きなアーティスト: {profile.favorite_artists || "未設定"}</p>

      {/* 🔧 編集ボタン */}
      <div className="mt-6">
        <Link href="/profile/edit">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            プロフィールを編集
          </button>
        </Link>
      </div>
    </div>
  );
}
