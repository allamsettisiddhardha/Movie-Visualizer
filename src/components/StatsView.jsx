import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#E8B84B','#5b8dd9','#E87B4B','#4BE8B0','#E84B7B','#B04BE8','#4B8BE8','#E8E04B']

export default function StatsView({ movies, genres, watched, favs }) {
  const avgRating = movies.length
    ? (movies.reduce((a, m) => a + (m.vote_average || 0), 0) / movies.length).toFixed(1)
    : 0

  const genreCounts = {}
  movies.forEach(m => {
    const names = m.isCustom
      ? (m.genre_names || [])
      : (m.genre_ids || []).map(id => genres[id]).filter(Boolean)
    names.forEach(name => {
      genreCounts[name] = (genreCounts[name] || 0) + 1
    })
  })
  const genreData = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([name, value]) => ({ name, value }))

  const ratingData = [
    { range: '1–3', count: movies.filter(m => m.vote_average < 3).length },
    { range: '3–5', count: movies.filter(m => m.vote_average >= 3 && m.vote_average < 5).length },
    { range: '5–7', count: movies.filter(m => m.vote_average >= 5 && m.vote_average < 7).length },
    { range: '7–9', count: movies.filter(m => m.vote_average >= 7 && m.vote_average < 9).length },
    { range: '9–10', count: movies.filter(m => m.vote_average >= 9).length },
  ]

  const decadeCounts = {}
  movies.forEach(m => {
    const y = parseInt((m.release_date || '1900').slice(0, 4))
    const decade = Math.floor(y / 10) * 10 + 's'
    decadeCounts[decade] = (decadeCounts[decade] || 0) + 1
  })
  const decadeData = Object.entries(decadeCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([decade, count]) => ({ decade, count }))

  return (
    <div className="stats-view">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Movies</div>
          <div className="stat-value">{movies.length}</div>
          <div className="stat-sub">in collection</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Watched</div>
          <div className="stat-value">{watched.size}</div>
          <div className="stat-sub">{movies.length ? Math.round(watched.size / movies.length * 100) : 0}% complete</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Favorites</div>
          <div className="stat-value">{favs.size}</div>
          <div className="stat-sub">handpicked</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Rating</div>
          <div className="stat-value">{avgRating}</div>
          <div className="stat-sub">out of 10</div>
        </div>
      </div>

      <div className="chart-section">
        <h3>Top Genres</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={genreData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
              {genreData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Ratings Distribution</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={ratingData}>
            <XAxis dataKey="range" stroke="#7a7870" />
            <YAxis stroke="#7a7870" />
            <Tooltip />
            <Bar dataKey="count" fill="#E8B84B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Decade Breakdown</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={decadeData}>
            <XAxis dataKey="decade" stroke="#7a7870" />
            <YAxis stroke="#7a7870" />
            <Tooltip />
            <Bar dataKey="count" fill="#5b8dd9" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}