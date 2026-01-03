/* Simple auth integration test script.
   Run after starting dev server: npm run dev
   Usage: node scripts/auth-test.js
*/

const fetch = global.fetch || require('node-fetch');
require('dotenv').config();

const BASE = process.env.APP_URL || 'http://localhost:3000';

async function signup() {
  const resp = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test.user@example.com', password: 'TestPass123', firstName: 'Test', lastName: 'User' })
  });
  const data = await resp.json();
  console.log('Signup status', resp.status, data);
  return data;
}

async function signin() {
  const resp = await fetch(`${BASE}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test.user@example.com', password: 'TestPass123' })
  });
  const data = await resp.json();
  console.log('Signin status', resp.status, data);
  return data;
}

(async () => {
  try {
    console.log('Starting auth test against', BASE);
    await signup();
    await signin();
    console.log('Auth test finished');
  } catch (err) {
    console.error('Auth test error', err);
    process.exit(1);
  }
})();
