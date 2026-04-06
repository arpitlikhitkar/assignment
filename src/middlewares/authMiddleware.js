const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { UnauthorizedError } = require("../utils/appError");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    console.log(token);

    if (!token) {
      throw new UnauthorizedError("Token missing or invalid");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new UnauthorizedError("User linked to token was not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
};
