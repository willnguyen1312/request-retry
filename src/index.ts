export interface RetryRequestOptions {
  numOfAttempts?: number;
  shouldRetry?: (context: { currentAttemp: number; error: any }) => boolean;
}

export type RetryRequest<T> = (
  request: () => Promise<T>,
  options?: RetryRequestOptions
) => Promise<T>;

export async function retryRequest<T>(
  request: () => Promise<T>,
  options: RetryRequestOptions = {}
): Promise<T> {
  const { numOfAttempts = 3, shouldRetry = () => true } = options;

  let currentAttemp = 1;
  let continueRetry = true;

  while (continueRetry && currentAttemp < numOfAttempts) {
    try {
      const result = await request();
      return result;
    } catch (error) {
      currentAttemp += 1;
      continueRetry = shouldRetry({
        currentAttemp,
        error,
      });
    }
  }
  return request();
}
