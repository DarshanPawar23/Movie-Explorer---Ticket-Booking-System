 import db from "../Config/db.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import crypto from "crypto";
import razorpay from "../Config/razorpay.js";

export const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const sql = "select * from user WHERE email = ?"
        db.query(sql, [email], async (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            if (result.length > 0) {
            return res.status(400).json({
                 message: "Email already exists"
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const query2 = "insert into user (email,password) VALUES (?,?)"
            db.query(query2, [email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }

               return res.status(201).json({
                    message: "User Registered"
                });
            })
        })
    }
    catch (error) {
        return res.status(500).json(error);
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let sql = "select*from user where email =?"
        db.query(sql, [email], async(err, result) => {
            if (err) {
                return res.status(400).json({
                    message: "user not found"
                })
            }
            if (result.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid Password"
                });
            }

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

           return res.status(200).json({
                message: "Login Success",
                token
            });
        });
    }
    catch (error) {
        console.log(error);
    }
}

export const getShows = async (req, res) => {
    const { movieId } = req.params;
    try {
        const sql = "select * from shows WHERE movie_id=?"
        db.query(
            sql,
            [movieId],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                return res.status(200).json(result);
            }
        );
    }
    catch (error) {
        return res.status(500).json(error);

    }
}

export const getSeats = async(req,res)=>{
    const { showId } = req.params;
    try{
        const sql =
        "SELECT * FROM seats WHERE show_id = ?";

        db.query(
            sql,
            [showId],
            (err,result)=>{
                if(err){
                    return res.status(500).json(err);
                }
                return res.status(200).json(result);
            }
        );
    }
    catch(error){
        return res.status(500).json(error);
    }
}


export const createOrGetShow = async (req, res) => {

    const {
        movie_id,
        show_date,
        show_time
    } = req.body;

    try {

        const checkQuery = `
        SELECT *
        FROM shows
        WHERE movie_id = ?
        AND show_date = ?
        AND show_time = ?
        `;

        db.query(
            checkQuery,
            [
                movie_id,
                show_date,
                show_time
            ],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                // Show already exists
                if (result.length > 0) {

                    return res.status(200).json({
                        show_id: result[0].id,
                        message: "Show Already Exists"
                    });
                }

                // Create new show
                const insertQuery = `
                INSERT INTO shows
                (
                    movie_id,
                    show_date,
                    show_time
                )
                VALUES
                (
                    ?, ?, ?
                )
                `;

                db.query(
                    insertQuery,
                    [
                        movie_id,
                        show_date,
                        show_time
                    ],
                    (err, insertResult) => {

                        if (err) {
                            return res.status(500).json(err);
                        }

                        const showId =
                            insertResult.insertId;

                        const seats = [];

                        const rows =
                            ["A", "B", "C", "D", "E"];

                        rows.forEach((row) => {

                            for (
                                let i = 1;
                                i <= 10;
                                i++
                            ) {

                                seats.push([
                                    showId,
                                    `${row}${i}`
                                ]);
                            }
                        });

                        const seatQuery = `
                        INSERT INTO seats
                        (
                            show_id,
                            seat_number
                        )
                        VALUES ?
                        `;

                        db.query(
                            seatQuery,
                            [seats],
                            (err) => {

                                if (err) {
                                    return res.status(500)
                                        .json(err);
                                }

                                return res.status(201)
                                    .json({
                                        show_id: showId,
                                        message:
                                            "Show Created With Seats"
                                    });
                            }
                        );
                    }
                );
            }
        );
    }
    catch (error) {

        return res.status(500).json(error);
    }
};

export const createOrder =
async(req,res)=>{

    try{

        const options = {

            amount: 250 * 100,

            currency: "INR",

            receipt:
            `receipt_${Date.now()}`
        };

        const order =
        await razorpay.orders.create(
            options
        );

        return res.status(200)
        .json(order);

    }
    catch(error){

        return res.status(500)
        .json(error);
    }
}

export const verifyPayment = async (req, res) => {

    const {

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature,

        show_id,

        seat_number

    } = req.body;

    const user_id = req.user.id;

    try {

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    razorpay_order_id +
                    "|" +
                    razorpay_payment_id
                )
                .digest("hex");

        if (
            generatedSignature !==
            razorpay_signature
        ) {

            return res.status(400)
                .json({
                    message:
                        "Invalid Payment"
                });
        }

        const seatQuery = `
        SELECT *
        FROM seats
        WHERE show_id = ?
        AND seat_number = ?
        `;

        db.query(
            seatQuery,
            [
                show_id,
                seat_number
            ],
            (err, result) => {

                if (err) {
                    return res.status(500)
                        .json(err);
                }

                if (
                    result.length === 0
                ) {

                    return res.status(404)
                        .json({
                            message:
                                "Seat Not Found"
                        });
                }

                if (
                    result[0].status ===
                    "booked"
                ) {

                    return res.status(400)
                        .json({
                            message:
                                "Seat Already Booked"
                        });
                }

                const updateSeat = `
                UPDATE seats
                SET status='booked'
                WHERE show_id=?
                AND seat_number=?
                `;

                db.query(
                    updateSeat,
                    [
                        show_id,
                        seat_number
                    ],
                    (err) => {

                        if (err) {

                            return res
                                .status(500)
                                .json(err);
                        }

                        const bookingQuery = `
                        INSERT INTO bookings
                        (
                            user_id,
                            show_id,
                            seat_number,
                            payment_status,
                            razorpay_order_id,
                            razorpay_payment_id,
                            razorpay_signature
                        )
                        VALUES
                        (
                            ?,?,?,?,?,?,?
                        )
                        `;
                        db.query(
                            bookingQuery,
                            [
                                user_id,
                                show_id,
                                seat_number,
                                "success",
                                razorpay_order_id,
                                razorpay_payment_id,
                                razorpay_signature
                            ],
                            (err) => {

                                if (err) {

                                    return res
                                        .status(500)
                                        .json(err);
                                }
                                return res
                                    .status(200)
                                    .json({
                                        message:
                                            "Ticket Booked Successfully"
                                    });
                            }
                        );
                    }
                );
            }
        );
    }
    catch (error) {

        return res.status(500)
            .json({
                message:
                    error.message
            });
    }
};

export const getMyBookings = async(req,res)=>{

    const user_id = req.user.id;

    const sql = `
    SELECT *
    FROM bookings
    WHERE user_id = ?
    ORDER BY booked_at DESC
    `;

    db.query(
        sql,
        [user_id],
        (err,result)=>{

            if(err){
                return res.status(500)
                .json(err);
            }

            return res.status(200)
            .json(result);
        }
    );
}