// Mock API delay to simulate real network requests
const API_DELAY = 300;

export const simulateDelay = (ms: number = API_DELAY) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Generic mock API response wrapper
export const mockApiResponse = async <T>(data: T, delay?: number): Promise<T> => {
  await simulateDelay(delay);
  return data;
};

// Error simulation (5% chance)
export const maybeThrowError = (message: string = "API Error") => {
  if (Math.random() < 0.05) {
    throw new Error(message);
  }
};