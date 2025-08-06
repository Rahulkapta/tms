import { NextFunction, Request, Response } from "express";
import { loginUserService } from "../services/v1/auth.service";
import { getUsersWithDetailsService, registerUserService } from "../services/v1/user.service";
import { authCookieOptions } from "../utils/cookie.utils";

/**
 * Controller to handle user registration.
 * Delegates the registration process to the service layer.
 */
export async function registerUser(req: Request, res: Response) {
  try {
    const response = await registerUserService(req);

    // Forward the response from the service as the API response
    return res.status(response.httpStatus).json({
      httpStatus: response.httpStatus,
      message: response.message,
      data: response.data,
      error: response.error,
    });
  } catch (error: any) {
    console.error("Controller Register Error:", error);
    return res.status(500).json({
      message: "Unexpected error during registration.",
      error: error.message || "Internal server error",
      data: null,
    });
  }
}

/**
 * Controller to handle user login with email and OTP.
 * On success, sets an auth cookie with the user's access token.
 */
export async function loginUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Login request received:", req.body);
  const response = await loginUserService(req);

  // If authentication failed or user data not returned, send error response
  if (response.httpStatus !== 200 || !response.data || !response.data.user) {
    return res.status(response.httpStatus).json({
      httpStatus: response.httpStatus,
      message: response.message,
      error: response.error,
      data: null,
    });
  }

  const accessToken = response.data.user.accessToken;

  // Set the access token as an HTTP-only cookie
  return res
    .status(response.httpStatus)
    .cookie("access_token", accessToken, authCookieOptions)
    .json({
      ...response,
      data: {
        ...response.data,
      },
    });
}

/**
 * Controller to fetch all users with their detailed information.
 */
export async function getAllUserWithDetails(req: Request, res: Response) {
  try {
    const response = await getUsersWithDetailsService(req);
    return res.status(response.httpStatus).json({
      httpStatus: response.httpStatus,
      message: response.message,
      error: response.error,
      data: response.data,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
}
