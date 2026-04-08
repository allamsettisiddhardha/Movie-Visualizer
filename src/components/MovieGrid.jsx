import React from 'react'
import MovieCard from './MovieCard'

export default function MovieGrid({ movies, watched, favs, onToggleWatched, onToggleFav, onSelect }) {
  if (movies.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">◈</div>
        <p>No movies match your filters.</p>
      </div>
    )
  }

  return (
    <div className="movie-grid">
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isWatched={watched.has(movie.id)}
          isFav={favs.has(movie.id)}
          onToggleWatched={onToggleWatched}
          onToggleFav={onToggleFav}
          onClick={() => onSelect(movie)}
        />
      ))}
    </div>
  )
}