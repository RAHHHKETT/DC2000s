const BASE_URL = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p/w500'
const TOKEN = import.meta.env.VITE_TMDB_TOKEN

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
}

export async function fetchMovieDetails(title, year) {
  try {
    // try movies first
    const res = await fetch(
      `${BASE_URL}/search/movie?query=${encodeURIComponent(title)}&year=${year}&language=en-US`,
      { headers }
    )
    const data = await res.json()
    let result = data.results?.[0]
    let mediaType = 'movie'

    // fall back to TV
    if (!result) {
      const tvRes = await fetch(
        `${BASE_URL}/search/tv?query=${encodeURIComponent(title)}&language=en-US`,
        { headers }
      )
      const tvData = await tvRes.json()
      result = tvData.results?.[0]
      mediaType = 'tv'
    }

    if (!result) return {}

    const id = result.id
    

    // fetch credits in parallel
    const creditsRes = await fetch(
      `${BASE_URL}/${mediaType}/${id}/credits?language=en-US`,
      { headers }
    )
    const credits = await creditsRes.json()

    const director = credits.crew?.find(c => c.job === 'Director')?.name || null
    const castList = credits.cast
      ?.slice(0, 5)
      .map(c => c.name)
      .join(', ') || null

    const posterPath = result.poster_path
    const posterUrl = posterPath ? `${IMG_BASE}${posterPath}` : null

    return { tmdbId: id, posterUrl, director, castList }
  } catch {
    return {}
  }
}