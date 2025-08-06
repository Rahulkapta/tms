import { Router } from "express";
import { verifyJWT } from "../config/middleware/auth.middleware";
import {
  addComment,
  deleteComment,
  getCommentsByTask,
} from "../controllers/comment.controller";
// adjust path

const commentRoutes = Router({ mergeParams: true });

// Route: POST /api/v1/tickets/:ticketId/comments
commentRoutes
  .route("/")
  .post(verifyJWT, addComment)
  .get(verifyJWT, getCommentsByTask);

commentRoutes.route("/:commentId").delete(verifyJWT, deleteComment);

export default commentRoutes;
