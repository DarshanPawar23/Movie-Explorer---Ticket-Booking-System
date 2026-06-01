import express from "express";
import tmdb from "../Services/tmdbService.js";

const router = express.Router();

router.get("/trending",async(req,res)=>{
    try{
      const response = await tmdb.get("/trending/movie/week");
      res.json(response.data);
    }
    catch(error){
     res.status(500).json({
      message: "Failed to fetch movies"
    });
    }
});

export default router;