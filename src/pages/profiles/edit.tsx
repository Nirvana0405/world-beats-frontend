import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getToken } from "@/lib/auth";

export default function EditProfile() {
  const [form, setForm] = useState({
    display_name: "",
    bio: "",
    favorite_genres: "",
    favorite_artists: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setForm({
          display_name: data.display_name || "",
          bio: data.bio || "",
          favorite_genres: (data.favorite_genres || []).join(", "),
          favorite_artists: data.favorite_artists || "",
        })
      );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/me/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        favorite_genres: form.favorite_genres.split(",").map((g) => g.trim()),
      }),
    });

    if (res.ok) {
      setMessage("✅ プロフィール更新成功！");
      router.push("/profile");
    } else {
      setMessage("❌ プロフィール更新に失敗しました");
    }
  };

  return (
    <div>
      <h2>プロフィール編集</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="display_name"
          value={form.display_name}
          onChange={handleChange}
          placeholder="表示名"
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="自己紹介"
        />
        <input
          name="favorite_genres"
          value={form.favorite_genres}
          onChange={handleChange}
          placeholder="好きなジャンル（カンマ区切り）"
        />
        <input
          name="favorite_artists"
          value={form.favorite_artists}
          onChange={handleChange}
          placeholder="好きなアーティスト"
        />
        <button type="submit">保存</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
