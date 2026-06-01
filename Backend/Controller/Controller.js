import db from "../Config/db.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

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