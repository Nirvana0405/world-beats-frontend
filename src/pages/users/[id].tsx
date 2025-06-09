import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
    if (!userId) return;

    fetch(`http://localhost:8000/api/accounts/public-profile/${userId}/`)
      .then((res) => res.json())
      .then(setProfile)
      .catch((err) => {
        console.error("プロフィール取得エラー", err);
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
      {profile.icon && <img src={profile.icon} alt="プロフィール画像" className="w-24 h-24 rounded-full mt-2" />}
    </div>
  );
}
