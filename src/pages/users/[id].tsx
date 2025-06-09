import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

type Profile = {
  username: string;
  display_name: string;
  bio: string;
  favorite_genres: string[];
  favorite_artists: string;
  icon?: string;
};

export default function PublicProfilePage() {
  const router = useRouter();
  const { userId } = router.query;
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (typeof userId !== "string") return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/public-profile/${userId}/`)
      .then((res) => res.json())
      .then(setProfile)
      .catch((err: unknown) => {
        if (err instanceof Error) {
          console.error("プロフィール取得エラー:", err.message);
        } else {
          console.error("プロフィール取得エラー:", err);
        }
      });
  }, [userId]);

  if (!profile) return <p>読み込み中...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{profile.display_name}</h1>
      <p>ユーザー名: {profile.username}</p>
      <p>自己紹介: {profile.bio}</p>
      <p>好きなジャンル: {profile.favorite_genres.join(", ")}</p>
      <p>好きなアーティスト: {profile.favorite_artists}</p>
      {profile.icon && (
        <Image
          src={profile.icon.startsWith("http") ? profile.icon : `http://localhost:8000${profile.icon}`}
          alt="プロフィール画像"
          width={96}
          height={96}
          className="rounded-full mt-2"
        />
      )}
    </div>
  );
}
