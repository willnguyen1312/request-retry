import { retryRequest } from '../src';

const asyncMock = () => Promise.resolve('Testing');

describe('retryRequest', () => {
  it('should work', async () => {
    const result = await retryRequest<string, string>(() => asyncMock(), {
      numOfAttempts: 3,
    });
    expect(result.result).toBe('Testing');
  });
});
