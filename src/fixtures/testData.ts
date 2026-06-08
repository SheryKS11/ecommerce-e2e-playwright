export const TEST_USER = {
  email: 'testuser1_it814@example.com',
  password: 'Test@1234!',
  firstName: 'Test',
  lastName: 'User',
  telephone: '0400000000'
};

export const GUEST_USER = {
  firstName: 'Guest',
  lastName: 'Buyer',
  email: 'guest_it814@example.com',
  telephone: '0411111111',
  address1: '123 Test Street',
  city: 'Melbourne',
  postcode: '3000',
  country: 'Australia',
  region: 'Victoria'
};

export function generateUniqueEmail(): string {
  return `it814_${Date.now()}@example.com`;
}

export const INVALID_CREDENTIALS = {
  email: 'testuser_it814@example.com',
  wrongPassword: 'WrongPass999!'
};

export const LOCKOUT_USER = {
  email: 'lockout_it814@example.com',
  wrongPassword: 'WrongPass9999!'
};

export const SEARCH_TERMS = {
  valid: 'iPhone',
  noResults: 'xyzabc123notaproduct',
  empty: ''
};

export const COUPON = {
  invalid: 'FAKECOUPON999'
};
