import { Request } from "express";
import { ApiResponse } from "../../utils/response.utils";
import {
  UserdetailsRepository,
  UserRepository,
} from "../../repositories/user.repository";
import { RoleRepository } from "../../repositories/role.repository";
import { Permissions } from "../../utils/common.utils";
import { Types } from "mongoose";
import { generateOTP } from "../../utils/otp.util";
import { sendOtpEmail } from "../../utils/mail.util";
import { User } from "../../models/user.model";

// Initialize repository instances for database operations
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const userdetailsRepository = new UserdetailsRepository();

/**
 * Service to register a new user.
 * Only accessible to logged-in users with roles 'SUPER ADMIN' or 'ADMIN'.
 * Validates input, ensures unique email/mobile, sends OTP email, creates user and userDetails.
 */
export const registerUserService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    // Ensure user is authenticated and authorized
    const userId = req.user?._id;
    if (!userId) {
      return {
        httpStatus: 500,
        message: "Please login to add people.",
        error: "User not authenticated",
        data: null,
      };
    }

    // Verify that user role permits adding people
    const userRoleName = req.user?.roleId?.name;
    if (userRoleName !== "SUPER ADMIN" && userRoleName !== "ADMIN") {
      return {
        httpStatus: 403,
        message: "Forbidden: You do not have permission to add a people.",
        error: "Insufficient role permissions",
        data: null,
      };
    }

    const { email, role, firstName, lastName, mobileNumber, designation } = req.body;

    // Validate required fields and roles
    const errors: string[] = [];
    const allowedRoles = ["ADMIN", "EMPLOYEE", "CUSTOMER"];

    if (!email) errors.push("Email is required.");
    if (!role) {
      errors.push("Role is required.");
    } else if (!allowedRoles.includes(role)) {
      errors.push(`Invalid role: ${role}. Role must be one of ${allowedRoles.join(", ")}.`);
    }
    if (!firstName) errors.push("First name is required.");
    if (!mobileNumber) errors.push("Mobile number is required.");

    // Basic format validation for email and mobile number
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
      errors.push("Email format is invalid.");
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (mobileNumber && !mobileRegex.test(mobileNumber)) {
      errors.push("Mobile number format is invalid. It must be exactly 10 digits.");
    }

    if (errors.length > 0) {
      // Return all validation errors collectively
      return {
        httpStatus: 400,
        message: errors.join("; "),
        data: null,
        error: errors.join("; "),
      };
    }

    // Check for uniqueness of email
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return {
        httpStatus: 409,
        message: "Email already registered",
        data: null,
        error: "User with this email already exists.",
      };
    }

    // Check for uniqueness of mobile number
    const existingMobile = await userdetailsRepository.findUserDetailsByMobile(mobileNumber);
    if (existingMobile) {
      return {
        httpStatus: 409,
        message: "Mobile number already registered.",
        data: null,
        error: "Mobile already exists.",
      };
    }

    // Generate a 6-digit OTP for verification
    const otpPin = generateOTP(6);

    // Send OTP to user's email asynchronously
    await sendOtpEmail(email, otpPin);

    // Ensure the role document exists, create if missing and allowed
    let roleDoc = await roleRepository.findRoleByName(role);
    if (!roleDoc && ["ADMIN", "EMPLOYEE", "CUSTOMER"].includes(role)) {
      roleDoc = await roleRepository.create({
        name: role,
        permissions: [
          Permissions.CREATE,
          Permissions.READ,
          Permissions.DELETE,
          Permissions.UPDATE,
        ],
      });
    }

    // Create userDetails document
    const userDetails = await userdetailsRepository.createUserDetails({
      name: { first: firstName, last: lastName },
      mobileNumber,
      designation,
    });

    // Create the user record linked with role and userDetails
    const newUser = await userRepository.createUser({
      email,
      otpPin,
      roleId: roleDoc?._id as Types.ObjectId,
      detailsId: userDetails._id as Types.ObjectId,
      isActive: true,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    // Link the userDetails record back to user
    await userdetailsRepository.linkUserToDetails(
      userDetails._id as string,
      newUser._id as string
    );

    // Success response with minimal user info
    return {
      httpStatus: 201,
      message: "User registered successfully. OTP sent to registered email.",
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          role: role,
        },
        userDetails,
      },
      error: null,
    };
  } catch (error: any) {
    console.error("Register error:", error);
    return {
      httpStatus: 500,
      message: "Error during registration",
      error: error.message,
      data: null,
    };
  }
};

/**
 * Service to fetch all users along with their detailed info.
 * Only accessible to authenticated users.
 * Joins users and userDetails collections.
 */
export const getUsersWithDetailsService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    // Check authentication
    const userId = req.user?._id;
    if (!userId) {
      return {
        httpStatus: 401,
        message: "Please login to fetch users.",
        error: "User not authenticated",
        data: null,
      };
    }

    // Aggregate users and userDetails with a MongoDB lookup
    const users = await User.aggregate([
      {
        $lookup: {
          from: "userdetails", // Collection name to join
          localField: "_id",
          foreignField: "userId",
          as: "details",
        },
      },
      {
        $unwind: {
          path: "$details",
          preserveNullAndEmptyArrays: true, // Include users even if no details
        },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          roleId: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          "details.name": 1,
          "details.mobileNumber": 1,
          "details.designation": 1,
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort by newest users first
      },
    ]);

    return {
      httpStatus: 200,
      message: "Users fetched successfully.",
      error: null,
      data: users,
    };
  } catch (error: any) {
    console.error("Error fetching users with details:", error);
    return {
      httpStatus: 500,
      message: "Failed to fetch users.",
      error: error.message || "Internal server error",
      data: null,
    };
  }
};
