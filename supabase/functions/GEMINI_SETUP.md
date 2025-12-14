# Gemini API Integration Setup

This guide explains how to set up and use the Google Gemini API for Story Weaver AI.

## Getting Your Gemini API Key

1. **Visit Google AI Studio**
   - Go to https://makersuite.google.com/app/apikey
   - Or visit https://aistudio.google.com/app/apikey

2. **Sign In**
   - Use your Google account to sign in

3. **Create API Key**
   - Click "Create API Key"
   - Select or create a Google Cloud project
   - Copy your API key

4. **Set as Environment Variable**
   ```bash
   supabase secrets set GEMINI_API_KEY=your_api_key_here
   ```

## API Models Available

The integration uses the following Gemini models:

- **`gemini-1.5-flash`** (default) - Fast and efficient, good for most tasks
- **`gemini-1.5-pro`** - Higher quality, better for complex tasks
- **`gemini-pro`** - Legacy model, still supported

You can change the model in `generate-scenes/index.ts`:

```typescript
const model = 'gemini-1.5-pro'; // For better quality
```

## API Endpoints Used

### Generate Content
```
POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}
```

### Request Format
```json
{
  "contents": [{
    "parts": [{
      "text": "Your prompt here"
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 8192,
    "responseMimeType": "application/json"
  }
}
```

## Features Used

### 1. Scene Generation (`generate-scenes`)
- Uses Gemini to analyze stories and break them into scenes
- Returns structured JSON with scene data
- Configured with `responseMimeType: 'application/json'` for reliable JSON output

### 2. Image Generation
**Note:** Gemini does NOT directly generate images. It's a text-only model.

For image generation, you still need:
- **OpenAI DALL-E 3** (recommended) - Set `OPENAI_API_KEY`
- Or integrate with Google's Imagen API (requires separate setup)
- Or use another image generation service

## Rate Limits

Gemini API has the following rate limits (as of 2024):
- **Free tier**: 15 requests per minute (RPM)
- **Paid tier**: Higher limits based on your plan

If you hit rate limits, the function will return a 429 error with a helpful message.

## Error Handling

The integration handles common errors:

- **429**: Rate limit exceeded - Wait and retry
- **400**: Invalid request - Check your prompt format
- **401**: Invalid API key - Verify your `GEMINI_API_KEY`
- **500**: Server error - Try again later

## Cost

- **Free tier**: Limited requests per day
- **Paid tier**: Pay per token (input + output)
- Check current pricing at: https://ai.google.dev/pricing

## Testing

Test the integration locally:

```bash
# Start Supabase locally
supabase start

# Test the function
curl -X POST http://localhost:54321/functions/v1/generate-scenes \
  -H "Content-Type: application/json" \
  -d '{
    "story": "Once upon a time...",
    "style": "cinematic"
  }'
```

## Troubleshooting

### "GEMINI_API_KEY is not configured"
- Make sure you've set the secret: `supabase secrets set GEMINI_API_KEY=your_key`
- For local development, create a `.env` file or use `supabase secrets list`

### "Invalid request to Gemini API"
- Check that your prompt is not too long (max 1M tokens for most models)
- Ensure the JSON format in your prompt is correct
- Verify your API key is valid

### "Rate limit exceeded"
- You're making too many requests
- Wait a minute and try again
- Consider upgrading to a paid plan for higher limits

### "No content in AI response"
- The API returned an empty response
- Check the console logs for more details
- Try simplifying your prompt

## Best Practices

1. **Use appropriate models**
   - `gemini-1.5-flash` for speed
   - `gemini-1.5-pro` for quality

2. **Set temperature appropriately**
   - Lower (0.3-0.5) for consistent, factual outputs
   - Higher (0.7-0.9) for creative, varied outputs

3. **Use JSON response format**
   - Set `responseMimeType: 'application/json'` for structured data
   - Always validate the JSON response

4. **Handle errors gracefully**
   - Implement retry logic for rate limits
   - Provide user-friendly error messages

## Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api/rest)
- [Google AI Studio](https://aistudio.google.com)
- [Pricing Information](https://ai.google.dev/pricing)

