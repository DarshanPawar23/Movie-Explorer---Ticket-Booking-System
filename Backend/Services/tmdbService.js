import axios from "axios";
console.log("TOKEN =", process.env.Movie_key);
const tmdb = axios.create({
    baseURL : "https://api.themoviedb.org/3",
    headers:{
        Authorization : `Bearer ${process.env.Movie_key}`
    }
    
});

export default tmdb;