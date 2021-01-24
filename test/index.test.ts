import { retryRequest } from '../src';

const asyncMock = () => Promise.resolve(3)

describe('retryRequest', () => {
  it('should work', async () => {
    const { error, result } = await retryRequest(() => asyncMock(), {
      numOfAttempts: 3,
    });
    expect(error).toBe('second failed');
  });
});
