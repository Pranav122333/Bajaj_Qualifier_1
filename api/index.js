// Vercel Serverless Function (Native - no Express)
const OFFICIAL_EMAIL = 'pranav1096.be23@chitkara.edu.in';

// Utility Functions
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

// Parse JSON body
const getBody = async (req) => {
  try {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const body = Buffer.concat(buffers).toString();
    return body ? JSON.parse(body) : {};
  } catch {
    return {};
  }
};

module.exports = async (req, res) => {
  const { method, url } = req;
  
  // Set CORS headers
  res.setHeader('Content-Type', 'application/json');
  
  if (method === 'GET' && url === '/health') {
    res.status(200).json({
      is_success: true,
      official_email: OFFICIAL_EMAIL
    });
    return;
  }
  
  if (method === 'POST' && url === '/bfhl') {
    try {
      const body = await getBody(req);
      const keys = Object.keys(body);
      
      if (keys.length !== 1) {
        res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL
        });
        return;
      }
      
      const key = keys[0];
      const value = body[key];
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
        // AI response placeholder
        data = 'AI_response';
      } else {
        throw new Error();
      }
      
      res.status(200).json({
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
    return;
  }
  
  res.status(404).json({ error: 'Not found' });
};
