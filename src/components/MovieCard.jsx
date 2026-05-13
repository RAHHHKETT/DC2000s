import { Film, Star } from 'lucide-react'

const gradients = [
  'linear-gradient(135deg,#1a237e,#283593)',
  'linear-gradient(135deg,#1b0036,#4a148c)',
  'linear-gradient(135deg,#0d1b2a,#1565c0)',
  'linear-gradient(135deg,#1a0a00,#bf360c)',
  'linear-gradient(135deg,#0a1f0a,#1b5e20)',
  'linear-gradient(135deg,#1a1a1a,#424242)',
  'linear-gradient(135deg,#1a0020,#6a1b9a)',
]

function MovieCard({ movie, onClick }) {
  const grad = gradients[movie.title.length % gradients.length]

  return (
    <div className="card" onClick={() => onClick(movie)}>
      <div className="poster" style={{ background: grad }}>
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <Film size={48} color="rgba(255,255,255,0.3)" />
        )}
        {movie.rating >= 8 && <div className="top-badge">TOP RATED</div>}
      </div>
      <div className="card-info">
        <div className="card-title">{movie.title}</div>
        <div className="card-row">
          <span className="card-year">{movie.year}</span>
          <span className="card-rating">
            <Star size={11} fill="#f5c518" color="#f5c518" /> {movie.rating}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MovieCard