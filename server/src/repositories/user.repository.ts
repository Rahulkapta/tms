import { User, IUser } from '../models/user.model';
import { Types } from 'mongoose';
import { IUserDetails, UserDetails } from '../models/userDetails.model';

export class UserRepository {
    // Create a new user
    async createUser(userData: Partial<IUser>) {
        return User.create(userData);
    }

    // Find user by ID
    async findById(id: Types.ObjectId) {
        return User.findById(id).populate("roleId").select("-otpPin");
    }

    // Find user by email
    async findByEmail(email: string) {
        return User.findOne({ email });
    }
    


    // Get all users
    async findAll() {
        return User.find();
    }

    // Update user
    async update(id: Types.ObjectId, updateData: Partial<IUser>) {
        return User.findByIdAndUpdate(id, updateData, { new: true });
    }

    // Delete user
    async delete(id: Types.ObjectId) {
        return User.findByIdAndDelete(id);
    }
} 

export class UserdetailsRepository {

     // Create a new userdetail
    async createUserDetails(userData: Partial<IUserDetails>) {
        return UserDetails.create(userData);
    }


    // Find user by mobileNUmber
    async findUserDetailsByMobile(mobileNumber: string) {
        return UserDetails.findOne({ mobileNumber });
    }

     async linkUserToDetails(detailsId: string, userId: string) {
    return UserDetails.findByIdAndUpdate(detailsId, { userId });
  }


}