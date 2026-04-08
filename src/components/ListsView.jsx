import React, { useState } from 'react'

export default function ListsView({ lists, onCreateList }) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const handleCreate = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onCreateList(title, desc)
    setTitle('')
    setDesc('')
    setShowForm(false)
  }

  return (
    <div className="diary-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--text-light)', fontFamily: 'var(--font-heading)' }}>Your Lists</h2>
        <button className="btn-add-movie" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New List'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="diary-form" style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label>List Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="E.g., Top 10 Horrors" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}></textarea>
          </div>
          <button type="submit" className="btn-save-log">Create List</button>
        </form>
      )}

      {lists.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
          You haven't created any lists yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {lists.map(list => (
            <div key={list.id} className="diary-entry" style={{ flexDirection: 'column' }}>
              <h3 style={{ color: 'var(--text-light)' }}>{list.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{list.description}</p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem', color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {list.movies ? list.movies.length : 0} films
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
