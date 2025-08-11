import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { 
  createIdea, 
  getAllIdeas, 
  getLikedIdeas, 
  getIdeaById, 
  likeIdea, 
  unlikeIdea, 
  addComment, 
  updateIdeaStatus, 
  archiveIdea, 
  deleteIdea 
} from "../controllers/idea.controller.js";

const router = express.Router();

router.route("/create").post(verifyJWT, createIdea);
router.route("/getAllIdeas").get(verifyJWT, getAllIdeas);
router.route("/likedIdeas").get(verifyJWT, getLikedIdeas);
router.route("/:id").get(verifyJWT, getIdeaById);
router.route("/:id/like").post(verifyJWT, likeIdea);
router.route("/:id/unlike").post(verifyJWT, unlikeIdea);
router.route("/:id/comment").post(verifyJWT, addComment);
router.route("/:id/status").patch(verifyJWT, updateIdeaStatus);
router.route("/:id/archive").post(verifyJWT, archiveIdea);
router.route("/:id/delete").delete(verifyJWT, deleteIdea);

export default router;