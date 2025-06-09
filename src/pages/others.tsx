import { useEffect, useState } from "react";

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
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("access_token");
    if (!stored) return;
    setToken(stored);

    fetch("http://localhost:8000/api/profiles/others/", {
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then((res) => res.json())
      .then((data) => setProfiles(data));
  }, []);

  const handleLike = async (toUserId: number) => {
    if (!token) return;
    const res = await fetch("http://localhost:8000/api/tracks/like/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ to_user: toUserId }),
    });

    if (res.ok) {
      alert("♥ Likeしました！");
    } else {
      const err = await res.json();
      alert("エラー：" + JSON.stringify(err));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🎵 ユーザー一覧（マッチ候補）</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((profile) => (
          <li key={profile.id} className="border p-4 rounded">
            {profile.icon && (
              <img src={profile.icon} alt="icon" className="w-16 h-16 rounded-full mb-2" />
            )}
            <h2 className="text-lg font-bold">{profile.display_name}</h2>
            <p>{profile.bio}</p>
            <button
              onClick={() => handleLike(profile.user)}
              className="mt-2 px-3 py-1 bg-pink-500 text-white rounded"
            >
              ♥ いいね
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
