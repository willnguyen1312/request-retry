interface RetryRequestOptions {
  numOfAttempts?: number;
  shouldRetry?: (context: { currentAttemp: number; error: any }) => boolean;
}

export async function retryRequest<T = unknown, P = unknown>(
  request: () => Promise<T>,
  options: RetryRequestOptions = {}
): Promise<{ result?: T; error?: P }> {
  const { numOfAttempts = 3, shouldRetry = () => true } = options;

  let currentAttemp = 0;
  let continueRetry = true;
  let error;
  let result;

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
