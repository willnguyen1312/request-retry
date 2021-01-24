export interface RetryRequestOptions {
  numOfAttempts?: number;
  shouldRetry?: (context: { currentAttemp: number; error: any }) => boolean;
}

interface RequestReturnType<T = unknown, P = unknown> {
  result: T | undefined;
  error: P | undefined;
}

export async function retryRequest<T = unknown, P = unknown>(
  request: () => Promise<T>,
  options: RetryRequestOptions = {}
): Promise<RequestReturnType<T, P>> {
  const { numOfAttempts = 3, shouldRetry = () => true } = options;

  let currentAttemp = 0;
  let continueRetry = true;
  let result = undefined;
  let error = undefined;

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
