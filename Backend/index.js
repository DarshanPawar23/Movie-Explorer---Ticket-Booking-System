import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Routes from "./Routes/Routes.js"
import MovieRouter from "./Routes/movieRoutes.js";

let port = 4000;
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json())
app.use("/api",Routes)
app.use("/api/movies", MovieRouter);

app.listen(port,()=>{
    console.log(`Server Connected on the port ${port}`);
});
