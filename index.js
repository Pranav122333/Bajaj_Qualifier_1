require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const OFFICIAL_EMAIL = 'pranav1096.be23@chitkara.edu.in';

app.use(express.json());

// =====================
// Utility Functions
// =====================

const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
};

const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const fibonacci = (n) => {
  const result = [];
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    result.push(a);
    [a, b] = [b, a + b];
  }
  return result;
};

const aiResponse = async (question) => {
  if (!API_KEY) throw new Error('AI key missing');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: question }] }]
    })
  });

  if (!response.ok) throw new Error('AI service error');

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text.split(/\s+/)[0]; // single-word output
};

// =====================
// Routes
// =====================

app.get('/health', (req, res) => {
  res.json({
    is_success: true,
    official_email: OFFICIAL_EMAIL
  });
});

app.post('/bfhl', async (req, res) => {
  try {
    const keys = Object.keys(req.body);
    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL
      });
    }

    const key = keys[0];
    const value = req.body[key];
    let data;

    if (key === 'fibonacci') {
      if (!Number.isInteger(value) || value < 1) throw new Error();
      data = fibonacci(value);

    } else if (key === 'prime') {
      if (!Array.isArray(value)) throw new Error();
      data = value.filter(n => Number.isInteger(n) && isPrime(n));

    } else if (key === 'lcm') {
      if (!Array.isArray(value) || value.length < 2) throw new Error();
      if (!value.every(Number.isInteger)) throw new Error();
      data = value.reduce((acc, n) => lcm(acc, n));

    } else if (key === 'hcf') {
      if (!Array.isArray(value) || value.length < 2) throw new Error();
      if (!value.every(Number.isInteger)) throw new Error();
      data = value.reduce((acc, n) => gcd(acc, n));

    } else if (key === 'AI') {
      if (typeof value !== 'string' || !value.trim()) throw new Error();
      data = await aiResponse(value);

    } else {
      throw new Error();
    }

    res.json({
      is_success: true,
      official_email: OFFICIAL_EMAIL,
      data
    });

  } catch {
    res.status(400).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL
    });
  }
});

module.exports = app;