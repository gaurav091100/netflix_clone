import { useEffect, useState } from 'react';
import { tmdbApi } from '../services/tmdbApi';
import MovieRow from './MovieRow';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const Movies = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movieSections, setMovieSections] = useState({
    popular: [],
    topRated: [],
    upcoming: [],
    nowPlaying: [],
    action: [],
    comedy: [],
    horror: [],
    romance: [],
  });

  const fetchMoviesByGenre = async (genreId: number) => {
    const response = await tmdbApi.discoverMovies({ with_genres: genreId, sort_by: 'popularity.desc' });
    return response.data.results;
  };

  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [popular, topRated, upcoming, nowPlaying, action, comedy, horror, romance] = await Promise.all([
          tmdbApi.getMovies('popular'),
          tmdbApi.getMovies('top_rated'),
          tmdbApi.getMovies('upcoming'),
          tmdbApi.getMovies('now_playing'),
          fetchMoviesByGenre(28), // Action
          fetchMoviesByGenre(35), // Comedy
          fetchMoviesByGenre(27), // Horror
          fetchMoviesByGenre(10749), // Romance
        ]);

        setMovieSections({
          popular: popular.data.results,
          topRated: topRated.data.results,
          upcoming: upcoming.data.results,
          nowPlaying: nowPlaying.data.results,
          action: action,
          comedy: comedy,
          horror: horror,
          romance: romance,
        });
      } catch (err) {
        console.error('Error fetching movies data:', err);
        setError('Failed to load movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Movies</h1>
          <p className="text-gray-400">Discover the latest and greatest movies</p>
        </div>
        
        <div className="space-y-8 pb-8">
          <MovieRow title="Popular Movies" movies={movieSections.popular} />
          <MovieRow title="Top Rated Movies" movies={movieSections.topRated} />
          <MovieRow title="Now Playing" movies={movieSections.nowPlaying} />
          <MovieRow title="Coming Soon" movies={movieSections.upcoming} />
          <MovieRow title="Action Movies" movies={movieSections.action} />
          <MovieRow title="Comedy Movies" movies={movieSections.comedy} />
          <MovieRow title="Horror Movies" movies={movieSections.horror} />
          <MovieRow title="Romance Movies" movies={movieSections.romance} />
        </div>
      </div>
    </div>
  );
};

export default Movies;
