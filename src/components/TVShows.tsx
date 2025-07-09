import { useEffect, useState } from 'react';
import { tmdbApi } from '../services/tmdbApi';
import MovieRow from './MovieRow';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const TVShows = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tvSections, setTvSections] = useState({
    popular: [],
    topRated: [],
    onTheAir: [],
    airingToday: [],
    drama: [],
    comedy: [],
    sciFi: [],
    crime: [],
  });

  const fetchTVByGenre = async (genreId: number) => {
    const response = await tmdbApi.discoverTVShows({ with_genres: genreId, sort_by: 'popularity.desc' });
    return response.data.results;
  };

  useEffect(() => {
    const fetchTVData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [popular, topRated, onTheAir, airingToday, drama, comedy, sciFi, crime] = await Promise.all([
          tmdbApi.getTVShows('popular'),
          tmdbApi.getTVShows('top_rated'),
          tmdbApi.getTVShows('on_the_air'),
          tmdbApi.getTVShows('airing_today'),
          fetchTVByGenre(18), // Drama
          fetchTVByGenre(35), // Comedy
          fetchTVByGenre(10765), // Sci-Fi & Fantasy
          fetchTVByGenre(80), // Crime
        ]);

        setTvSections({
          popular: popular.data.results,
          topRated: topRated.data.results,
          onTheAir: onTheAir.data.results,
          airingToday: airingToday.data.results,
          drama: drama,
          comedy: comedy,
          sciFi: sciFi,
          crime: crime,
        });
      } catch (err) {
        console.error('Error fetching TV shows data:', err);
        setError('Failed to load TV shows. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTVData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">TV Shows</h1>
          <p className="text-gray-400">Binge-watch your favorite series</p>
        </div>
        
        <div className="space-y-8 pb-8">
          <MovieRow title="Popular TV Shows" movies={tvSections.popular} />
          <MovieRow title="Top Rated TV Shows" movies={tvSections.topRated} />
          <MovieRow title="On The Air" movies={tvSections.onTheAir} />
          <MovieRow title="Airing Today" movies={tvSections.airingToday} />
          <MovieRow title="Drama Series" movies={tvSections.drama} />
          <MovieRow title="Comedy Series" movies={tvSections.comedy} />
          <MovieRow title="Sci-Fi & Fantasy" movies={tvSections.sciFi} />
          <MovieRow title="Crime Series" movies={tvSections.crime} />
        </div>
      </div>
    </div>
  );
};

export default TVShows;
