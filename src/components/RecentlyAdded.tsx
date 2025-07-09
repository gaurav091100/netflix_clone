import { useEffect, useState } from 'react';
import { tmdbApi } from '../services/tmdbApi';
import MovieRow from './MovieRow';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const RecentlyAdded = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentContent, setRecentContent] = useState({
    trendingToday: [],
    trendingWeek: [],
    recentMovies: [],
    recentTVShows: [],
    newReleases: [],
  });

  useEffect(() => {
    const fetchRecentContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current date and a month ago
        const today = new Date();
        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        const dateString = lastMonth.toISOString().split('T')[0];

        const [trendingToday, trendingWeek, recentMovies, recentTVShows, newReleases] = await Promise.all([
          tmdbApi.getTrending('all', 'day'),
          tmdbApi.getTrending('all', 'week'),
          tmdbApi.discoverMovies({ 
            'primary_release_date.gte': dateString,
            sort_by: 'primary_release_date.desc'
          }),
          tmdbApi.discoverTVShows({ 
            'first_air_date.gte': dateString,
            sort_by: 'first_air_date.desc'
          }),
          tmdbApi.getMovies('now_playing'),
        ]);

        setRecentContent({
          trendingToday: trendingToday.data.results,
          trendingWeek: trendingWeek.data.results,
          recentMovies: recentMovies.data.results,
          recentTVShows: recentTVShows.data.results,
          newReleases: newReleases.data.results,
        });
      } catch (err) {
        console.error('Error fetching recent content:', err);
        setError('Failed to load recent content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentContent();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Recently Added</h1>
          <p className="text-gray-400">Stay up to date with the latest additions</p>
        </div>
        
        <div className="space-y-8 pb-8">
          <MovieRow title="Trending Today" movies={recentContent.trendingToday} />
          <MovieRow title="Trending This Week" movies={recentContent.trendingWeek} />
          <MovieRow title="New Movie Releases" movies={recentContent.recentMovies} />
          <MovieRow title="New TV Shows" movies={recentContent.recentTVShows} />
          <MovieRow title="Now in Theaters" movies={recentContent.newReleases} />
        </div>
      </div>
    </div>
  );
};

export default RecentlyAdded;
