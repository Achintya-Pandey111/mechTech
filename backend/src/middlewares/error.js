import ApiError from "../utils/ApiError.js";
import env from "../configs/env.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";
    let errors = [];

    // Prisma Unique Constraint Error
    if (error.code === "P2002") {
      statusCode = 409;
      const target = error.meta?.target ? ` (${error.meta.target.join(", ")})` : "";
      message = `A record with this unique field already exists${target}.`;
    }
    // Prisma Record Not Found Error
    else if (error.code === "P2025") {
      statusCode = 404;
      message = "Requested record was not found.";
    }
    // Prisma Foreign Key Constraint Violation
    else if (error.code === "P2003") {
      statusCode = 400;
      message = "Referenced related entity does not exist.";
    }

    error = new ApiError(statusCode, message, errors, err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(env.NODE_ENV === "development" && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(response);
};

export default errorHandler;
