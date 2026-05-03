# Image Usage Tracker

A full-stack Next.js and Tailwind CSS app for checking image usage with the SerpApi Google Lens engine.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` and add your SerpApi key:

   ```bash
   SERPAPI_API_KEY=your_serpapi_key_here
   ```

3. Start the app:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

## API

`POST /api/verify-image`

Request body:

```json
{
  "imageUrl": "https://example.com/image.jpg"
}
```

Response:

```json
{
  "imageUrl": "https://example.com/image.jpg",
  "usageCount": 12,
  "sources": ["https://source.example/page"]
}
```
