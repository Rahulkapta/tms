import { Types } from "mongoose";
import { ITicket, Ticket } from "../models/ticket.model";

export class TicketRepository {
  async createTask(taskData: Partial<ITicket>) {
    return Ticket.create(taskData);
  }
  async deleteManyByProjectId(projectId: string) {
    return Ticket.deleteMany({ projectId: new Types.ObjectId(projectId) });
  }

  async findByTitleAndProject(title: string, projectId: string) {
    return Ticket.findOne({ title, projectId });
  }

  async findAllTask(projectId: string) {
    return Ticket.find({projectId});
  }

  async findTaskById(taskId: string) {
    return Ticket.findById(taskId);
  }
 
  async deleteTaskById(taskId: string) {
    return Ticket.findByIdAndDelete(taskId);
  }

  async updateTaskById(_id: string, updateData: any) {
    return Ticket.findByIdAndUpdate(_id, { $set: updateData }, { new: true });
  }
}
