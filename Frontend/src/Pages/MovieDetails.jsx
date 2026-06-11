import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieCard from "../Components/MovieCard";
import {
  getMovieDetails,
  getMovieCast,
  getMovieTrailer,
  getSimilarMovies
} from "../Api_Services/movieApi";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    loadMovie();
  }, []);

  async function loadMovie() {
    try {

      const movieRes =
        await getMovieDetails(id);

      const castRes =
        await getMovieCast(id);

      const trailerRes =
        await getMovieTrailer(id);

      const similarRes =
        await getSimilarMovies(id);

      setMovie(movieRes.data);

      setCast(
        castRes.data.cast.slice(0, 10)
      );

      setTrailer(trailerRes.data);

      setSimilar(
        similarRes.data.results
      );

    } catch (error) {
      console.log(error);
    }
  }

  if (!movie)
    return (
      <h1 className="text-white">
        Loading...
      </h1>
    );

  return (
    <div className="bg-black min-h-screen text-white p-8">

      <h1 className="text-4xl font-bold">
        {movie.title}
      </h1>

      <p className="mt-4">
        {movie.overview}
      </p>

      {trailer && (
        <iframe
          className="w-full h-[500px] mt-8"
          src={`https://www.youtube.com/embed/${trailer.key}`}
          title="Trailer"
        />
      )}

      <h2 className="text-2xl mt-10 mb-4">
        Cast
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        {cast.map((actor) => (
          <div key={actor.id}>
            <p>{actor.name}</p>
          </div>
        ))}

      </div>

      <h2 className="text-2xl mt-10 mb-4">
        Similar Movies
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        {similar.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}

      </div>

    </div>
  );
}
export default MovieDetails;