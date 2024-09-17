import jwt from "jsonwebtoken";
import Users from "../model/UserModel.js";

export const authenticateToken = async (req, res, next) => {
  const match = req.cookies.Jwtoken;
  if (!match) {
    return res.redirect("/")
  }
  try {
    const decoded = jwt.verify(match, process.env.JWT_KEY);
    const user = await Users.findById(decoded._id);
    if (!user) {
      return res.json({
        message: "Invalid Token: User Not Found",
        success: false,
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token", success: false });
  }
};



