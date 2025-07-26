import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, process.env.JWT_SIGN, (err, decoded) => {
        if (err)
            res.status(401).json({ message: "INVAILID TOKEN" });
        else {
            req.userId = decoded._id;
            next();
        }
    });
}

export { verifyToken };