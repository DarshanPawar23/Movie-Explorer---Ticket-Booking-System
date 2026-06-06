import { register,login} from "../Controller/Controller.js";
import express, { Router } from "express";
import verifyToken from "../Middleware/authMiddleware.js";

const Routes = express.Router();

Routes.post("/register",register);
Routes.post("/login",login);

export default Routes;