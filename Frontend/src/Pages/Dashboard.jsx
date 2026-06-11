import { useEffect, useState } from "react";
import MovieCard from "../Components/MovieCard";
import SearchBar from "../Components/SearchBar";
import { getTrendingMovies } from "../Api_Services/movieApi";


function Dashboard(){
    const[movies,setMovies] = useState([]);
    useEffect(()=>{
        loadMovies();
    },[]);

    async function loadMovies() {
    try {
      const response =
        await getTrendingMovies();

      setMovies(response.data.results);
    } catch (error) {
      console.log(error);
    }
  }
    async function handleSearch(query) {
    try {
      const response =
        await searchMovies(query);

      setMovies(response.data.results);
    } catch (error) {
      console.log(error);
    }
  }

    return(
     <div className="bg-black min-h-screen p-8">

      <h1 className="text-white text-4xl font-bold mb-8">
        Trending Movies
      </h1>
       <SearchBar
        onSearch={handleSearch}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>

    </div>
    )
}
export default Dashboard;