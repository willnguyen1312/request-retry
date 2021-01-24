import { retryRequest } from '../src';

const asyncMock = jest
  .fn()
  .mockRejectedValueOnce('first failed')
  .mockRejectedValueOnce('second failed')
  .mockResolvedValueOnce('second call')
  .mockRejectedValue('Test');

describe('retryRequest', () => {
  it('should work', async () => {
    const { error } = await retryRequest<string, string>(() => asyncMock(), {
      numOfAttempts: 3,
    });
    expect(error).toBe('second failed');
  });
});
