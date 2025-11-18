# API Usage Guide

## Fake Chat Screenshot Generator API

Generate realistic chat screenshots via simple POST requests.

### Base URL
```
https://your-domain.vercel.app/api/generate
```

### Authentication
No authentication required (consider adding API keys for production use).

---

## Endpoints

### GET /api/generate
Get API documentation and usage information.

**Response:**
```json
{
  "message": "Fake Chat Screenshot Generator API",
  "version": "2.0.0",
  "endpoints": { ... }
}
```

---

### POST /api/generate
Generate a chat screenshot and receive PNG image.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "messenger": "telegram",
  "contactName": "John Doe",
  "contactAvatar": "https://example.com/avatar.jpg",
  "messages": [
    {
      "id": "1",
      "text": "Hello! How are you?",
      "sender": "contact",
      "timestamp": "12:30"
    },
    {
      "id": "2",
      "text": "I'm doing great, thanks!",
      "sender": "user",
      "timestamp": "12:31"
    }
  ]
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `messenger` | string | Yes | Messenger type: `telegram`, `whatsapp`, `viber`, or `vk` |
| `contactName` | string | Yes | Name of the contact in the chat |
| `contactAvatar` | string | No | URL to contact's avatar image |
| `messages` | array | Yes | Array of message objects (max 10 per screenshot) |
| `messages[].id` | string | Yes | Unique message identifier |
| `messages[].text` | string | Yes | Message text content |
| `messages[].sender` | string | Yes | Either `user` or `contact` |
| `messages[].timestamp` | string | No | Time to display (e.g., "12:30") |

**Response:**
- Content-Type: `image/png`
- Body: PNG image binary data

**Response Headers:**
- `X-Total-Screens`: Number of screens if all messages were split (max 10 per screen)

---

## Usage Examples

### cURL
```bash
curl -X POST https://your-domain.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messenger": "telegram",
    "contactName": "John Doe",
    "messages": [
      {
        "id": "1",
        "text": "Hello! How are you?",
        "sender": "contact",
        "timestamp": "12:30"
      },
      {
        "id": "2",
        "text": "I'\''m great, thanks!",
        "sender": "user",
        "timestamp": "12:31"
      }
    ]
  }' \
  --output screenshot.png
```

### JavaScript (Fetch API)
```javascript
const generateScreenshot = async () => {
  const response = await fetch('https://your-domain.vercel.app/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messenger: 'telegram',
      contactName: 'John Doe',
      contactAvatar: 'https://example.com/avatar.jpg',
      messages: [
        {
          id: '1',
          text: 'Hello! How are you?',
          sender: 'contact',
          timestamp: '12:30',
        },
        {
          id: '2',
          text: "I'm doing great, thanks!",
          sender: 'user',
          timestamp: '12:31',
        },
      ],
    }),
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Download the image
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screenshot.png';
    a.click();
  } else {
    const error = await response.json();
    console.error('Error:', error);
  }
};

generateScreenshot();
```

### Python (requests)
```python
import requests

url = "https://your-domain.vercel.app/api/generate"
payload = {
    "messenger": "telegram",
    "contactName": "John Doe",
    "messages": [
        {
            "id": "1",
            "text": "Hello! How are you?",
            "sender": "contact",
            "timestamp": "12:30"
        },
        {
            "id": "2",
            "text": "I'm doing great, thanks!",
            "sender": "user",
            "timestamp": "12:31"
        }
    ]
}

response = requests.post(url, json=payload)

if response.status_code == 200:
    with open("screenshot.png", "wb") as f:
        f.write(response.content)
    print("Screenshot saved!")
else:
    print("Error:", response.json())
```

### Node.js (axios)
```javascript
const axios = require('axios');
const fs = require('fs');

const generateScreenshot = async () => {
  try {
    const response = await axios.post(
      'https://your-domain.vercel.app/api/generate',
      {
        messenger: 'whatsapp',
        contactName: 'Jane Smith',
        messages: [
          {
            id: '1',
            text: 'Hey, are you free tomorrow?',
            sender: 'contact',
            timestamp: '14:23',
          },
          {
            id: '2',
            text: 'Yes! What did you have in mind?',
            sender: 'user',
            timestamp: '14:25',
          },
        ],
      },
      {
        responseType: 'arraybuffer',
      }
    );

    fs.writeFileSync('screenshot.png', response.data);
    console.log('Screenshot saved!');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

generateScreenshot();
```

---

## Supported Messengers

1. **Telegram** (`messenger: "telegram"`)
2. **WhatsApp** (`messenger: "whatsapp"`)
3. **Viber** (`messenger: "viber"`)
4. **VK** (`messenger: "vk"`)

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields: messenger, contactName, messages"
}
```

### 400 Bad Request (Invalid Messenger)
```json
{
  "error": "Invalid messenger type. Must be one of: telegram, whatsapp, viber, vk"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to generate screenshot",
  "details": "Error details here"
}
```

---

## Limitations

- Maximum 10 messages per screenshot
- If more than 10 messages are provided, only the first 10 will be rendered
- The `X-Total-Screens` header indicates how many screens would be generated if all messages were split
- Images are generated at 2x resolution (390x620px @2x = 780x1240px actual)

---

## Tips

1. **Avatars**: Use publicly accessible URLs for avatars (HTTPS recommended)
2. **Timestamps**: Use format like "12:30" or "14:45" for best results
3. **Text**: Supports line breaks - use `\n` in your text
4. **Long messages**: Text automatically wraps within message bubbles

---

## Production Recommendations

1. **Rate Limiting**: Add rate limiting to prevent abuse
2. **Authentication**: Implement API keys for access control
3. **Caching**: Consider caching frequently requested screenshots
4. **Monitoring**: Monitor API usage and performance
5. **CDN**: Use Vercel Edge Network or CDN for better performance

---

## Deployment on Vercel

This API is optimized for Vercel deployment:

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy automatically
4. Your API will be available at: `https://your-project.vercel.app/api/generate`

---

## Support

For issues or questions, please open an issue on GitHub.
