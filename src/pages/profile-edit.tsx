import { useEffect, useState, ChangeEvent, FormEvent, FC } from "react";
import { useRouter } from "next/router";
import { logoutUser } from "@/lib/auth";

type Profile = {
  display_name: string;
  bio: string;
  favorite_genres: string[];
  favorite_artists: string;
};

const getToken = (): string | null => localStorage.getItem("access_token");

const handleError = (err: unknown): string => {
  if (err instanceof Error) return err.message || "サーバーエラーが発生しました";
  return "サーバーエラーが発生しました";
};

const ProfileEditPage: FC = () => {
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

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/profile/`, {
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
      .catch((err) => setError("❌ " + handleError(err)))
      .finally(() => setLoading(false));
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    const updatedData = {
      ...profile,
      favorite_genres: genreInput.split(",").map((g) => g.trim()),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const data = await res.json();
        const firstError = (data as Record<string, string[]>)[Object.keys(data)[0]]?.[0];
        throw new Error(firstError || "更新に失敗しました");
      }

      setMessage("✅ プロフィールを更新しました！");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err) {
      setError("❌ " + handleError(err));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIconFile(file);
  };

  const handleImageUpload = async () => {
    if (!iconFile) {
      setError("画像ファイルを選択してください");
      return;
    }

    const token = getToken();
    if (!token) return;

    const formData = new FormData();
    formData.append("icon", iconFile);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/profile-detail/`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        const firstError = (data as Record<string, string[]>)[Object.keys(data)[0]]?.[0];
        throw new Error(firstError || "アップロードに失敗しました");
      }

      setMessage("✅ プロフィール画像をアップロードしました！");
    } catch (err) {
      setError("❌ " + handleError(err));
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("本当に退会しますか？この操作は元に戻せません。")) return;
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/deactivate/`, {
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
      setError("❌ " + handleError(err));
    }
  };

  if (loading) return <p className="p-6">読み込み中...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">プロフィール編集</h1>
      {message && <Alert type="success" text={message} />}
      {error && <Alert type="error" text={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="表示名" name="display_name" value={profile.display_name} onChange={handleChange} />
        <Textarea label="自己紹介" name="bio" value={profile.bio} onChange={handleChange} />
        <Input
          label="好きなジャンル（カンマ区切り）"
          value={genreInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setGenreInput(e.target.value)}
        />
        <Input label="好きなアーティスト" name="favorite_artists" value={profile.favorite_artists} onChange={handleChange} />
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
          保存する
        </button>
      </form>

      <Section title="プロフィール画像">
        <input
          type="file"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e)}
          className="mb-2"
        />
        <button onClick={handleImageUpload} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          画像をアップロード
        </button>
      </Section>

      <Section>
        <button onClick={handleDeactivate} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          アカウントを削除する
        </button>
      </Section>
    </div>
  );
};

export default ProfileEditPage;

// 共通UIコンポーネント
const Input: FC<{ label: string; name?: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void }> = ({
  label,
  name,
  value,
  onChange,
}) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} className="w-full border p-2 rounded" />
  </div>
);

const Textarea: FC<{ label: string; name: string; value: string; onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }> = ({
  label,
  name,
  value,
  onChange,
}) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <textarea name={name} value={value} onChange={onChange} className="w-full border p-2 rounded" />
  </div>
);

const Section: FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-6 border-t pt-4">
    {title && <h2 className="font-bold mb-2">{title}</h2>}
    {children}
  </div>
);

const Alert: FC<{ type: "success" | "error"; text: string }> = ({ type, text }) => (
  <div className={`p-2 rounded mb-4 ${type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
    {text}
  </div>
);
