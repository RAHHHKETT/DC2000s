import MovieCard from './MovieCard'
import { Film } from 'lucide-react'

function MovieGrid({ movies, loading, activeYear, onCardClick }) {
  if (loading) {
    return (
      <div className="content">
        <div className="skeleton-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-poster" />
              <div className="skeleton-body">
                <div className="skeleton-line long" />
                <div className="skeleton-line short" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="content">
      <div className="section-head">
        <div className="section-title">
          {activeYear === 'all' ? 'All Films' : `${activeYear} Films`}
        </div>
        <div className="section-count">
          {movies.length} film{movies.length !== 1 ? 's' : ''}
        </div>
      </div>
      {movies.length === 0 ? (
        <div className="no-results">
          <Film size={40} color="rgba(255,255,255,0.2)" />
          <p>No films found.</p>
        </div>
      ) : (
        <div className="grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} onClick={onCardClick} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MovieGrid