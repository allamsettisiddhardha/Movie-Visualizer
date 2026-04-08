import { useState, useEffect } from 'react'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export function useMovies(searchQuery = '') {
  const [popularMovies, setPopularMovies] = useState([])
  const [searchMovies, setSearchMovies] = useState([])
  const [genres, setGenres] = useState({})
  const [loading, setLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  // 1. Fetch Genres and Popular Movies ONCE on startup
  useEffect(() => {
    async function fetchInitial() {
      try {
        const genreRes = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
        const genreMap = {}
        genreRes.data.genres.forEach(g => genreMap[g.id] = g.name)
        setGenres(genreMap)

        const pageNumbers = Array.from({ length: 4 }, (_, i) => i + 1) // Just 4 pages (80 movies) for home page speed
        const allResults = []

        for (let p of pageNumbers) {
          const res = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${p}&vote_count.gte=200`)
          allResults.push(...res.data.results)
        }

        const unique = Array.from(new Map(allResults.filter(m => m.poster_path).map(m => [m.id, m])).values())
        setPopularMovies(unique)
      } catch (err) {
        console.error('Failed to fetch initial movies:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchInitial()
  }, [])

  // 2. Debounce and Fetch Search Queries Live
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchMovies([])
      setIsSearching(false)
      return
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}`)
        const validResults = res.data.results.filter(m => m.poster_path)
        setSearchMovies(validResults)
      } catch (err) {
        console.error('Search failed:', err)
      } finally {
        setIsSearching(false)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  // If we have a search query, output the search results instead of popular
  const activeMovies = searchQuery.trim() ? searchMovies : popularMovies
  const activeLoading = loading || isSearching

  return { tmdbMovies: activeMovies, genres, loading: activeLoading }
}