// import { useState } from 'react'

// type Track = {
//   id: number
//   title: string
//   artist: string
//   like_count: number
// }

// type Props = {
//   track: Track
//   accessToken: string  // ログイン済みなら渡される
// }

// export default function TrackCard({ track, accessToken }: Props) {
//   const [likeCount, setLikeCount] = useState(track.like_count)
//   const [liked, setLiked] = useState(false)  // 本来は初期値をAPIから取得するのが理想

//   const handleLike = async () => {
//     const res = await fetch(`http://localhost:8000/api/tracks/${track.id}/like/`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })

//     if (res.ok) {
//       const data = await res.json()
//       if (data.message === 'Like added') {
//         setLikeCount((prev) => prev + 1)
//         setLiked(true)
//       } else if (data.message === 'Like removed') {
//         setLikeCount((prev) => prev - 1)
//         setLiked(false)
//       }
//     }
//   }

//   return (
//     <div className="p-4 border rounded shadow mb-4">
//       <h2>{track.title} / {track.artist}</h2>

//       {/* ログインしているときだけ ♥ボタンを表示 */}
//       {accessToken ? (
//         <button onClick={handleLike}>
//           {liked ? '❤️' : '🤍'} {likeCount}
//         </button>
//       ) : (
//         <p className="text-sm text-gray-500">ログインして「いいね」できます</p>
//       )}
//     </div>
//   )
// }





// type Track = {
//   id: number
//   title: string
//   artist: string
//   like_count: number
//   is_liked: boolean
// }





// const [liked, setLiked] = useState(track.is_liked)






import { useState } from 'react'

type Track = {
  id: number
  title: string
  artist: string
  like_count: number
  is_liked: boolean
}

type Props = {
  track: Track
  accessToken: string  // ログイン済みなら渡される
}

export default function TrackCard({ track, accessToken }: Props) {
  const [likeCount, setLikeCount] = useState(track.like_count)
  const [liked, setLiked] = useState(track.is_liked)  // ← ここが初期状態として重要！

  const handleLike = async () => {
    const res = await fetch(`http://localhost:8000/api/tracks/${track.id}/like/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (res.ok) {
      const data = await res.json()
      if (data.message === 'Like added') {
        setLikeCount((prev) => prev + 1)
        setLiked(true)
      } else if (data.message === 'Like removed') {
        setLikeCount((prev) => prev - 1)
        setLiked(false)
      }
    }
  }

  return (
    <div className="p-4 border rounded shadow mb-4">
      <h2>{track.title} / {track.artist}</h2>

      {/* ログインしているときだけ ♥ボタンを表示 */}
      {accessToken ? (
        <button onClick={handleLike}>
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>
      ) : (
        <p className="text-sm text-gray-500">ログインして「いいね」できます</p>
      )}
    </div>
  )
}






