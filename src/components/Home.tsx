import { useEffect, useState } from 'react';
import { tmdbApi } from '../services/tmdbApi';
import MovieRow from './MovieRow';
import Banner from './Banner';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerMovie, setBannerMovie] = useState(null);
  const [movieSections, setMovieSections] = useState({
    trending: [],
    popular: [],
    topRated: [],
    upcoming: [],
    nowPlaying: [],
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [trending, popular, topRated, upcoming, nowPlaying] = await Promise.all([
          tmdbApi.getTrending('movie'),
          tmdbApi.getMovies('popular'),
          tmdbApi.getMovies('top_rated'),
          tmdbApi.getMovies('upcoming'),
          tmdbApi.getMovies('now_playing'),
        ]);

        setMovieSections({
          trending: trending.data.results,
          popular: popular.data.results,
          topRated: topRated.data.results,
          upcoming: upcoming.data.results,
          nowPlaying: nowPlaying.data.results,
        });

        // Set banner movie from trending movies
        if (trending.data.results.length > 0) {
          setBannerMovie(trending.data.results[0]);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="min-h-screen bg-black pt-16">
      {bannerMovie && <Banner movie={bannerMovie} />}
      
      <div className="px-4 md:px-8 space-y-8 pb-8">
        <MovieRow title="Trending Now" movies={movieSections.trending} />
        <MovieRow title="Popular Movies" movies={movieSections.popular} />
        <MovieRow title="Top Rated" movies={movieSections.topRated} />
        <MovieRow title="Coming Soon" movies={movieSections.upcoming} />
        <MovieRow title="Now Playing" movies={movieSections.nowPlaying} />
      </div>
    </div>
  );
};

export default Home;
