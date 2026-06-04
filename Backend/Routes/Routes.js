import { register,login} from "../Controller/Controller.js";
import express, { Router } from "express";
import verifyToken from "../Middleware/authMiddleware.js";

const Routes = express.Router();

Routes.post("/register",verifyToken,register);
Routes.post("/login",verifyToken,login);

export default Routes;