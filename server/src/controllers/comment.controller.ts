import { Request, Response } from "express";
import { addCommentService, deleteCommentService, getCommentsByTaskService } from "../services/v1/comment.service";

export const addComment = async (req: Request, res: Response) => {
  try {
    const result = await addCommentService(req);
    res.status(result.httpStatus).json(result);
  } catch (error: any) {
    console.error("Error in addComment:", error);
    res.status(500).json({
      httpStatus: 500,
      message: "Internal Server Error while adding comment",
      error: error.message || "Unknown error",
      data: null,
    });
  }
};

export const getCommentsByTask = async (req: Request, res: Response) => {
  try {
    const result = await getCommentsByTaskService(req);
    res.status(result.httpStatus).json(result);
  } catch (error: any) {
    console.error("Error in getCommentsByTask:", error);
    res.status(500).json({
      httpStatus: 500,
      message: "Internal Server Error while fetching comments",
      error: error.message || "Unknown error",
      data: null,
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const result = await deleteCommentService(req);
    res.status(result.httpStatus).json(result);
  } catch (error: any) {
    console.error("Error in deleteComment:", error);
    res.status(500).json({
      httpStatus: 500,
      message: "Internal Server Error while deleting comment",
      error: error.message || "Unknown error",
      data: null,
    });
  }
};