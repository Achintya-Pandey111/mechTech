import ApiResponse from "../utils/ApiResponse.js";
import { getAlumniDirectory } from "../models/alumni.model.js";
import { findUserById } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const listAlumniDirectory = async (req, res, next) => {
  try {
    const { departmentId, graduationYear, company, search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const { alumni, total } = await getAlumniDirectory({
      departmentId,
      graduationYear,
      company,
      search,
      skip,
      take,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          alumni,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Alumni directory retrieved"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const { passwordHash: _, ...safeUser } = user;
    return res.status(200).json(new ApiResponse(200, { user: safeUser }, "User details retrieved"));
  } catch (error) {
    next(error);
  }
};

export default {
  listAlumniDirectory,
  getUserDetails,
};
