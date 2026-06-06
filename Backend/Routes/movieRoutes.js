import express from "express";
import tmdb from "../Services/tmdbService.js";

const MovieRouter = express.Router();

MovieRouter.get("/trending", async (req, res) => {
  try {
    const response = await tmdb.get("/trending/movie/week");
    res.json(response.data);
  }
  catch (error) {
    return res.status(500).json({
      message: "Failed to fetch movies"
    });
  }
});

MovieRouter.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
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

MovieRouter.get("/movie/:id/cast", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await tmdb.get(`/movie/${id}/credits`);
    res.status(200).json(response.data);
  }
  catch (error) {
    res.status(500).json({
      message: "Cast Not found"
    });
  }
})

MovieRouter.get("/movie/:id/trailer", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await tmdb.get(
      `/movie/${id}/videos`
    );
    const trailer = response.data.results.find((video) =>
      video.site === "YouTube" &&
      video.type === "Trailer");
    res.status(200).json(trailer || null);
  }
  catch (error) {
    res.status(500).json({
      message: "trailer failed to found"
    })
  }
});

MovieRouter.get("/movie/:id/similar", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await tmdb.get(
      `/movie/${id}/similar`
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch similar movies",
    });
  }
});

export default MovieRouter;

