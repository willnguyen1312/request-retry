export interface RetryRequestOptions {
  numOfAttempts?: number;
  shouldRetry?: (context: { currentAttemp: number; error: any }) => boolean;
}

export type RetryRequest<T> = (
  request: () => Promise<T>,
  options?: RetryRequestOptions
) => Promise<T>;

export async function retryRequest<T, P>(
  request: () => Promise<T>,
  options: RetryRequestOptions = {}
): Promise<{ result: T | null; error: P | null }> {
  const { numOfAttempts = 3, shouldRetry = () => true } = options;

  let currentAttemp = 0;
  let continueRetry = true;
  let result = null;
  let error = null;

  while (continueRetry && currentAttemp < numOfAttempts) {
    try {
      result = await request();
      return { error, result };
    } catch (err) {
      error = err;
      currentAttemp += 1;
      continueRetry = shouldRetry({
        currentAttemp,
        error,
      });
    }
  }

  return { error, result };
}
