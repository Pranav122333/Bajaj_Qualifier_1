require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL || 'bajaj@chitkara.edu.in';

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Validate environment variables
function validateEnv() {
  if (!process.env.AI_API_KEY) {
    console.warn('WARNING: AI_API_KEY not set. AI endpoint will return errors.');
  }
}

// Mathematical utility functions
function fibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  
  const result = [0, 1];
  for (let i = 2; i < n; i++) {
    result.push(result[i - 1] + result[i - 2]);
  }
  return result;
}

function isPrime(num) {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

function getPrimes(arr) {
  return arr.filter(num => Number.isInteger(num) && isPrime(num));
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(arr) {
  if (arr.length === 0) return 0;
  if (arr.length === 1) return Math.abs(arr[0]);
  
  let result = Math.abs(arr[0]);
  for (let i = 1; i < arr.length; i++) {
    result = (Math.abs(arr[i]) * result) / gcd(arr[i], result);
  }
  return Math.abs(result);
}

function hcf(arr) {
  if (arr.length === 0) return 0;
  if (arr.length === 1) return Math.abs(arr[0]);
  
  let result = Math.abs(arr[0]);
  for (let i = 1; i < arr.length; i++) {
    result = gcd(result, arr[i]);
    if (result === 1) return 1;
  }
  return result;
}

// AI integration
async function getAIResponse(question) {
  const apiKey = process.env.AI_API_KEY;
  
  if (!apiKey) {
    throw new Error('AI_API_KEY not configured');
  }
  
  const url = 'https://api.openai.com/v1/chat/completions';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
        max_tokens: 10,
        temperature: 0.3
      })
    });
    
    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }
    
    const data = await response.json();
    const answer = data.choices[0]?.message?.content?.trim();
    
    if (!answer) {
      throw new Error('Empty AI response');
    }
    
    // Return single word
    return answer.split(/\s+/)[0].replace(/[^a-zA-Z]/g, '');
  } catch (error) {
    console.error('AI API Error:', error.message);
    throw error;
  }
}

// Response helpers
function successResponse(data) {
  return {
    is_success: true,
    official_email: OFFICIAL_EMAIL,
    data: data
  };
}

function errorResponse() {
  return {
    is_success: false,
    official_email: OFFICIAL_EMAIL
  };
}

// Input validation
function validateBFHLRequest(body) {
  const allowedKeys = ['fibonacci', 'prime', 'lcm', 'hcf', 'AI'];
  const keys = Object.keys(body);
  
  if (keys.length === 0) {
    return { valid: false, error: 'Request body is empty' };
  }
  
  if (keys.length > 1) {
    return { valid: false, error: 'Exactly one operation key is required' };
  }
  
  const key = keys[0];
  if (!allowedKeys.includes(key)) {
    return { valid: false, error: `Invalid operation key: ${key}` };
  }
  
  const value = body[key];
  
  switch (key) {
    case 'fibonacci':
      if (!Number.isInteger(value) || value < 1) {
        return { valid: false, error: 'fibonacci must be a positive integer' };
      }
      break;
    case 'prime':
    case 'lcm':
    case 'hcf':
      if (!Array.isArray(value)) {
        return { valid: false, error: `${key} requires an array of integers` };
      }
      if (value.length === 0) {
        return { valid: false, error: `${key} requires a non-empty array` };
      }
      if (!value.every(num => Number.isInteger(num))) {
        return { valid: false, error: `${key} requires an array of integers` };
      }
      break;
    case 'AI':
      if (typeof value !== 'string' || value.trim().length === 0) {
        return { valid: false, error: 'AI requires a non-empty string question' };
      }
      break;
  }
  
  return { valid: true, key, value };
}

// Routes
app.get('/health', (req, res) => {
  try {
    res.json(successResponse());
  } catch (error) {
    res.status(500).json(errorResponse());
  }
});

app.post('/bfhl', async (req, res) => {
  try {
    const validation = validateBFHLRequest(req.body);
    
    if (!validation.valid) {
      return res.status(400).json(errorResponse());
    }
    
    const { key, value } = validation;
    let result;
    
    switch (key) {
      case 'fibonacci':
        result = fibonacci(value);
        break;
      case 'prime':
        result = getPrimes(value);
        break;
      case 'lcm':
        result = lcm(value);
        break;
      case 'hcf':
        result = hcf(value);
        break;
      case 'AI':
        result = await getAIResponse(value);
        break;
    }
    
    res.json(successResponse(result));
  } catch (error) {
    console.error('BFHL Error:', error.message);
    res.status(500).json(errorResponse());
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json(errorResponse());
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json(errorResponse());
});

// Start server
if (process.env.VERCEL === undefined) {
  validateEnv();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
