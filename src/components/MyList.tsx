import { useMyList } from '../context/MyListContext';
import MovieCard from './MovieCard';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MyList = () => {
  const { myList, removeFromMyList } = useMyList();

  if (myList.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">My List</h1>
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl text-gray-400 mb-4">Your list is empty</h2>
            <p className="text-gray-500 max-w-md">
              Add movies and TV shows to your list by clicking the "+" button when browsing content
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">My List</h1>
            <p className="text-gray-400">{myList.length} items in your list</p>
          </div>
          
          {myList.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your entire list?')) {
                  myList.forEach(item => removeFromMyList(item.id));
                }
              }}
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-8">
          {myList.map((item) => (
            <div key={item.id} className="relative">
              <MovieCard movie={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyList;
