const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

const USER_ID = 'default_user'

// GET user data
app.get('/api/userdata', async (req, res) => {
  try {
    // 1. Get custom movies
    const [custom] = await pool.query('SELECT * FROM custom_movies WHERE user_id = ?', [USER_ID])
    
    // 2. Get diary entries (interactions)
    const [entries] = await pool.query('SELECT * FROM diary_entries WHERE user_id = ?', [USER_ID])
    
    // Format for frontend
    res.json({
      customMovies: custom,
      interactions: entries,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// SYNC a movie interaction
app.post('/api/userdata/interaction', async (req, res) => {
  try {
    const { movieId, watched, watchDate, isFavorite, rating, review } = req.body

    // check if it exists
    const [existing] = await pool.query('SELECT id FROM diary_entries WHERE user_id = ? AND movie_id = ?', [USER_ID, movieId.toString()])
    
    if (existing.length === 0) {
      if (watched || isFavorite || rating || review) {
        await pool.query(
          'INSERT INTO diary_entries (user_id, movie_id, watch_date, rating, review, is_favorite) VALUES (?, ?, ?, ?, ?, ?)',
          [USER_ID, movieId.toString(), watchDate || null, rating || null, review || null, isFavorite ? 1 : 0]
        )
      }
    } else {
      if (!watched && !isFavorite && !rating && !review) {
         // delete interaction
         await pool.query('DELETE FROM diary_entries WHERE id = ?', [existing[0].id])
      } else {
         // update
         await pool.query(
           'UPDATE diary_entries SET watch_date = ?, rating = ?, review = ?, is_favorite = ? WHERE id = ?',
           [watchDate || null, rating || null, review || null, isFavorite ? 1 : 0, existing[0].id]
         )
      }
    }
    
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// ADD custom movie
app.post('/api/userdata/custommovies', async (req, res) => {
  try {
    const { movie } = req.body
    await pool.query(
      'INSERT INTO custom_movies (id, user_id, title, overview, release_date, genres) VALUES (?, ?, ?, ?, ?, ?)',
      [movie.id, USER_ID, movie.title, movie.overview || '', movie.release_date || '', JSON.stringify(movie.genres || [])]
    )
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// DELETE custom movie
app.delete('/api/userdata/custommovies/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM custom_movies WHERE id = ? AND user_id = ?', [req.params.id, USER_ID])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// LISTS APIs
app.get('/api/lists', async (req, res) => {
  try {
    const [lists] = await pool.query('SELECT * FROM lists WHERE user_id = ?', [USER_ID])
    for (let list of lists) {
      const [items] = await pool.query('SELECT movie_id FROM list_items WHERE list_id = ? ORDER BY order_index', [list.id])
      list.movies = items.map(i => i.movie_id)
    }
    res.json(lists)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/lists', async (req, res) => {
  try {
    const { title, description } = req.body
    const [result] = await pool.query('INSERT INTO lists (user_id, title, description) VALUES (?, ?, ?)', [USER_ID, title, description || ''])
    res.json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))