import React from 'react'

export default function DiaryView({ movies, interactions }) {
  const entries = Object.entries(interactions)
    .filter(([id, data]) => data.watched && data.watchDate)
    .sort((a, b) => new Date(b[1].watchDate) - new Date(a[1].watchDate))
    .map(([id, data]) => {
      const movie = movies.find(m => String(m.id) === String(id))
      return { id, movie, ...data }
    })

  if (!entries.length) return (
    <div className="diary-list">
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No diary entries yet. Log a film to start your diary!
      </div>
    </div>
  )

  return (
    <div className="diary-list">
      <h2 style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Recent Diary Entries</h2>
      {entries.map(entry => (
        <div key={entry.id} className="diary-entry">
          <div className="diary-poster">
            {entry.movie && (entry.movie.posterUrl || entry.movie.poster_path) ? (
              <img 
                src={entry.movie.posterUrl || `https://image.tmdb.org/t/p/w154${entry.movie.poster_path}`} 
                alt={entry.movie?.title} 
              />
            ) : (
              <div style={{ width: 60, height: 90, background: '#333' }}></div>
            )}
          </div>
          <div className="diary-content">
            <h3>{entry.movie?.title || 'Unknown Movie'}</h3>
            {entry.rating && <div className="diary-rating">{'★'.repeat(Math.round(entry.rating))} {entry.rating}</div>}
            <div className="diary-meta">Watched on {new Date(entry.watchDate).toLocaleDateString()}</div>
            {entry.review && <p style={{ marginTop: '0.5rem', color: 'var(--text-main)' }}>{entry.review}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
