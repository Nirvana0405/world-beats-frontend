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

  useEffect(() => {
    fetch('http://localhost:8000/api/tracks/top-liked/')
      .then((res) => res.json())
      .then((data) => setTracks(data))
  }, [])

  return (
    <div>
      <h1>🔥 人気のトラック一覧（Like数順）</h1>
      <ul>
        {tracks.map((track) => (
          <li key={track.id} style={{ marginBottom: '1em' }}>
            <Link href={`/tracks/${track.id}`}>
              <strong>{track.title}</strong>
            </Link>{' '}
            by {track.artist}（投稿者: {track.uploaded_by}）<br />
            ♥ {track.like_count} いいね
          </li>
        ))}
      </ul>
    </div>
  )
}
