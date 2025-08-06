export interface ApiResponse<T> {
    error: string | null;
    message: string;
    data: T | null;
    httpStatus: number;
}

export const createApiResponse = <T>(
    error: string | null,
    message: string,
    data: T | null,
    httpStatus: number
): ApiResponse<T> => {
    return {
        error,
        message,
        data,
        httpStatus
    };
};