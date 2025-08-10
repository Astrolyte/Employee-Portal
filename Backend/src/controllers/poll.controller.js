import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Poll } from "../models/poll.model.js";

const createPoll = asyncHandler(async (req, res) => {
  const { question, type, options, creatorId } = req.body;
  console.log("Received poll type:", type);
  if (!question || !type || !creatorId) {
    throw new ApiError(400, "Question,type and creatorId are required");
  }
  let processedOptions = [];
  switch (type) {
    case "single-choice":
      if (!options || options.length < 2) {
        throw new ApiError(
          400,
          "Single-choice poll must have atleast two options."
        );
      }
      processedOptions = options.map((option) => ({ optionText: option }));
      break;

    case "open-ended":
      processedOptions = []; //no options needed for open-ended
      break;
    case "rating":
      processedOptions = [1, 2, 3, 4, 5].map((value) => ({
        optionText: value.toString(),
      }));
      break;
    case "yes/no":
      processedOptions = ["Yes", "No"].map((option) => ({
        optionText: option,
      }));
      break;
    case "image-based":
      if (!options || options.length < 2) {
        throw new ApiError(
          400,
          "Image-based poll must have atleast two options."
        );
      }
      processedOptions = options.map((url, index) => ({
    optionText: `Image option ${index + 1}`,  // some placeholder or description if available
    imageUrl: url,
  }));
  break;
    default:
      throw new ApiError(400, "Invalid poll type");
  }
  const newPoll = await Poll.create({
    question,
    type,
    options: processedOptions,
    creator: creatorId,
  });
  if (!newPoll) {
    throw new ApiError(400, "There was an error in forming the poll");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, "Poll created successfully", newPoll));
});

const getAllPolls = asyncHandler(async (req, res) => {
  const { type, creatorId, page = 1, limit = 10 } = req.query;

  const filter = {};
  const userId = req.user._id;
  if (type) filter.type = type;
  if (creatorId) filter.creator = creatorId;

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  //pagination to fetch polls
  const polls = await Poll.find(filter)
    .populate("creator", "Name email avatar")
    .populate({
      path: "responses.voterId",
      select: "Name Avatar",
    })
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 });

  //add `userHasVoted` flag for each Poll
  const updatedPolls = polls.map((poll) => {
    const userHasVoted = poll.voters.some((voterId) => voterId.equals(userId));
    return {
      ...poll.toObject(),
      userHasVoted,
    };
  });

  //get total count of polls for pagination
  const totalPolls = await Poll.countDocuments(filter);

  const stats = await Poll.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        type: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ]);
  const allTypes = [
    { type: "single-choice", label: "Single Choice" },
    { type: "yes/no", label: "Yes/No" },
    { type: "rating", label: "Rating " },
    { type: "image-based", label: "Image based" },
    { type: "open-ended", label: "Open ended" },
  ];

  const statsWithDefaults = allTypes
    .map((pollType) => {
      const stat = stats.find((item) => item.type === pollType.type);
      return {
        label: pollType.label,
        type: pollType.type,
        count: stat ? stat.count : 0,
      };
    })
    .sort((a, b) => b.count - a.count);

  return res.status(200).json(
    new ApiResponse(200, "Poll data fetched successfully", {
      polls: updatedPolls,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalPolls / pageSize),
      totalPolls,
      stats: statsWithDefaults,
    })
  );
});
const getVotedPolls = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user._id;

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  //finding polls where user has voted
  const polls = await Poll.find({ voters: userId })
    .populate("creator", "Name avatar email")
    .populate({
      path: "responses.voterId",
      select: "Name email",
    })
    .skip(skip)
    .limit(pageSize);

  //for is user has voted or not
  const updatedPolls = polls.map((poll) => {
    const userHasVoted = poll.voters.some((voterId) => voterId.equals(userId));
    return {
      ...poll.toObject(),
      userHasVoted,
    };
  });
  const totalVotedPolls = await Poll.countDocuments({ voters: userId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Votes are fetched successfully", {
        polls: updatedPolls,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalVotedPolls / pageSize),
        totalVotedPolls,
      })
    );
});
const getPollById = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const poll = await Poll.findById(id).populate("creator","Name email");
    if(!poll){
        throw new ApiError(404,"Poll doesnt exist try again");
    }
    return res.status(200).json(new ApiResponse(200,"Poll fetched successfully",poll));
});
const voteOnPoll = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { optionIndex, voterId, responseText } = req.body;

  const poll = await Poll.findById(id);

  if (!poll) {
    throw new ApiError(400, "Poll not found");
  }
  if (poll.closed) {
    throw new ApiError(400, "Poll is closed");
  }
  if (poll.voters.includes(voterId)) {
    throw new ApiError(400, "User has already voted on this poll");
  }

  if (poll.type === "open-ended") {
    if (!responseText) {
      throw new ApiError(
        400,
        "Response text is required for open-ended polls."
      );
    }
    poll.responses.push({ voterId, responseText });
  } else {
    if (
      optionIndex === undefined ||
      optionIndex < 0 ||
      optionIndex >= poll.options.length
    ) {
      throw new ApiError(400, "Inavlid Option Index");
    }
    poll.options[optionIndex].votes += 1;
  }
  poll.voters.push(voterId);
  await poll.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Vote Added successfully", poll));
});
const closePoll = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const userId = req.user.id;

    const poll = await Poll.findById(id);
    if(!poll){
        throw new ApiError(404,"Poll doesnt exist try again");
    }
    if(poll.creator.toString()!== userId){
        throw new ApiError(404,"You're not authorized to close this poll");
    }
    poll.closed = true;
    await poll.save();

    return res.status(200).json(new ApiResponse(200,"Poll closed successfully",poll));
});
const deletePoll = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const userId = req.user.id;

    const poll = await Poll.findById(id);
    if(!poll){
        throw new ApiError(404,"Poll doesnt exist try again");
        }
        if(poll.creator.toString()!== userId){
            throw new ApiError(403,"You are not authorized to delete this");
        }

        await Poll.findByIdAndDelete(id);
        return res.status(200).json(new ApiResponse(200,"Poll deleted successfully"));
});
export {
  createPoll,
  getAllPolls,
  getVotedPolls,
  getPollById,
  voteOnPoll,
  closePoll,
  deletePoll,
};
