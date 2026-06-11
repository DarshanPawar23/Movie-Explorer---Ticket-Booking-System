import { register,login,getSeats,getShows,createOrGetShow,createOrder,verifyPayment,getMyBookings} from "../Controller/Controller.js";
import express, { Router } from "express";
import verifyToken from "../Middleware/authMiddleware.js";

const Routes = express.Router();

Routes.post("/register",register);
Routes.post("/login",login);
Routes.get("/shows/:movieId",getShows);
Routes.get("/seats/:showId",getSeats);
Routes.post("/create-show",verifyToken,createOrGetShow);

Routes.post("/create-order",verifyToken,createOrder);

Routes.post("/verify-payment",verifyToken,verifyPayment);

Routes.get("/my-bookings",verifyToken,getMyBookings);

export default Routes;