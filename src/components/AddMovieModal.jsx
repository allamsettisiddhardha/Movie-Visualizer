import React, { useState } from 'react'

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
  'Romance', 'Science Fiction', 'Thriller', 'Western'
]

const emptyForm = { title: '', year: '', rating: '', overview: '', genres: [], posterUrl: '' }

export default function AddMovieModal({ onAdd, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [posterPreview, setPosterPreview] = useState(null)

  function update(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: '' }))
    if (key === 'posterUrl') {
      setPosterPreview(val.trim() || null)
    }
  }

  function toggleGenre(genre) {
    setForm(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.year || isNaN(form.year) || form.year < 1888 || form.year > 2030)
      e.year = 'Enter a valid year (1888–2030)'
    if (form.rating && (isNaN(form.rating) || form.rating < 0 || form.rating > 10))
      e.rating = 'Rating must be between 0 and 10'
    if (form.posterUrl && !form.posterUrl.startsWith('http'))
      e.posterUrl = 'Must be a valid URL starting with http'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }

    const newMovie = {
      id: `custom_${Date.now()}`,
      title: form.title.trim(),
      release_date: `${form.year}-01-01`,
      vote_average: form.rating ? parseFloat(form.rating) : 0,
      overview: form.overview.trim(),
      genre_names: form.genres,
      genre_ids: [],
      poster_path: null,
      posterUrl: form.posterUrl.trim() || null,
      popularity: 0,
      isCustom: true,
    }

    onAdd(newMovie)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal add-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="add-modal-body">
          <h2 className="add-modal-title">Add Your Movie</h2>

          <div className="add-modal-layout">
            {/* LEFT — poster preview */}
            <div className="poster-preview-wrap">
              {posterPreview ? (
                <img
                  src={posterPreview}
                  alt="Poster preview"
                  className="poster-preview-img"
                  onError={() => setPosterPreview(null)}
                />
              ) : (
                <div className="poster-preview-empty">
                  <span>No Poster</span>
                </div>
              )}
              <div className="form-group" style={{ marginTop: '10px', marginBottom: 0 }}>
                <label>Poster URL</label>
                <input
                  type="text"
                  placeholder="https://image.tmdb.org/..."
                  value={form.posterUrl}
                  onChange={e => update('posterUrl', e.target.value)}
                  className={errors.posterUrl ? 'input-error' : ''}
                />
                {errors.posterUrl && <span className="error-msg">{errors.posterUrl}</span>}
              </div>
            </div>

            {/* RIGHT — form fields */}
            <div className="add-modal-fields">
              <div className="form-group">
                <label>Title <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Inception"
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                  className={errors.title ? 'input-error' : ''}
                />
                {errors.title && <span className="error-msg">{errors.title}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Year <span className="required">*</span></label>
                  <input
                    type="number"
                    placeholder="e.g. 2010"
                    value={form.year}
                    onChange={e => update('year', e.target.value)}
                    className={errors.year ? 'input-error' : ''}
                  />
                  {errors.year && <span className="error-msg">{errors.year}</span>}
                </div>
                <div className="form-group">
                  <label>Rating <span className="optional">(0–10)</span></label>
                  <input
                    type="number"
                    placeholder="e.g. 8.5"
                    step="0.1" min="0" max="10"
                    value={form.rating}
                    onChange={e => update('rating', e.target.value)}
                    className={errors.rating ? 'input-error' : ''}
                  />
                  {errors.rating && <span className="error-msg">{errors.rating}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Overview</label>
                <textarea
                  placeholder="Write a short description..."
                  value={form.overview}
                  onChange={e => update('overview', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Genres</label>
                <div className="genre-picker">
                  {GENRES.map(g => (
                    <button
                      key={g}
                      type="button"
                      className={`genre-pick-btn ${form.genres.includes(g) ? 'selected' : ''}`}
                      onClick={() => toggleGenre(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-add" onClick={handleSubmit}>Add Movie</button>
          </div>
        </div>
      </div>
    </div>
  )
}