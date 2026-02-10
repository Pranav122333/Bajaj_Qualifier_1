# Bajaj Qualifier 1 - REST API

A REST API built with Express.js that provides mathematical operations and AI responses using Google Gemini.

## Features

- Fibonacci sequence generation
- Prime number filtering from an array
- LCM (Least Common Multiple) calculation
- HCF (Highest Common Factor) calculation
- AI responses using Google Gemini API
- Health check endpoint

## Prerequisites

- Node.js (version 14 or higher)
- npm package manager
- Google Gemini API Key (optional for mathematical operations)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Pranav122333/Bajaj_Qualifier_1.git
   cd Bajaj_Qualifier_1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Configuration

Create a `.env` file with the following variables:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```

The `GEMINI_API_KEY` is required only for AI features. Mathematical operations work without it.

## API Endpoints

### GET /health

Health check endpoint.

**Response:**
```json
{
  "is_success": true,
  "official_email": "pranav1096.be23@chitkara.edu.in"
}
```

### POST /bfhl

Main endpoint for mathematical operations and AI responses.

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fibonacci | Integer | No* | Generate Fibonacci sequence of length N |
| prime | Array | No* | Filter prime numbers from array |
| lcm | Array | No* | Calculate LCM of numbers in array |
| hcf | Array | No* | Calculate HCF of numbers in array |
| AI | String | No* | Get AI response (single word output) |

*Exactly one parameter must be provided.

## Examples

### Fibonacci Sequence

Request:
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"fibonacci": 10}'
```

Response:
```json
{
  "is_success": true,
  "official_email": "pranav1096.be23@chitkara.edu.in",
  "data": [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
}
```

### Prime Numbers

Request:
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"prime": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}'
```

Response:
```json
{
  "is_success": true,
  "official_email": "pranav1096.be23@chitkara.edu.in",
  "data": [2, 3, 5, 7]
}
```

### LCM Calculation

Request:
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"lcm": [4, 6, 8]}'
```

Response:
```json
{
  "is_success": true,
  "official_email": "pranav1096.be23@chitkara.edu.in",
  "data": 24
}
```

### HCF Calculation

Request:
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"hcf": [24, 36, 48]}'
```

Response:
```json
{
  "is_success": true,
  "official_email": "pranav1096.be23@chitkara.edu.in",
  "data": 12
}
```

### AI Response

Request:
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"AI": "hello"}'
```

Response:
```json
{
  "is_success": true,
  "official_email": "pranav1096.be23@chitkara.edu.in",
  "data": "Greeting"
}
```

## Deployment

### Vercel

1. Push code to GitHub
2. Import repository in Vercel Dashboard
3. Add `GEMINI_API_KEY` in environment variables
4. Deploy

### Local Development

```bash
npm start
```

## Project Structure

```
bajaj_Qualifier_1/
├── .env                 # Environment variables
├── .env.example         # Environment template
├── index.js             # Main application
├── package.json         # Dependencies
└── vercel.json          # Vercel configuration
```

## Dependencies

- express: Web framework
- dotenv: Environment variables
- node-fetch: Fetch API

## License

ISC

## Author

Pranav_2310991096
Email: pranav1096.be23@chitkara.edu.in
