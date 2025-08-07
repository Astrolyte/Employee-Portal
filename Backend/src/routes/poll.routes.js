import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { closePoll, createPoll, deletePoll, getAllPolls, getPollById, getVotedPolls, voteOnPoll } from "../controllers/poll.controller.js";

const router = express.Router();

router.route("/create").post(verifyJWT,createPoll);
router.route("/getAllPolls").get(verifyJWT,getAllPolls);
router.route("/votedPolls").get(verifyJWT,getVotedPolls);
router.route("/:id").get(verifyJWT,getPollById);
router.route("/:id/vote").post(verifyJWT,voteOnPoll);
router.route("/:id/close").post(verifyJWT,closePoll);
router.route("/:id/delete").delete(verifyJWT,deletePoll);
export default router 