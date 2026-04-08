import React from 'react'

export default function FilterBar({ total, watched, favs }) {
  return (
    <div className="filter-bar" style={{ display: 'flex', justifyContent: 'center', padding: '1rem', background: 'var(--bg-dark)' }}>
      <div className="stats-strip" style={{ display: 'flex', gap: '2rem' }}>
        <div className="stat-pill" style={{ textAlign: 'center' }}>
          <span className="pill-num" style={{ display: 'block', color: 'var(--text-light)', fontSize: '1.2rem', fontWeight: 'bold' }}>{total}</span>
          <span className="pill-label" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total Films</span>
        </div>
        <div className="stat-pill" style={{ textAlign: 'center' }}>
          <span className="pill-num" style={{ display: 'block', color: 'var(--accent-green)', fontSize: '1.2rem', fontWeight: 'bold' }}>{watched}</span>
          <span className="pill-label" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Watched</span>
        </div>
        <div className="stat-pill" style={{ textAlign: 'center' }}>
          <span className="pill-num" style={{ display: 'block', color: 'var(--accent-orange)', fontSize: '1.2rem', fontWeight: 'bold' }}>{favs}</span>
          <span className="pill-label" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Favorites</span>
        </div>
      </div>
    </div>
  )
}