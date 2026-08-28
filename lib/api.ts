import axios, { AxiosError } from 'axios';
import { MigrationRequest, AnalysisResponse, ApiError } from './types';

// Configurable base URL for Phase 1 (defaults to relative or env variable)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function analyzeRepository(data: MigrationRequest): Promise<AnalysisResponse> {
  try {
    const response = await axios.post<AnalysisResponse>(`${API_BASE_URL}/api/v1/analyze`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError<{ message?: string; error?: string }>;
      const message =
        axiosErr.response?.data?.message ||
        axiosErr.response?.data?.error ||
        axiosErr.message ||
        'Failed to analyze repository. Please check the URL and try again.';

      throw {
        message,
        code: axiosErr.code,
        status: axiosErr.response?.status,
      } as ApiError;
    }

    throw {
      message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    } as ApiError;
  }
}
