const request = require('supertest');
const app = require('./app');

describe('Test /api/currencyConverter', () => {
  test('Returns correct conversion for USD to USD', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=USD&amount=10');
    expect(response.statusCode).toBe(200);
    expect(response.body.amount).toBe(10);
  });

  test('Returns correct conversion for USD to CAD', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=CAD&amount=10');
    expect(response.statusCode).toBe(200);
    expect(response.body.amount).toBe(12.07);
  });

  test('Returns correct conversion for USD to DZD', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=DZD&amount=10');
    expect(response.statusCode).toBe(200);
    expect(response.body.amount).toBe(975.6);
  });

  test('Show error when user supplies fromCurrency');

  test('Show error when user supplies toCurrency');

  test('Show error when user supplies unsupported toCurrency');

  test('Show error when user supplies unsupported toCurrency');
});

describe('Test /api/locationToCurrency', () => {

  test('Returns correct country code for US');

  test('Returns correct country code for Mexico');

  test('Returns correct country code for super accurate');

  test('Returns correct country code for vague address');

  test('Show 400 error when lat is not given');

  test('Show 400 error when long is not given');

  test('Show 500 error when downstream api fails');


});
