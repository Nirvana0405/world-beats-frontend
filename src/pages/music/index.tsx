// import { useEffect, useState } from 'react';

// type Track = {
//   id: number;
//   title: string;
//   audio_file: string;
// };

// export default function MusicListPage() {
//   const [tracks, setTracks] = useState<Track[]>([]);

//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/api/list/')
//       .then((res) => res.json())
//       .then((data) => setTracks(data))
//       .catch((err) => console.error('取得エラー:', err));
//   }, []);

//   return (
//     <div>
//       <h1>音楽リスト</h1>
//       <ul>
//         {tracks.map((track) => (
//           <li key={track.id}>
//             <p>{track.title}</p>
//             <audio controls src={track.audio_file}></audio>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }






import { useEffect, useState } from 'react';

type Track = {
  id: number;
  title: string;
  audio_file: string | null; // ← null や undefined の可能性に備える
};

export default function MusicListPage() {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/list/')
      .then((res) => res.json())
      .then((data) => setTracks(data))
      .catch((err) => console.error('取得エラー:', err));
  }, []);

  return (
    <div>
      <h1>音楽リスト</h1>
      <ul>
        {tracks.map((track) => (
          <li key={track.id}>
            <p>{track.title}</p>
            {track.audio_file ? (
              <audio controls src={track.audio_file}></audio>
            ) : (
              <p style={{ color: 'gray' }}>音源がありません</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
