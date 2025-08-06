import { AuthRepository } from "../../repositories/auth.repository";
import { Request } from "express";
import { ApiResponse } from "../../utils/response.utils";


const authRepository = new AuthRepository();

export const loginUserService = async (
  req: Request
): Promise<ApiResponse<any>> => {
  try {
    // Validate request body
    const { email, otpPin } = req.body;
    // Validate email and OTP
    if (!email || !otpPin) {
      throw new Error("Email and pin are required");
    }

    // Find user by email and OTP
    const user = await authRepository.findByEmailAndOtp(email, otpPin);
    if (!user) {
      return {
        httpStatus: 401,
        message: "Login failed, Incorrect email or otpPin",
        data: null,
        error: "User not found or invalid OTP",
      };
    }

     // If role is populated, get name
    const roleName =
      (user.roleId && typeof user.roleId === "object" && "name" in user.roleId)
        ? (user.roleId as any).name
        : "UNKNOWN";

     const accessToken = user.generateAccessToken(roleName); 
    
    // Set login state (for demo, just return user)
    return {
      httpStatus: 200,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          userDetails: user.detailsId,
          role: roleName, // Assuming role is part of the user model
          accessToken: accessToken,
        },
      },
      error: null,
    };
  } catch (error: any) {
    // Handle errors (log, rethrow, etc.)
    console.error("Login error:", error);
    return {
      httpStatus: 400,
      message: error.message || "Login failed",
      error: error.message || "An error occurred during login",
      data: null,
    };
  }
};
