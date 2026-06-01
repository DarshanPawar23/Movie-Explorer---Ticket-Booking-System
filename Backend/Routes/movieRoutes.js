import express from "express";
import tmdb from "../Services/tmdbService.js";

const MovieRouter = express.Router();

MovieRouter.get("/trending",async(req,res)=>{
    try{
      const response = await tmdb.get("/trending/movie/week");
      res.json(response.data);
    }
    catch(error){
     return res.status(500).json({
      message: "Failed to fetch movies"
    });
    }
});

MovieRouter.get("/search", async (req, res) => {
  try {
    const { query } = query;
    const response = await tmdb.get(`/search/movie?query=${query}`);
    return res.status(200).json(response.data);
  }
  catch (error) {
    return res.status(500).json({
      message: "Search Failed"
    });
  }
});

MovieRouter.get("/movie/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await tmdb.get(`/movie/${id}`);
    res.status(200).json(response.data);
  }
  catch (error) {
    res.status(500).json({
      message: "Movie Not Found"
    });
  }
});
export default MovieRouter;

