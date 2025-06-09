import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { logoutUser } from "@/lib/auth";

type Profile = {
  display_name: string;
  bio: string;
  favorite_genres: string[];
  favorite_artists: string;
};

export default function ProfileEditPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    display_name: "",
    bio: "",
    favorite_genres: [],
    favorite_artists: "",
  });
  const [genreInput, setGenreInput] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ プロフィール取得
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
      .then((data) => {
        setProfile({
          display_name: data.display_name || "",
          bio: data.bio || "",
          favorite_genres: data.favorite_genres || [],
          favorite_artists: data.favorite_artists || "",
        });
        setGenreInput((data.favorite_genres || []).join(", "));
      })
      .finally(() => setLoading(false));
  }, [router]);

  // ✅ 入力変更
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ ジャンル更新
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const updatedData = {
      ...profile,
      favorite_genres: genreInput.split(",").map((g) => g.trim()),
    };

    try {
      const res = await fetch("http://localhost:8000/api/accounts/profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const data = await res.json();
        const firstError = Object.values(data)?.[0]?.[0] || "更新に失敗しました";
        throw new Error(firstError);
      }

      setMessage("✅ プロフィールを更新しました！");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err: any) {
      console.error("更新エラー:", err);
      setError("❌ " + (err.message || "サーバーエラーが発生しました"));
    }
  };

  // ✅ プロフィール画像選択
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIconFile(file);
  };

  // ✅ プロフィール画像アップロード
  const handleImageUpload = async () => {
    if (!iconFile) {
      setError("画像ファイルを選択してください");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const formData = new FormData();
    formData.append("icon", iconFile);

    try {
      const res = await fetch("http://localhost:8000/api/accounts/profile-detail/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        const firstError = Object.values(data)?.[0]?.[0] || "アップロードに失敗しました";
        throw new Error(firstError);
      }

      setMessage("✅ プロフィール画像をアップロードしました！");
    } catch (err: any) {
      console.error("アップロードエラー:", err);
      setError("❌ " + (err.message || "サーバーエラーが発生しました"));
    }
  };

  // ✅ 退会処理
  const handleDeactivate = async () => {
    if (!confirm("本当に退会しますか？この操作は元に戻せません。")) return;

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch("http://localhost:8000/api/accounts/deactivate/", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 204) {
        logoutUser();
        alert("退会が完了しました。ご利用ありがとうございました。");
      } else {
        setError("退会に失敗しました。");
      }
    } catch (err) {
      console.error("退会エラー:", err);
      setError("❌ サーバーエラーが発生しました。");
    }
  };

  if (loading) return <p className="p-6">読み込み中...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">プロフィール編集</h1>

      {message && <div className="bg-green-100 text-green-800 p-2 rounded mb-4">{message}</div>}
      {error && <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">表示名</label>
          <input
            type="text"
            name="display_name"
            value={profile.display_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">自己紹介</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">好きなジャンル（カンマ区切り）</label>
          <input
            type="text"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">好きなアーティスト</label>
          <input
            type="text"
            name="favorite_artists"
            value={profile.favorite_artists}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
          保存する
        </button>
      </form>

      {/* ✅ プロフィール画像アップロード */}
      <div className="mt-6 border-t pt-4">
        <h2 className="font-bold mb-2">プロフィール画像</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
        <button
          onClick={handleImageUpload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          画像をアップロード
        </button>
      </div>

      {/* ✅ 退会ボタン */}
      <div className="mt-8 border-t pt-4">
        <button
          onClick={handleDeactivate}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          アカウントを削除する
        </button>
      </div>
    </div>
  );
}
