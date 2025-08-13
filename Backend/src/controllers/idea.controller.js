import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Idea } from "../models/idea.model.js";

const createIdea = asyncHandler(async (req, res) => {
  const { title, description, priority, isAnonymous, attachments } = req.body;
  const creatorId = req.user._id;
  console.log(attachments.length);
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  let processedAttachments = [];
  if (attachments && attachments.length > 0) {
    processedAttachments = attachments.map((attachment) => ({
      fileName: attachment.fileName || "attachment",
      fileUrl: attachment.fileUrl,
    }));
  }

  const newIdea = await Idea.create({
    title,
    description,
    priority: priority || "medium",
    creator: creatorId,
    attachments: processedAttachments,
    isAnonymous: isAnonymous || false,
  });

  if (!newIdea) {
    throw new ApiError(400, "There was an error in creating the idea");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Idea created successfully", newIdea));
});

const getAllIdeas = asyncHandler(async (req, res) => {
  const { priority, creatorId, page = 1, limit = 10, archived = false } = req.query;

  const filter = {};
  const userId = req.user._id;

  if (priority) filter.priority = priority;
  if (creatorId) filter.creator = creatorId;

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  // Pagination to fetch ideas
  const ideas = await Idea.find(filter)
    .populate("creator", "Name email avatar")
    .populate({
      path: "comments.user",
      select: "Name avatar",
    })
    .populate("likes", "Name avatar")
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 });

  // Add `userHasLiked` flag for each Idea
  const updatedIdeas = ideas.map((idea) => {
    const userHasLiked = idea.likes.some((likeUserId) => likeUserId._id.equals(userId));
    return {
      ...idea.toObject(),
      userHasLiked,
    };
  });

  // Get total count of ideas for pagination
  const totalIdeas = await Idea.countDocuments(filter);

  const stats = await Idea.aggregate([
    { $match: { archived: archived === 'true' } },
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(200, "Ideas data fetched successfully", {
      ideas: updatedIdeas,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalIdeas / pageSize),
      totalIdeas,
      stats: stats,
    })
  );
});

const getLikedIdeas = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user._id;

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  // Finding ideas where user has liked
  const ideas = await Idea.find({ likes: userId, archived: false })
    .populate("creator", "Name avatar email")
    .populate({
      path: "comments.user",
      select: "Name email",
    })
    .populate("likes", "Name avatar")
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 });

  // Check if user has liked each idea
  const updatedIdeas = ideas.map((idea) => {
    const userHasLiked = idea.likes.some((likeUserId) => likeUserId._id.equals(userId));
    return {
      ...idea.toObject(),
      userHasLiked,
    };
  });

  const totalLikedIdeas = await Idea.countDocuments({ likes: userId, archived: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Liked ideas fetched successfully", {
        ideas: updatedIdeas,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalLikedIdeas / pageSize),
        totalLikedIdeas,
      })
    );
});

const getIdeaById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const idea = await Idea.findById(id)
    .populate("creator", "Name email avatar")
    .populate("likes", "Name avatar")
    .populate({
      path: "comments.user",
      select: "Name avatar email",
    });

  if (!idea) {
    throw new ApiError(404, "Idea doesn't exist, try again");
  }

  return res.status(200).json(new ApiResponse(200, "Idea fetched successfully", idea));
});

const likeIdea = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const idea = await Idea.findById(id);

  if (!idea) {
    throw new ApiError(404, "Idea not found");
  }

  if (idea.archived) {
    throw new ApiError(400, "Cannot like an archived idea");
  }

  if (idea.likes.includes(userId)) {
    throw new ApiError(400, "User has already liked this idea");
  }

  idea.likes.push(userId);
  await idea.save();

  await idea.populate("likes","Name avatar");

  const userHasLiked = idea.likes.some(likeUserId => likeUserId._id.equals(userId));

  return res
    .status(200)
    .json(new ApiResponse(200, "Idea liked successfully", {
      ...idea.toObject(),
      userHasLiked,
    }));
});

const unlikeIdea = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const idea = await Idea.findById(id);
  if (!idea) throw new ApiError(404, "Idea not found");
  if (!idea.likes.includes(userId)) throw new ApiError(400, "User hasn't liked this idea");

  idea.likes = idea.likes.filter(likeUserId => !likeUserId.equals(userId));
  await idea.save();

  // Populate likes for frontend display
  await idea.populate("likes", "Name avatar");

  // Add `userHasLiked` flag
  const userHasLiked = idea.likes.some(likeUserId => likeUserId._id.equals(userId));

  return res
    .status(200)
    .json(new ApiResponse(200, "Idea unliked successfully", {
      ...idea.toObject(),
      userHasLiked,
    }));
});
const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user._id;
  const user = await User.findById(userId).select('_id Name avatar');
  if (!text) {
    throw new ApiError(400, "Comment text is required");
  }

  const idea = await Idea.findById(id);

  if (!idea) {
    throw new ApiError(404, "Idea not found");
  }

  if (idea.archived) {
    throw new ApiError(400, "Cannot comment on an archived idea");
  }

  idea.comments.push({
    user: {
      _id: user._id,
      Name: user.Name,
      avatar: user.avatar
    },
    text: text,
  });

  await idea.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment added successfully", idea));
});

const updateIdeaStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  const validStatuses = ["pending", "under-review", "approved", "rejected", "implemented"];
  
  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status provided");
  }

  const idea = await Idea.findById(id);
  
  if (!idea) {
    throw new ApiError(404, "Idea doesn't exist, try again");
  }

  // Only creator can update their own idea status
  if (idea.creator.toString() !== userId.toString()) {
    throw new ApiError(403, "You're not authorized to update this idea's status");
  }

  idea.status = status;
  await idea.save();

  return res.status(200).json(new ApiResponse(200, "Idea status updated successfully", idea));
});

const archiveIdea = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const idea = await Idea.findById(id);
  
  if (!idea) {
    throw new ApiError(404, "Idea doesn't exist, try again");
  }

  if (idea.creator.toString() !== userId.toString()) {
    throw new ApiError(403, "You're not authorized to archive this idea");
  }

  idea.archived = true;
  await idea.save();

  return res.status(200).json(new ApiResponse(200, "Idea archived successfully", idea));
});

const deleteIdea = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const idea = await Idea.findById(id);
  
  if (!idea) {
    throw new ApiError(404, "Idea doesn't exist, try again");
  }

  if (idea.creator.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this idea");
  }

  await Idea.findByIdAndDelete(id);
  return res.status(200).json(new ApiResponse(200, "Idea deleted successfully"));
});

export {
  createIdea,
  getAllIdeas,
  getLikedIdeas,
  getIdeaById,
  likeIdea,
  unlikeIdea,
  addComment,
  updateIdeaStatus,
  archiveIdea,
  deleteIdea,
};