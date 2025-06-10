import { useEffect, useState } from 'react'
import Link from 'next/link'

type Track = {
  id: number
  title: string
  artist: string
  uploaded_by: string
  like_count: number
}

export default function TopLikedTracksPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tracks/top-liked/`)
        if (!res.ok) throw new Error('取得に失敗しました')
        const data = await res.json()
        setTracks(data)
      } catch (err) {
        console.error('人気トラック取得エラー:', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔥 人気のトラック一覧（Like数順）</h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : tracks.length === 0 ? (
        <p className="text-gray-500">まだ人気の曲はありません。</p>
      ) : (
        <ul className="space-y-4">
          {tracks.map((track) => (
            <li key={track.id} className="p-4 border rounded shadow">
              <Link href={`/tracks/${track.id}`} className="text-blue-600 font-semibold hover:underline">
                {track.title}
              </Link>
              <p className="text-sm text-gray-600">
                by {track.artist}（投稿者: {track.uploaded_by}）
              </p>
              <p className="text-pink-600 mt-1">♥ {track.like_count} いいね</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
