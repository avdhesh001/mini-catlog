import { formatAED } from './currency';

test('formats AED amounts', () => {
  const out = formatAED(1234.56, 'en');
  expect(typeof out).toBe('string');
  expect(out).toMatch(/AED|د/);
});
