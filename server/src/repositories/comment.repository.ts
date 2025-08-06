import { IComment, Comment } from "../models/comment.model";

export class CommentRepository {
  async addComment(commentData: Partial<IComment>) {
    return Comment.create(commentData);
  }
  async findByTicketId(ticketId: string) {
    return Comment.find({ticketId}).sort({ createdAt: -1 });
  }
  async findById(commentId: string) {
    return Comment.findById(commentId);
  }
  async deleteById(commentId: string) {
    return Comment.findByIdAndDelete(commentId);
  }
}
