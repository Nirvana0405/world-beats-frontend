import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type Track = {
  id: number
  title: string
  artist: string
  audio_file: string
  uploaded_by: string
  like_count: number
}

type Comment = {
  id: number
  user: string
  text: string
  created_at: string
}

export default function TrackDetailPage() {
  const router = useRouter()
  const { id } = router.query

  const [track, setTrack] = useState<Track | null>(null)
  const [likeCount, setLikeCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [currentUsername, setCurrentUsername] = useState<string | null>(null)

  const accessToken =
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  // 楽曲の詳細を取得 + Like数
  useEffect(() => {
    if (!id) return
    fetch(`http://localhost:8000/api/tracks/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setTrack(data)
        setLikeCount(data.like_count)
        // setLiked(data.liked) ← 将来的にサーバー側で返すならここで設定
      })
  }, [id])

  // コメント一覧を取得
  useEffect(() => {
    if (!id) return
    fetch(`http://localhost:8000/api/tracks/comments/?track_id=${id}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
  }, [id])

  // ログインユーザー名の取得
  useEffect(() => {
    if (!accessToken) return
    fetch('http://localhost:8000/api/accounts/profile/', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setCurrentUsername(data.username))
  }, [accessToken])

  // 🎧 再生履歴を保存
  const handlePlay = async () => {
    if (!accessToken) return
    try {
      await fetch('http://localhost:8000/api/tracks/history/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ track: id }),
      })
    } catch (err) {
      console.error('再生履歴の保存に失敗しました', err)
    }
  }

  // ❤️ Likeトグル
  const handleLikeToggle = async () => {
    if (!accessToken || !id) return
    const res = await fetch(`http://localhost:8000/api/tracks/${id}/like/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (res.ok) {
      setLiked((prev) => !prev)
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
    }
  }

  // コメント投稿
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return
    const res = await fetch('http://localhost:8000/api/tracks/comments/add/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ track: id, text: newComment }),
    })

    if (res.ok) {
      setNewComment('')
      const updated = await fetch(
        `http://localhost:8000/api/tracks/comments/?track_id=${id}`
      ).then((res) => res.json())
      setComments(updated)
    }
  }

  // コメント削除
  const handleCommentDelete = async (commentId: number) => {
    const confirmed = window.confirm('このコメントを削除しますか？')
    if (!confirmed) return

    const res = await fetch(
      `http://localhost:8000/api/tracks/comments/${commentId}/delete/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (res.ok) {
      const updated = await fetch(
        `http://localhost:8000/api/tracks/comments/?track_id=${id}`
      ).then((res) => res.json())
      setComments(updated)
    }
  }

  if (!track) return <div>読み込み中...</div>

  return (
    <div>
      <h1>{track.title}</h1>
      <p>アーティスト: {track.artist}</p>
      <p>投稿者: {track.uploaded_by}</p>

      {/* ❤️ Like表示 */}
      <p>
        ♥ {likeCount}{' '}
        <button onClick={handleLikeToggle}>
          {liked ? '💔 取り消す' : '❤️ いいね'}
        </button>
      </p>

      {/* 🎧 再生 */}
      <audio controls src={track.audio_file} onPlay={handlePlay} />

      <hr />
      <h2>💬 コメント一覧</h2>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <strong>{c.user}</strong>: {c.text}{' '}
            <small>({new Date(c.created_at).toLocaleString()})</small>
            {c.user === currentUsername && (
              <button
                onClick={() => handleCommentDelete(c.id)}
                style={{ marginLeft: '1em', color: 'red' }}
              >
                削除
              </button>
            )}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '1em' }}>
        <h3>コメントを投稿</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          cols={50}
        />
        <br />
        <button onClick={handleCommentSubmit}>投稿する</button>
      </div>
    </div>
  )
}
