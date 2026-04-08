import React from 'react'

const IMG_BASE = 'https://image.tmdb.org/t/p/w185'

export default function MovieCard({ movie, isWatched, isFav, onToggleWatched, onToggleFav, onClick }) {
  const year = (movie.release_date || '').slice(0, 4)
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '—'

  const posterSrc = movie.posterUrl
    ? movie.posterUrl
    : movie.poster_path
      ? `${IMG_BASE}${movie.poster_path}`
      : null

  return (
    <div className="movie-card" onClick={onClick}>
      <div className="poster-wrap">
        {posterSrc
          ? <img src={posterSrc} alt={movie.title} loading="lazy" />
          : <div className="card-no-poster">{movie.title.slice(0, 2).toUpperCase()}</div>
        }

        <div className="poster-overlay">
          <div className="overlay-rating">★ {rating}</div>
          <div className="overlay-actions" onClick={e => e.stopPropagation()}>
            <button
              className={`ov-btn ${isWatched ? 'ov-watched' : ''}`}
              onClick={() => onToggleWatched(movie.id)}
              title={isWatched ? 'Watched' : 'Mark watched'}
            >
              {isWatched ? '✓' : '👁'}
            </button>
            <button
              className={`ov-btn ${isFav ? 'ov-fav' : ''}`}
              onClick={() => onToggleFav(movie.id)}
              title={isFav ? 'Favorited' : 'Add to favorites'}
            >
              {isFav ? '♥' : '♡'}
            </button>
          </div>
        </div>

        <div className="card-top-badges">
          {movie.isCustom && <span className="badge-mine">Mine</span>}
          {isWatched && <span className="badge-w">✓</span>}
          {isFav && <span className="badge-f">♥</span>}
        </div>
      </div>

      <div className="card-info">
        <div className="card-title">{movie.title}</div>
        <div className="card-sub">{year}</div>
      </div>
    </div>
  )
}