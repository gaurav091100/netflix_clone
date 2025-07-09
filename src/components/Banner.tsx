/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Play, Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMyList } from '../context/MyListContext';
import { getImageUrl } from '../services/tmdbApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';


interface BannerProps {
  movie: any;
}

const Banner: React.FC<BannerProps> = ({ movie }) => {
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();
  const navigate = useNavigate();

  const handleMyListToggle = () => {
    if (isInMyList(movie.id)) {
      removeFromMyList(movie.id);
      toast(`${movie.title || movie.name} has been removed from your list.`);
    } else {
      addToMyList({
        ...movie,
        media_type:movie.media_type || 'movie'
      });
      toast(`${movie.title || movie.name} has been added to your list.`);
    }
  };

  const handleMoreInfo = () => {
    const mediaType = movie.media_type || 'movie';
    navigate(`/${mediaType}/${movie.id}`);
  };

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getImageUrl(movie.backdrop_path || movie.poster_path, 'original')})`,
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {movie.title || movie.name}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 line-clamp-3">
              {movie.overview}
            </p>
            
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span className="bg-yellow-600 text-black px-2 py-1 rounded font-bold">
                ★ {movie.vote_average?.toFixed(1)}
              </span>
              <span>
                {movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}
              </span>
            </div>
            
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
                {isInMyList(movie.id) ? (
                  <>
                    <Plus className="mr-2 h-5 w-5 rotate-45" />
                    Remove from List
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    My List
                  </>
                )}
              </Button>
              
              <Button 
                size="lg" 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={handleMoreInfo}
              >
                <Info className="mr-2 h-5 w-5" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
