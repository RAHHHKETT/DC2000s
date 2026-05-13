import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { supabase } from './supabaseClient'
import { fetchMovieDetails } from './tmdb'
import Sidebar from './components/Sidebar'
import MovieGrid from './components/MovieGrid'
import MovieModal from './components/MovieModal'
import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [years, setYears] = useState([])
  const [activeYear, setActiveYear] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [sortBy, setSortBy] = useState('year_asc')
  const [showSort, setShowSort] = useState(false)

  useEffect(() => {
    fetchMovies()
  }, [])

  async function fetchMovies() {
    setLoading(true)
    const { data, error } = await supabase
      .from('dc_movies')
      .select('*')
      .order('year', { ascending: true })

    if (error) {
      console.error('Error fetching movies:', error)
      setLoading(false)
      return
    }

    const withDetails = await Promise.all(
      data.map(async (movie) => {
        // skip fetching if we already have everything saved
        if (movie.tmdb_id && movie.director && movie.cast_list) return movie

        const details = await fetchMovieDetails(movie.title, movie.year)
        if (!details.tmdbId) return movie

        const updated = {
          ...movie,
          tmdb_id: details.tmdbId,
          poster_url: details.posterUrl || movie.poster_url,
          director: movie.director || details.director,
          cast_list: movie.cast_list || details.castList,
        }

        // save back to Supabase so we don't fetch again next time
        await supabase
          .from('dc_movies')
          .update({
            tmdb_id: details.tmdbId,
            poster_url: updated.poster_url,
            director: updated.director,
            cast_list: updated.cast_list,
          })
          .eq('id', movie.id)

        return updated
      })
    )

    setMovies(withDetails)
    const uniqueYears = [...new Set(withDetails.map(m => m.year))].sort()
    setYears(uniqueYears)
    setLoading(false)
  }

  function getSorted(list) {
    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'year_asc': return a.year - b.year
        case 'year_desc': return b.year - a.year
        case 'rating_desc': return (b.rating || 0) - (a.rating || 0)
        case 'rating_asc': return (a.rating || 0) - (b.rating || 0)
        case 'runtime_desc': return (b.runtime_minutes || 0) - (a.runtime_minutes || 0)
        case 'runtime_asc': return (a.runtime_minutes || 0) - (b.runtime_minutes || 0)
        case 'title_asc': return a.title.localeCompare(b.title)
        default: return 0
      }
    })
  }

  const filtered = getSorted(
    movies.filter(m => {
      const matchYear = activeYear === 'all' || m.year === activeYear
      const matchSearch = m.title.toLowerCase().includes(search.toLowerCase())
      return matchYear && matchSearch
    })
  )

  function handleLogoClick() {
    setActiveYear('all')
    setSearch('')
  }

  const sortOptions = [
    { value: 'year_asc', label: 'Year: Oldest First' },
    { value: 'year_desc', label: 'Year: Newest First' },
    { value: 'rating_desc', label: 'Rating: Highest First' },
    { value: 'rating_asc', label: 'Rating: Lowest First' },
    { value: 'runtime_desc', label: 'Runtime: Longest First' },
    { value: 'runtime_asc', label: 'Runtime: Shortest First' },
    { value: 'title_asc', label: 'Title: A to Z' },
  ]

  return (
    <div className="app">
      <div className="bg-art" />
      <header className="topbar">
        <div className="dc-logo" onClick={handleLogoClick} title="Go to home">
          <img src="/dclogorevamped.png" alt="DC" className="dc-badge-img" />
          <div className="dc-tagline">
            <span>DC Animated</span>
            <span>Universe Films</span>
          </div>
        </div>
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="sort-wrap">
          <button className="sort-btn" onClick={() => setShowSort(!showSort)}>
            <SlidersHorizontal size={15} />
            <span>Sort</span>
          </button>
          {showSort && (
            <div className="sort-dropdown">
              {sortOptions.map(opt => (
                <button
                  key={opt.value}
                  className={`sort-option ${sortBy === opt.value ? 'active' : ''}`}
                  onClick={() => { setSortBy(opt.value); setShowSort(false) }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>
      <div className="body">
        <Sidebar
          years={years}
          activeYear={activeYear}
          onSelectYear={setActiveYear}
        />
        <MovieGrid
          movies={filtered}
          loading={loading}
          activeYear={activeYear}
          onCardClick={setSelectedMovie}
        />
      </div>
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  )
}

export default App