const { StatusCodes } = require("http-status-codes");
const { AppError } = require("../utils/appError");

const notFound = (req, res, next) => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, StatusCodes.NOT_FOUND);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = error.message || "Something went wrong";

  if (error.name === "CastError") {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Invalid resource id";
  }

  if (error.code === 11000) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = `${Object.keys(error.keyValue).join(", ")} already exists`;
  }

  if (error.name === "ValidationError") {
    statusCode = StatusCodes.BAD_REQUEST;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (!(error instanceof AppError)) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: error.details || null,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
