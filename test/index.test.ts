import { retryRequest } from '../src';

const asyncMock = jest
  .fn()
  .mockRejectedValueOnce('first failed')
  .mockRejectedValueOnce('second failed')
  .mockResolvedValueOnce('second call');

describe('retryRequest', () => {
  it('should work', async () => {
    try {
      const result = await retryRequest<string>(() => asyncMock(), {
        numOfAttempts: 3,
        shouldRetry: (...args) => {
          console.log(args);
          return true;
        },
      });
      expect(result).toBe('second call');
    } catch (error) {
      expect(error).toBe('second failed');
    }
  });
});
