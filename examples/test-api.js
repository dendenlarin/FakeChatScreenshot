// Example script to test the API endpoint
// Run with: node examples/test-api.js

const API_URL = process.env.API_URL || 'http://localhost:3000/api/generate';

const testCases = [
  {
    name: 'Telegram Chat',
    data: {
      messenger: 'telegram',
      contactName: 'John Doe',
      messages: [
        {
          id: '1',
          text: 'Привет! Как дела?',
          sender: 'contact',
          timestamp: '12:30',
        },
        {
          id: '2',
          text: 'Отлично, спасибо! А у тебя?',
          sender: 'user',
          timestamp: '12:31',
        },
        {
          id: '3',
          text: 'Тоже хорошо! Что планируешь на выходные?',
          sender: 'contact',
          timestamp: '12:32',
        },
      ],
    },
    outputFile: 'telegram-screenshot.png',
  },
  {
    name: 'WhatsApp Chat',
    data: {
      messenger: 'whatsapp',
      contactName: 'Jane Smith',
      contactAvatar: 'https://i.pravatar.cc/150?img=5',
      messages: [
        {
          id: '1',
          text: 'Hey! Are you free tomorrow?',
          sender: 'contact',
          timestamp: '14:23',
        },
        {
          id: '2',
          text: 'Yes! What did you have in mind?',
          sender: 'user',
          timestamp: '14:25',
        },
        {
          id: '3',
          text: 'Maybe we could grab coffee?',
          sender: 'contact',
          timestamp: '14:26',
        },
        {
          id: '4',
          text: 'Sounds great! See you at 10am?',
          sender: 'user',
          timestamp: '14:27',
        },
      ],
    },
    outputFile: 'whatsapp-screenshot.png',
  },
  {
    name: 'Viber Chat',
    data: {
      messenger: 'viber',
      contactName: 'Alex Johnson',
      messages: [
        {
          id: '1',
          text: 'Did you see the game last night?',
          sender: 'contact',
          timestamp: '09:15',
        },
        {
          id: '2',
          text: 'No, I missed it. Who won?',
          sender: 'user',
          timestamp: '09:20',
        },
      ],
    },
    outputFile: 'viber-screenshot.png',
  },
  {
    name: 'VK Chat',
    data: {
      messenger: 'vk',
      contactName: 'Мария Иванова',
      messages: [
        {
          id: '1',
          text: 'Привет! Ты придешь на встречу?',
          sender: 'contact',
          timestamp: '18:00',
        },
        {
          id: '2',
          text: 'Да, конечно! Во сколько начало?',
          sender: 'user',
          timestamp: '18:02',
        },
        {
          id: '3',
          text: 'В 19:00 у метро',
          sender: 'contact',
          timestamp: '18:03',
        },
      ],
    },
    outputFile: 'vk-screenshot.png',
  },
];

async function testAPI() {
  const fs = require('fs');
  const path = require('path');

  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Testing API at: ${API_URL}\n`);

  for (const testCase of testCases) {
    try {
      console.log(`🧪 Testing: ${testCase.name}...`);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data),
      });

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const outputPath = path.join(outputDir, testCase.outputFile);
        fs.writeFileSync(outputPath, Buffer.from(buffer));

        const totalScreens = response.headers.get('X-Total-Screens');
        console.log(`✅ Success! Saved to: ${outputPath}`);
        console.log(`   Total screens available: ${totalScreens}\n`);
      } else {
        const error = await response.json();
        console.error(`❌ Error: ${error.error}`);
        if (error.details) {
          console.error(`   Details: ${error.details}\n`);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to test ${testCase.name}:`, error.message, '\n');
    }
  }

  console.log('✨ Testing complete! Check the examples/output directory for screenshots.');
}

// Run tests
testAPI().catch(console.error);
