/*
Auth Repository for managing user authentication and data operations.
 */
import { User, IUser } from '../models/user.model';
import { Types } from 'mongoose';

export class AuthRepository {
    
    // Find user by email and OTP
    async findByEmailAndOtp(email: string, otpPin: string) {
        return User.findOne({ email, otpPin }).populate('roleId').populate('detailsId');;
    }

    // Create a new user
    async create(userData: Partial<IUser>) {
        return User.create(userData);
    }

    // Find user by ID
    async findById(id: Types.ObjectId) {
        return User.findById(id);
    }

    // Find user by email
    async findByEmail(email: string) {
        return User.findOne({ email });
    }
} 