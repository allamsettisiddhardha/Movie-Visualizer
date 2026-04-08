import React, { useState } from 'react'

const IMG_BASE = 'https://image.tmdb.org/t/p/w342'

export default function MovieModal({ movie, genres, isWatched, isFav, interaction, onToggleWatched, onToggleFav, onUpdateDiary, onDelete, onClose }) {
  const [modalTab, setModalTab] = useState('details') // 'details' or 'diary'
  const [logDate, setLogDate] = useState(interaction.watchDate || new Date().toISOString().slice(0, 10))
  const [rating, setRating] = useState(interaction.rating || 0)
  const [review, setReview] = useState(interaction.review || '')

  if (!movie) return null

  const year = (movie.release_date || '').slice(0, 4)
  const avgRating = movie.vote_average ? movie.vote_average.toFixed(1) : '—'
  const movieGenres = movie.isCustom
    ? (movie.genre_names || [])
    : (movie.genre_ids || []).map(id => genres[id]).filter(Boolean)

  const posterSrc = movie.posterUrl
    ? movie.posterUrl
    : movie.poster_path
      ? `${IMG_BASE}${movie.poster_path}`
      : null

  const handleSaveLog = (e) => {
    e.preventDefault()
    onUpdateDiary(movie.id, rating > 0 ? rating : null, review.trim() || null, logDate)
    setModalTab('details')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-backdrop" style={{
          backgroundImage: posterSrc ? `url(${posterSrc})` : 'none'
        }} />

        <div className="modal-inner">
          <div className="modal-poster">
            {posterSrc
              ? <img src={posterSrc} alt={movie.title} />
              : <div className="no-poster-card" style={{ background: '#333' }}>{movie.title.slice(0, 2).toUpperCase()}</div>
            }
          </div>

          <div className="modal-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2 className="modal-title">{movie.title}</h2>
              {movie.isCustom && <span style={{ background: 'var(--accent-blue)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', color: '#fff' }}>My Movie</span>}
            </div>

            <div className="modal-meta">
              <span style={{ color: 'var(--accent-gold)' }}>★ {avgRating}</span>
              <span>{year}</span>
              {movieGenres.slice(0, 2).map(g => (
                <span key={g}>{g}</span>
              ))}
            </div>

            <div className="log-tabs">
              <button className={`log-tab ${modalTab === 'details' ? 'active' : ''}`} onClick={() => setModalTab('details')}>Details</button>
              <button className={`log-tab ${modalTab === 'diary' ? 'active' : ''}`} onClick={() => setModalTab('diary')}>Log / Diary</button>
            </div>

            {modalTab === 'details' ? (
              <>
                <p className="modal-overview">{movie.overview || 'No overview available.'}</p>
                {movieGenres.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    {movieGenres.map(g => <span key={g} style={{ background: 'var(--bg-dark)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem' }}>{g}</span>)}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                  <button
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', background: isWatched ? 'var(--accent-green)' : 'var(--bg-dark)', color: '#fff', fontWeight: 'bold' }}
                    onClick={() => onToggleWatched(movie.id)}
                  >
                    {isWatched ? '✓ Watched' : '👁 Mark Watched'}
                  </button>
                  <button
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', background: isFav ? 'var(--accent-orange)' : 'var(--bg-dark)', color: '#fff', fontWeight: 'bold' }}
                    onClick={() => onToggleFav(movie.id)}
                  >
                    {isFav ? '♥ Favorited' : '♡ Favorite'}
                  </button>
                  {onDelete && (
                    <button style={{ padding: '0.8rem', borderRadius: '4px', background: 'var(--accent-red)', color: '#fff' }} onClick={() => onDelete(movie.id)}>
                      🗑
                    </button>
                  )}
                </div>
              </>
            ) : (
              <form onSubmit={handleSaveLog} className="diary-form">
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Watch Date</label>
                    <input type="date" value={logDate} onChange={e => setLogDate(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Rating (1-5)</label>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={rating >= star ? 'active' : ''} onClick={() => setRating(rating === star ? 0 : star)}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Review (Optional)</label>
                  <textarea rows="4" value={review} onChange={e => setReview(e.target.value)} placeholder="Add a review..."></textarea>
                </div>
                <button type="submit" className="btn-save-log">Save Entry</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}