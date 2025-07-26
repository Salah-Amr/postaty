import jwt from "jsonwebtoken";
import { userModel } from "../../../database/models/user.model.js";
import bcrypt from "bcrypt";

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userModel.findOne({ email });
        
        if (user) return res.status(200).json({ message: "User already exists!" });
        const hash = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
        await userModel.insertOne({ name, email, password: hash });

        return res.status(201).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            const { name, email, _id } = user;
            const signToken = jwt.sign({ name, email, _id }, process.env.JWT_SIGN);

            return res.status(200).json({ message: "success", signToken });
        }
        return res.status(400).json({ message: "Invalid email or password" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

export { signup, signin };