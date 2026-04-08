import React, { useState } from 'react'

export default function DateRangeFilter({ onFilter, onClear }) {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [active, setActive] = useState(false)

  function handleApply() {
    if (!fromDate && !toDate) return
    onFilter(fromDate, toDate)
    setActive(true)
  }

  function handleClear() {
    setFromDate('')
    setToDate('')
    setActive(false)
    onClear()
  }

  return (
    <div className="date-range-filter">
      <div className="date-range-label">Watched Between</div>
      <div className="date-range-inputs">
        <div className="date-field">
          <label>From</label>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            max={toDate || undefined}
          />
        </div>
        <div className="date-range-arrow">→</div>
        <div className="date-field">
          <label>To</label>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            min={fromDate || undefined}
          />
        </div>
        <button
          className={`date-apply-btn ${active ? 'active' : ''}`}
          onClick={handleApply}
        >
          Apply
        </button>
        {active && (
          <button className="date-clear-btn" onClick={handleClear}>
            ✕ Clear
          </button>
        )}
      </div>
      {active && (
        <div className="date-active-label">
          Showing movies watched {fromDate || '...'} → {toDate || 'today'}
        </div>
      )}
    </div>
  )
}