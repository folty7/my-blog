import axios from 'axios';

export const getApiError = (err: unknown, defaultMessage = "Something went wrong") => {
    if (axios.isAxiosError(err)) {
        const backendErrors = err.response?.data?.errors;
        return Array.isArray(backendErrors)
            ? backendErrors[0]
            : (err.response?.data?.error || defaultMessage);
    }
    return 'An unexpected error occurred.';
};
