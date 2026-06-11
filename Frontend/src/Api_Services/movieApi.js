import API from "./Axios";


export const getTrendingMovies = () =>
  API.get("/api/movies/trending");

export const searchMovies = (query) =>
  API.get(`/api/movies/search?query=${query}`);

export const getMovieDetails = (id) =>
  API.get(`/api/movies/movie/${id}`);

export const getMovieCast = (id) =>
  API.get(`/api/movies/movie/${id}/cast`);

export const getMovieTrailer = (id) =>
  API.get(`/api/movies/movie/${id}/trailer`);

export const getSimilarMovies = (id) =>
  API.get(`/api/movies/movie/${id}/similar`);