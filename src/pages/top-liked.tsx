import { useEffect, useState } from 'react'

type Track = {
  id: number
  title: string
  artist: string
  like_count: number
}

export default function TopLikedPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    fetch('http://127.0.0.1:8000/api/tracks/top-liked/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        console.log("📦 取得したデータ:", data)
        setTracks(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error("❌ データ取得失敗:", err)
        setError("データの取得に失敗しました。")
      })
  }, [])

  return (
    <div>
      <h1>人気のトラック一覧</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {tracks.length > 0 ? (
          tracks.map((track) => (
            <li key={track.id}>
              <strong>{track.title}</strong> by {track.artist} ❤️ {track.like_count} likes
            </li>
          ))
        ) : (
          !error && <li>人気トラックが見つかりません。</li>
        )}
      </ul>
    </div>
  )
}
