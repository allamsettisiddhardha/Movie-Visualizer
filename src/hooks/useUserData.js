import { useState, useEffect } from 'react'

const API = 'http://localhost:5000/api/userdata'
const LISTS_API = 'http://localhost:5000/api/lists'

export function useUserData() {
  const [interactions, setInteractions] = useState({})
  const [lists, setLists] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(API).then(r => r.json()),
      fetch(LISTS_API).then(r => r.json())
    ])
      .then(([userData, listsData]) => {
        const intMap = {}
        if (userData.interactions) {
          userData.interactions.forEach(int => {
            intMap[int.movie_id] = {
              watched: !!int.watch_date,
              watchDate: int.watch_date ? int.watch_date.split('T')[0] : null,
              isFavorite: !!int.is_favorite,
              rating: int.rating,
              review: int.review
            }
          })
        }
        setInteractions(intMap)
        setLists(listsData || [])
        setLoaded(true)
      })
      .catch((err) => {
        console.error('Failed to load user data', err)
        setLoaded(true)
      })
  }, [])

  function syncInteraction(movieId, updates) {
    const prev = interactions[movieId] || {}
    const next = { ...prev, ...updates }
    
    setInteractions(curr => ({ ...curr, [movieId]: next }))

    fetch(`${API}/interaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId,
        ...next
      })
    })
  }

  function toggleWatched(id) {
    const isWatched = interactions[id]?.watched
    syncInteraction(id, { 
      watched: !isWatched,
      watchDate: !isWatched ? new Date().toISOString().slice(0, 10) : null
    })
  }

  function updateDiary(id, rating, review, watchDate) {
    syncInteraction(id, { rating, review, watchDate, watched: true })
  }

  function toggleFav(id) {
    syncInteraction(id, { isFavorite: !interactions[id]?.isFavorite })
  }

  function createList(title, description) {
    fetch(LISTS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    })
    .then(r => r.json())
    .then(data => {
      setLists(prev => [...prev, { id: data.id, title, description, movies: [] }])
    })
  }

  const watched = new Set(Object.keys(interactions).filter(id => interactions[id].watched).map(String))
  const favs = new Set(Object.keys(interactions).filter(id => interactions[id].isFavorite).map(String))
  const watchedDates = Object.fromEntries(
    Object.entries(interactions).map(([id, val]) => [id, val.watchDate])
  )

  return { 
    interactions, 
    watched, 
    watchedDates, 
    favs, 
    lists,
    loaded, 
    toggleWatched, 
    updateDiary,
    toggleFav, 
    createList
  }
}