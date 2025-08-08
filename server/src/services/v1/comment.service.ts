import { Request } from "express";
import { Types } from "mongoose";
import { ApiResponse } from "../../utils/response.utils";
import { TicketRepository } from "../../repositories/ticket.repository"; // for existence check
import { CommentRepository } from "../../repositories/comment.repository";
import { NotificationRepository } from "../../repositories/notification.repository";
const commentRepository = new CommentRepository();

const ticketRepository = new TicketRepository();
const notificationRepository = new NotificationRepository();


export const addCommentService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    const user = req.user;
    const { ticketId } = req.params;

    // 1. Validate user and ticketId presence
    if (!user?._id || !Types.ObjectId.isValid(user._id)) {
      return {
        httpStatus: 401,
        message: "Unauthorized: User not authenticated.",
        error: "Unauthorized",
        data: null,
      };
    }
    if (!ticketId || !Types.ObjectId.isValid(ticketId)) {
      return {
        httpStatus: 400,
        message: "Invalid or missing ticketId.",
        error: "Validation error",
        data: null,
      };
    }

    // 2. Ensure ticket exists (optional but best practice)
    const ticketExists = await ticketRepository.findTaskById(ticketId);
    if (!ticketExists) {
      return {
        httpStatus: 404,
        message: "Ticket not found.",
        error: "Ticket not found",
        data: null,
      };
    }

    // 3. Extract comment data from body
    const { text, attachments } = req.body;
    if (!text) {
      return {
        httpStatus: 400,
        message: "Comment text is required.",
        error: "Validation error",
        data: null,
      };
    }

    // 4. Create new Comment document
    const comment = await commentRepository.addComment({
      ticketId: new Types.ObjectId(ticketId),
      authorId: user._id,
      text,
      attachments: Array.isArray(attachments) ? attachments : [],
      createdBy: user._id,
      updatedBy: user._id,
    });

      // 🎯 CREATE NOTIFICATIONS AFTER PROJECT UPDATION
    const notification = await notificationRepository.create({
      userId: user._id,
      title: "Added Comment",
      message: `A comment "${comment.text}" has been added to ${ticketExists.title}.`,
      type: "comment_added",
      data: {
        ticketExists,
        comment
      },
    });

    console.log(notification);
    

    return {
      httpStatus: 201,
      message: "Comment added successfully.",
      error: null,
      data: { comment },
    };
  } catch (error: any) {
    console.error("Error creating comment:", error);
    return {
      httpStatus: 500,
      message: "Error creating comment.",
      error: error.message,
      data: null,
    };
  }
};

export const getCommentsByTaskService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    const user = req.user;
    if (!user?._id) {
      return {
        httpStatus: 401,
        message: "Unauthorized: User not authenticated.",
        error: "Unauthorized",
        data: null,
      };
    }
    const { ticketId } = req.params;

    // Validate ticketId presence and format
    if (!ticketId || !Types.ObjectId.isValid(ticketId)) {
      return {
        httpStatus: 400,
        message: "Invalid or missing ticketId in URL.",
        error: "Validation error",
        data: null,
      };
    }

    // Check if the ticket exists
    const ticketExists = await ticketRepository.findTaskById(ticketId);
    if (!ticketExists) {
      return {
        httpStatus: 404,
        message: "Ticket not found.",
        error: "Not Found",
        data: null,
      };
    }
    

    // Fetch all comments linked to this ticketId
    const comments = await commentRepository.findByTicketId(ticketId);
    
    // Return error if no comments found
    if (!comments) {
      return {
        httpStatus: 404,
        message: "No comments found for this ticket.",
        error: "Not Found",
        data: null,
      };
    }
    return {
      httpStatus: 200,
      message: "Comments fetched successfully.",
      error: null,
      data: { comments },
    };
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return {
      httpStatus: 500,
      message: "Error fetching comments.",
      error: error.message,
      data: null,
    };
  }
};

export const deleteCommentService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    const user = req.user;
    const userRole = user?.roleId?.name;
    const userId = user?._id;
    const { commentId } = req.params;

    // Validate params and authentication
    if (!userId) {
      return {
        httpStatus: 401,
        message: "Unauthorized: User not authenticated.",
        error: "Unauthorized",
        data: null,
      };
    }
    if (!commentId || !Types.ObjectId.isValid(commentId)) {
      return {
        httpStatus: 400,
        message: "Invalid or missing commentId.",
        error: "Validation error",
        data: null,
      };
    }

    // Find the comment to be deleted
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      return {
        httpStatus: 404,
        message: "Comment not found.",
        error: "Not Found",
        data: null,
      };
    }

    // Authorization: SUPER ADMIN, ADMIN, or comment author can delete
    const isSuperAdmin = userRole === "SUPER ADMIN";
    const isAdmin = userRole === "ADMIN";
    const isCommentAuthor =
      comment.authorId?.toString() === userId.toString() ||
      comment.createdBy?.toString() === userId.toString();

    if (!isSuperAdmin && !isAdmin && !isCommentAuthor) {
      return {
        httpStatus: 403,
        message: "Forbidden: You do not have permission to delete this comment.",
        error: "Insufficient permissions",
        data: null,
      };
    }

    // Perform the deletion
    const deleted = await commentRepository.deleteById(commentId);
    if (!deleted) {
      return {
        httpStatus: 404,
        message: "Comment not found or already deleted.",
        error: "Not Found",
        data: null,
      };
    }

    return {
      httpStatus: 200,
      message: "Comment deleted successfully.",
      error: null,
      data: { commentId },
    };
  } catch (error: any) {
    console.error("Error deleting comment:", error);
    return {
      httpStatus: 500,
      message: "Error deleting comment.",
      error: error.message,
      data: null,
    };
  }
};