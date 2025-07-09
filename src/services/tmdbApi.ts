/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const tmdbApi = {
  // Movies
  getMovies: (type: string) => api.get(`/movie/${type}`),
  getMovieDetails: (id: string) => api.get(`/movie/${id}`),
  getMovieCredits: (id: string) => api.get(`/movie/${id}/credits`),
  
  // TV Shows
  getTVShows: (type: string) => api.get(`/tv/${type}`),
  getTVDetails: (id: string) => api.get(`/tv/${id}`),
  getTVCredits: (id: string) => api.get(`/tv/${id}/credits`),
  
  // Search
  searchMulti: (query: string) => api.get(`/search/multi?query=${encodeURIComponent(query)}`),
  
  // Genres
  getMovieGenres: () => api.get('/genre/movie/list'),
  getTVGenres: () => api.get('/genre/tv/list'),
  
  // Trending
  getTrending: (mediaType: string = 'all', timeWindow: string = 'day') => 
    api.get(`/trending/${mediaType}/${timeWindow}`),
    
  // Discover
  discoverMovies: (params: any = {}) => api.get('/discover/movie', { params }),
  discoverTVShows: (params: any = {}) => api.get('/discover/tv', { params }),
};

export const getImageUrl = (path: string, size: string = 'w500') => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder.svg';
};
