import prisma from "../configs/db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
} from "../models/opportunity.model.js";
import {
  createApplication,
  getApplicationsByOpportunity,
  getApplicationsByStudent,
  updateApplicationStatus,
} from "../models/application.model.js";

export const addOpportunity = async (req, res, next) => {
  try {
    if (req.user.role !== "ALUMNI" && req.user.role !== "ADMIN") {
      throw new ApiError(403, "Only alumni can post opportunities");
    }

    const { title, description, company, location, type, deadline } = req.body;

    if (!title || !description || !type) {
      throw new ApiError(400, "Title, description, and type (JOB, INTERNSHIP, OTHER) are required");
    }

    const opportunity = await createOpportunity({
      postedById: req.user.id,
      title: title.trim(),
      description: description.trim(),
      company: company?.trim() || null,
      location: location?.trim() || null,
      type,
      deadline: deadline ? new Date(deadline) : null,
    });

    return res.status(201).json(new ApiResponse(201, { opportunity }, "Opportunity posted"));
  } catch (error) {
    next(error);
  }
};

export const listOpportunities = async (req, res, next) => {
  try {
    const { type, search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const { opportunities, total } = await getAllOpportunities({ type, search, skip, take });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          opportunities,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Opportunities retrieved"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getSingleOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await getOpportunityById(id);

    if (!opportunity) {
      throw new ApiError(404, "Opportunity not found");
    }

    return res.status(200).json(new ApiResponse(200, { opportunity }, "Opportunity retrieved"));
  } catch (error) {
    next(error);
  }
};

export const editOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await getOpportunityById(id);

    if (!opportunity) {
      throw new ApiError(404, "Opportunity not found");
    }

    if (opportunity.postedById !== req.user.id && req.user.role !== "ADMIN") {
      throw new ApiError(403, "Not authorized to edit this opportunity");
    }

    const { title, description, company, location, type, deadline } = req.body;
    const data = {};
    if (title) data.title = title.trim();
    if (description) data.description = description.trim();
    if (company !== undefined) data.company = company?.trim() || null;
    if (location !== undefined) data.location = location?.trim() || null;
    if (type) data.type = type;
    if (deadline !== undefined) data.deadline = deadline ? new Date(deadline) : null;

    const updated = await updateOpportunity(id, data);
    return res.status(200).json(new ApiResponse(200, { opportunity: updated }, "Opportunity updated"));
  } catch (error) {
    next(error);
  }
};

// Lecture 12 Showcase: A clean, easy-to-explain 2-step Database Transaction
export const removeOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await getOpportunityById(id);

    if (!opportunity) {
      throw new ApiError(404, "Opportunity not found");
    }

    if (opportunity.postedById !== req.user.id && req.user.role !== "ADMIN") {
      throw new ApiError(403, "Not authorized to delete this opportunity");
    }

    // Single simple transaction: delete applications then delete opportunity (Atomicity)
    await prisma.$transaction([
      prisma.application.deleteMany({ where: { opportunityId: id } }),
      prisma.opportunity.delete({ where: { id } }),
    ]);

    return res.status(200).json(new ApiResponse(200, null, "Opportunity deleted"));
  } catch (error) {
    next(error);
  }
};

// Applications (Many-to-Many junction between User & Opportunity)
export const applyForOpportunity = async (req, res, next) => {
  try {
    if (req.user.role !== "STUDENT") {
      throw new ApiError(403, "Only students can apply for opportunities");
    }

    const { id: opportunityId } = req.params;
    const { resumeUrl } = req.body;

    const opportunity = await getOpportunityById(opportunityId);
    if (!opportunity) {
      throw new ApiError(404, "Opportunity not found");
    }

    // Check existing application
    const existing = await prisma.application.findUnique({
      where: {
        opportunityId_studentId: {
          opportunityId,
          studentId: req.user.id,
        },
      },
    });

    if (existing) {
      throw new ApiError(409, "You have already applied for this opportunity");
    }

    const application = await createApplication({
      opportunityId,
      studentId: req.user.id,
      resumeUrl: resumeUrl?.trim() || null,
    });

    return res.status(201).json(new ApiResponse(201, { application }, "Application submitted successfully"));
  } catch (error) {
    next(error);
  }
};

export const listOpportunityApplications = async (req, res, next) => {
  try {
    const { id: opportunityId } = req.params;
    const opportunity = await getOpportunityById(opportunityId);

    if (!opportunity) {
      throw new ApiError(404, "Opportunity not found");
    }

    if (opportunity.postedById !== req.user.id && req.user.role !== "ADMIN") {
      throw new ApiError(403, "Not authorized to view applications for this opportunity");
    }

    const applications = await getApplicationsByOpportunity(opportunityId);
    return res.status(200).json(new ApiResponse(200, { applications }, "Applications retrieved"));
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    if (req.user.role !== "STUDENT") {
      throw new ApiError(403, "Only students can view their job applications");
    }

    const applications = await getApplicationsByStudent(req.user.id);
    return res.status(200).json(new ApiResponse(200, { applications }, "Applications retrieved"));
  } catch (error) {
    next(error);
  }
};

export const updateAppStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ["SUBMITTED", "SHORTLISTED", "ACCEPTED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, "Invalid application status");
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { opportunity: true },
    });

    if (!application) {
      throw new ApiError(404, "Application not found");
    }

    if (application.opportunity.postedById !== req.user.id && req.user.role !== "ADMIN") {
      throw new ApiError(403, "Not authorized to update this application");
    }

    const updated = await updateApplicationStatus(applicationId, status);
    return res.status(200).json(new ApiResponse(200, { application: updated }, "Application status updated"));
  } catch (error) {
    next(error);
  }
};

export default {
  addOpportunity,
  listOpportunities,
  getSingleOpportunity,
  editOpportunity,
  removeOpportunity,
  applyForOpportunity,
  listOpportunityApplications,
  getMyApplications,
  updateAppStatus,
};
