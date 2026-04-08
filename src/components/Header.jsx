import React from 'react'

export default function Header({ tab, setTab, search, setSearch }) {
  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          CINEFILES
        </div>
        <div className="header-center">
          <div className="search-wrap">
            <svg className="search-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search your collection..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="header-right">
          <div className="nav-tabs">
            <button className={`nav-tab ${tab === 'movies' ? 'active' : ''}`} onClick={() => setTab('movies')}>
              Films
            </button>
            <button className={`nav-tab ${tab === 'diary' ? 'active' : ''}`} onClick={() => setTab('diary')}>
              Diary
            </button>
            <button className={`nav-tab ${tab === 'lists' ? 'active' : ''}`} onClick={() => setTab('lists')}>
              Lists
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}