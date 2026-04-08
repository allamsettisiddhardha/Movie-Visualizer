import React, { useState, useMemo } from 'react'
import { useMovies } from './hooks/useMovies'
import { useUserData } from './hooks/useUserData'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import MovieGrid from './components/MovieGrid'
import MovieModal from './components/MovieModal'
import DiaryView from './components/DiaryView'
import ListsView from './components/ListsView'
import StatsView from './components/StatsView'

export default function App() {
  const [search, setSearch] = useState('')
  const { tmdbMovies, genres, loading } = useMovies(search)
  const { interactions, watched, watchedDates, favs, lists, loaded, toggleWatched, toggleFav, updateDiary, createList } = useUserData()

  const [tab, setTab] = useState('movies')
  const [filters, setFilters] = useState({ genre: '', sort: 'popularity', status: '' })
  const [selectedMovie, setSelectedMovie] = useState(null)

  const allMovies = useMemo(() => [...tmdbMovies], [tmdbMovies])

  const filtered = useMemo(() => {
    let list = allMovies.filter(m => {
      // (The search filtering is now done live via Network/API!)
      if (filters.genre) {
        const inTmdb = m.genre_ids?.includes(parseInt(filters.genre))
        if (!inTmdb) return false
      }
      if (filters.status === 'watched' && !watched.has(String(m.id))) return false
      if (filters.status === 'unwatched' && watched.has(String(m.id))) return false
      if (filters.status === 'favorites' && !favs.has(String(m.id))) return false

      return true
    })

    if (filters.sort === 'popularity') list.sort((a, b) => b.popularity - a.popularity)
    else if (filters.sort === 'rating') list.sort((a, b) => b.vote_average - a.vote_average)
    else if (filters.sort === 'year_desc') list.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''))
    else if (filters.sort === 'year_asc') list.sort((a, b) => (a.release_date || '').localeCompare(b.release_date || ''))
    else if (filters.sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title))

    return list
  }, [allMovies, search, filters, watched, favs, genres])

  if (!loaded) return (
    <div className="full-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-light)' }}>
      <p>Connecting to database...</p>
    </div>
  )

  return (
    <div className="app">
      <Header
        tab={tab} setTab={setTab}
        search={search} setSearch={setSearch}
      />

      {tab === 'movies' && (
        <>
          <FilterBar
            genres={genres} filters={filters} setFilters={setFilters}
            total={allMovies.length}
            watched={[...watched].filter(id => allMovies.find(m => String(m.id) === id)).length}
            favs={[...favs].filter(id => allMovies.find(m => String(m.id) === id)).length}
          />
          {loading
            ? <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Fetching movies...</div>
            : <MovieGrid
                movies={filtered} watched={watched} favs={favs}
                onToggleWatched={toggleWatched} onToggleFav={toggleFav}
                onSelect={setSelectedMovie}
              />
          }
        </>
      )}

      {tab === 'diary' && <DiaryView movies={allMovies} interactions={interactions} />}
      
      {tab === 'lists' && <ListsView lists={lists} onCreateList={createList} />}

      {tab === 'stats' && <StatsView movies={allMovies} genres={genres} watched={watched} favs={favs} />}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie} genres={genres}
          isWatched={watched.has(String(selectedMovie.id))}
          isFav={favs.has(String(selectedMovie.id))}
          interaction={interactions[selectedMovie.id] || {}}
          onToggleWatched={toggleWatched}
          onToggleFav={toggleFav}
          onUpdateDiary={updateDiary}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  )
}