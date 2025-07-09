import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Movies from "./components/Movies";
import TVShows from "./components/TVShows";
import RecentlyAdded from "./components/RecentlyAdded";
import MyList from "./components/MyList";
import SearchResults from "./components/SearchResults";
import MovieDetails from "./components/MovieDetails";
import { MyListProvider } from "./context/MyListContext";
 import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  return (
    <MyListProvider>
      <div className="min-h-screen bg-black text-white">
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tvshows" element={<TVShows />} />
              <Route path="/recent" element={<RecentlyAdded />} />
              <Route path="/mylist" element={<MyList />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/tv/:id" element={<MovieDetails />} />
            </Routes>
          </main>
        </Router>
        <Toaster />
      </div>
    </MyListProvider>
  );
};

export default Index;
