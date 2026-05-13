function Sidebar({ years, activeYear, onSelectYear }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-label">Years</div>
      <button
        className={`all-btn ${activeYear === 'all' ? 'active' : ''}`}
        onClick={() => onSelectYear('all')}
      >
        All Years
      </button>
      {years.map(y => (
        <button
          key={y}
          className={`yr ${activeYear === y ? 'active' : ''}`}
          onClick={() => onSelectYear(y)}
        >
          {y}
        </button>
      ))}
    </nav>
  )
}

export default Sidebar