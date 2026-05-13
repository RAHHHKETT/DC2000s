import { useState } from 'react'
import { X, Star, Clock, Calendar, User, Users, Play, Minimize2 } from 'lucide-react'
import { Film } from 'lucide-react'

function MovieModal({ movie, onClose }) {
  const [showPlayer, setShowPlayer] = useState(false)

  if (!movie) return null

  // ✅ Full screen player overlay
  if (showPlayer) {
    return (
      <div className="player-overlay">
        <div className="player-topbar">
          <span className="player-title">{movie.title}</span>
          <div className="player-topbar-actions">
            <button className="player-btn" onClick={() => setShowPlayer(false)}>
              <Minimize2 size={18} /> Back to Info
            </button>
            <button className="player-btn player-close" onClick={onClose}>
              <X size={18} /> Close
            </button>
          </div>
        </div>
        <iframe
          src={`https://www.vidking.net/embed/movie/${movie.embed_id}`}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          style={{ flex: 1 }}
        />
      </div>
    )
  }

  // ✅ Default — movie info modal
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="modal-inner">
          <div className="modal-poster">
            {movie.poster_url ? (
              <img src={movie.poster_url} alt={movie.title} />
            ) : (
              <div className="modal-poster-placeholder">
                <Film size={64} color="rgba(255,255,255,0.2)" />
              </div>
            )}
            {movie.rating >= 8 && (
              <div className="modal-top-badge">TOP RATED</div>
            )}
          </div>
          <div className="modal-info">
            <h2 className="modal-title">{movie.title}</h2>

            <div className="modal-meta">
              <span className="modal-meta-item">
                <Calendar size={14} />
                {movie.release_date
                  ? new Date(movie.release_date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })
                  : movie.year}
              </span>
              <span className="modal-meta-item">
                <Clock size={14} />
                {movie.runtime_minutes} min
              </span>
              <span className="modal-meta-item modal-rating">
                <Star size={14} fill="#f5c518" color="#f5c518" />
                {movie.rating} / 10
              </span>
            </div>

            <p className="modal-description">
              {movie.description || 'No description available.'}
            </p>

            {movie.director && (
              <div className="modal-detail-row">
                <User size={14} />
                <span className="modal-detail-label">Director</span>
                <span className="modal-detail-value">{movie.director}</span>
              </div>
            )}

            {movie.cast_list && (
              <div className="modal-detail-row">
                <Users size={14} />
                <span className="modal-detail-label">Cast</span>
                <span className="modal-detail-value">{movie.cast_list}</span>
              </div>
            )}

            {movie.embed_id && (
              <button
                className="modal-watch-btn"
                onClick={() => setShowPlayer(true)}
              >
                <Play size={16} fill="currentColor" />
                Watch Now
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieModal