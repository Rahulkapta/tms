import { Role, IRole } from '../models/role.model';
import { Types } from 'mongoose';

export class RoleRepository {
    // Create a new role
    async create(roleData: Partial<IRole>): Promise<IRole> {
        return Role.create(roleData);
    }

    // Find role by ID
    async findById(id: Types.ObjectId) {
        return Role.findById(id);
    }

    // Find role by name
    async findRoleByName(name: string): Promise<IRole | null>  {
        return Role.findOne({ name });
    }

    // Get all roles
    async findAll() {
        return Role.find();
    }

    // Update role
    async update(id: Types.ObjectId, updateData: Partial<IRole>) {
        return Role.findByIdAndUpdate(id, updateData, { new: true });
    }

    // Delete role
    async delete(id: Types.ObjectId) {
        return Role.findByIdAndDelete(id);
    }
} 