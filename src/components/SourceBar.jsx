const SOURCES = [
  { id: 'indeed',   label: 'Indeed',   icon: '🔍' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
]

export default function SourceBar({ source, onSourceChange }) {
  return (
    <div className="source-bar">
      <span className="source-label">Source:</span>
      {SOURCES.map(s => (
        <button
          key={s.id}
          className={`source-btn${source === s.id ? ' active' : ''}`}
          onClick={() => onSourceChange(s.id)}
        >
          {s.icon} {s.label}
        </button>
      ))}
    </div>
  )
}
