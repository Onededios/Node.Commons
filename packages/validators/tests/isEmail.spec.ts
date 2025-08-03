import { describe, it, expect } from 'vitest';
import { isEmail } from '../src/isEmail';

describe('isEmail()', () => {
  const validEmails = [
    'test@example.com',
    'user.name+tag+sorting@example.com',
    'user/name=tag@example.com',
  ];
  const invalidEmails = [
    'plainaddress',
    '@missingusername.com',
    'username@.com',
  ];

  it('should validate correct emails', () => {
    validEmails.forEach((email) => expect(isEmail(email)).toBe(true));
  });

  it('should invalidate incorrect emails', () => {
    invalidEmails.forEach((email) => expect(isEmail(email)).toBe(false));
  });
});
