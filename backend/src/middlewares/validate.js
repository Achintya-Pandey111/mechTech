import ApiError from "../utils/ApiError.js";

/**
 * Validates required fields in request body.
 * @param {string[]} requiredFields
 */
export const validateBody = (requiredFields = []) => {
  return (req, res, next) => {
    const missing = [];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === "") {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return next(
        new ApiError(400, `Missing required fields: ${missing.join(", ")}`, missing)
      );
    }

    next();
  };
};

export default {
  validateBody,
};
