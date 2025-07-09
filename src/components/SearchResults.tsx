/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tmdbApi } from '../services/tmdbApi';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) return;

    const searchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdbApi.searchMulti(query);
        setResults(response.data.results.filter((item: any) => 
          item.media_type === 'movie' || item.media_type === 'tv'
        ));
      } catch (err) {
        console.error('Error searching content:', err);
        setError('Failed to search content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    searchContent();
  }, [query]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-400">
              {results.length > 0 
                ? `${results.length} results for "${query}"`
                : `No results found for "${query}"`
              }
            </p>
          )}
        </div>
        
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-8">
            {results.map((item: any) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        ) : query && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl text-gray-400 mb-4">No results found</h2>
            <p className="text-gray-500 max-w-md text-center">
              Try searching with different keywords or check your spelling
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
