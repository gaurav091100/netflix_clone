
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: 'movie' | 'tv';
}

interface MyListContextType {
  myList: MediaItem[];
  addToMyList: (item: MediaItem) => void;
  removeFromMyList: (id: number) => void;
  isInMyList: (id: number) => boolean;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export const MyListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myList, setMyList] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('netflix-mylist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('netflix-mylist', JSON.stringify(myList));
  }, [myList]);

  const addToMyList = (item: MediaItem) => {
    setMyList(prev => prev.some(i => i.id === item.id) ? prev : [...prev, item]);
  };

  const removeFromMyList = (id: number) => {
    setMyList(prev => prev.filter(item => item.id !== id));
  };

  const isInMyList = (id: number) => {
    return myList.some(item => item.id === id);
  };

  return (
    <MyListContext.Provider value={{ myList, addToMyList, removeFromMyList, isInMyList }}>
      {children}
    </MyListContext.Provider>
  );
};


// export const MyListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [myList, setMyList] = useState<MediaItem[]>([]);

//   useEffect(() => {
//     const saved = localStorage.getItem('netflix-mylist');
//     if (saved) {
//       setMyList(JSON.parse(saved));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('netflix-mylist', JSON.stringify(myList));
//   }, [myList]);

//   const addToMyList = (item: MediaItem) => {
//     setMyList(prev => [...prev, item]);
//   };

//   const removeFromMyList = (id: number) => {
//     setMyList(prev => prev.filter(item => item.id !== id));
//   };

//   const isInMyList = (id: number) => {
//     return myList.some(item => item.id === id);
//   };

//   return (
//     <MyListContext.Provider value={{ myList, addToMyList, removeFromMyList, isInMyList }}>
//       {children}
//     </MyListContext.Provider>
//   );
// };

// eslint-disable-next-line react-refresh/only-export-components
export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error('useMyList must be used within MyListProvider');
  }
  return context;
};
