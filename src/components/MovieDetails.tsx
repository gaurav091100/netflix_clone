/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdbApi, getImageUrl } from '../services/tmdbApi';
import { Play, Plus, ArrowLeft, Star, Calendar, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMyList } from '../context/MyListContext';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { toast } from 'sonner';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();
  

  // Determine if this is a movie or TV show based on URL path
  const isMovie = location.pathname.includes('/movie/');
  const mediaType = isMovie ? 'movie' : 'tv';

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const [detailsResponse, creditsResponse] = await Promise.all([
          isMovie ? tmdbApi.getMovieDetails(id) : tmdbApi.getTVDetails(id),
          isMovie ? tmdbApi.getMovieCredits(id) : tmdbApi.getTVCredits(id),
        ]);

        setDetails(detailsResponse.data);
        setCredits(creditsResponse.data);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to load details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, isMovie]);

  const handleMyListToggle = () => {
    if (!details) return;

    const mediaItem = {
      ...details,
      media_type: mediaType,
    };

    if (isInMyList(details.id)) {
      removeFromMyList(details.id);
      toast(`${details.title || details.name} has been removed from your list.`);
    } else {
      addToMyList(mediaItem);
      toast(`${details.title || details.name} has been added to your list.`);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!details) return <ErrorMessage message="Content not found" onRetry={() => navigate('/')} />;

  const director = credits?.crew?.find((person: any) => person.job === 'Director');
  const cast = credits?.cast?.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${getImageUrl(details.backdrop_path || details.poster_path, 'original')})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 text-white hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                {details.title || details.name}
              </h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span className="flex items-center bg-yellow-600 text-black px-2 py-1 rounded font-bold">
                  <Star className="mr-1 h-4 w-4" />
                  {details.vote_average?.toFixed(1)}
                </span>
                <span className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {details.release_date?.split('-')[0] || details.first_air_date?.split('-')[0]}
                </span>
                {details.runtime && (
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                  </span>
                )}
              </div>
              
              <p className="text-lg text-gray-200 leading-relaxed">
                {details.overview}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  Play
                </Button>
                
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-gray-500/70 text-white hover:bg-gray-500"
                  onClick={handleMyListToggle}
                >
                  {isInMyList(details.id) ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      In My List
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Add to My List
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Details Section */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            {details.genres && details.genres.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {details.genres.map((genre: any) => (
                    <span key={genre.id} className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {cast.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Cast</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {cast.map((person: any) => (
                    <div key={person.id} className="text-center">
                      <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-gray-800">
                        <img
                          src={getImageUrl(person.profile_path, 'w185')}
                          alt={person.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <h4 className="text-sm font-medium text-white">{person.name}</h4>
                      <p className="text-xs text-gray-400">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {director && (
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Director</h3>
                <p className="text-gray-300">{director.name}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Rating</h3>
              <p className="text-gray-300">{details.vote_average?.toFixed(1)}/10</p>
            </div>
            
            {details.production_companies && details.production_companies.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Production</h3>
                <div className="space-y-1">
                  {details.production_companies.slice(0, 3).map((company: any) => (
                    <p key={company.id} className="text-sm text-gray-300">{company.name}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
