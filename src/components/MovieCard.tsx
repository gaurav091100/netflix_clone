/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Play, Plus, Info, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMyList } from '../context/MyListContext';
import { getImageUrl } from '../services/tmdbApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface MovieCardProps {
  movie: any;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();
  const navigate = useNavigate();

  const handleMyListToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isInMyList(movie.id)) {
      removeFromMyList(movie.id);
      toast(`${movie.title || movie.name} has been removed from your list.`);
    } else {
      addToMyList({
        ...movie,
        media_type: movie.media_type || 'movie'
      });
      toast(`${movie.title || movie.name} has been added to your list.`);
    }
  };

  const handleMoreInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
    navigate(`/${mediaType}/${movie.id}`);
  };

  return (
    <div className="group relative w-48 md:w-64 cursor-pointer">
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 transition-transform duration-300 hover:scale-105">
        {!imageError ? (
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title || movie.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">🎬</div>
              <div className="text-sm px-2">No Image</div>
            </div>
          </div>
        )}
        
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button size="sm" className="bg-white text-black hover:bg-gray-200 cursor-pointer rounded-full h-8 w-8 md:h-10 md:w-10">
              <Play className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              className="bg-gray-500/70 text-white hover:bg-gray-500 cursor-pointer rounded-full h-8 w-8 md:h-10 md:w-10"
              onClick={handleMyListToggle}
            >
              {isInMyList(movie.id) ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 cursor-pointer rounded-full h-8 w-8 md:h-10 md:w-10"
              onClick={handleMoreInfo}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Movie Info */}
      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-medium text-white truncate">
          {movie.title || movie.name}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}
          </span>
          <span className="flex items-center">
            ★ {movie.vote_average?.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
