import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() =>
                navigate(`/movie/${movie.id}`)
            }
            className="bg-gray-900 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition"
        >
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-80 object-cover"
            />

            <div className="p-3">
                <h2 className="text-white font-semibold">
                    {movie.title}
                </h2>

                <p className="text-yellow-400">
                    ⭐ {movie.vote_average}
                </p>
            </div>
        </div>
    )
}
export default MovieCard;