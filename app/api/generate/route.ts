import { NextRequest, NextResponse } from "next/server";
import { ChatConfig } from "@/types";
import { generateChatHTML } from "@/lib/template-generator";
import { generateScreenshot } from "@/lib/screenshot";

const MAX_MESSAGES_PER_SCREEN = 10;

export async function POST(request: NextRequest) {
  try {
    const config: ChatConfig = await request.json();

    // Validate input
    if (!config.messenger || !config.contactName || !config.messages) {
      return NextResponse.json(
        { error: "Missing required fields: messenger, contactName, messages" },
        { status: 400 }
      );
    }

    // Validate messenger type
    const validMessengers = ["telegram", "whatsapp", "viber", "vk"];
    if (!validMessengers.includes(config.messenger)) {
      return NextResponse.json(
        { error: `Invalid messenger type. Must be one of: ${validMessengers.join(", ")}` },
        { status: 400 }
      );
    }

    // Check if multiple screenshots needed
    const screensCount = Math.ceil(config.messages.length / MAX_MESSAGES_PER_SCREEN);

    // For now, generate only the first screen (or you can generate all and return as zip/array)
    const messagesToRender = config.messages.slice(0, MAX_MESSAGES_PER_SCREEN);
    const configForScreen = {
      ...config,
      messages: messagesToRender,
    };

    // Generate HTML template
    const html = generateChatHTML(configForScreen);

    // Generate screenshot using Puppeteer
    const imageBuffer = await generateScreenshot(html);

    // Return image with appropriate headers
    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": imageBuffer.length.toString(),
        "Cache-Control": "no-store, max-age=0",
        "X-Total-Screens": screensCount.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating screenshot:", error);
    return NextResponse.json(
      {
        error: "Failed to generate screenshot",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Fake Chat Screenshot Generator API",
    version: "2.0.0",
    description: "Generate realistic chat screenshots via API",
    endpoints: {
      POST: {
        path: "/api/generate",
        description: "Generate a chat screenshot and return PNG image",
        contentType: "application/json",
        returns: "image/png",
        headers: {
          "X-Total-Screens": "Number of screens that would be generated if all messages were split",
        },
        body: {
          messenger: {
            type: "string",
            required: true,
            options: ["telegram", "whatsapp", "viber", "vk"],
          },
          contactName: {
            type: "string",
            required: true,
            description: "Name of the contact in the chat",
          },
          contactAvatar: {
            type: "string",
            required: false,
            description: "URL to contact's avatar image",
          },
          messages: {
            type: "array",
            required: true,
            description: `Array of messages (max ${MAX_MESSAGES_PER_SCREEN} per screenshot)`,
            items: {
              id: { type: "string", required: true },
              text: { type: "string", required: true },
              sender: {
                type: "string",
                required: true,
                options: ["user", "contact"],
              },
              timestamp: {
                type: "string",
                required: false,
                example: "12:30",
              },
            },
          },
        },
        example: {
          messenger: "telegram",
          contactName: "John Doe",
          contactAvatar: "https://example.com/avatar.jpg",
          messages: [
            {
              id: "1",
              text: "Hello! How are you?",
              sender: "contact",
              timestamp: "12:30",
            },
            {
              id: "2",
              text: "I'm doing great, thanks!",
              sender: "user",
              timestamp: "12:31",
            },
          ],
        },
      },
    },
    usage: {
      curl: `curl -X POST https://your-domain.vercel.app/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{"messenger":"telegram","contactName":"John","messages":[{"id":"1","text":"Hello!","sender":"contact"}]}' \\
  --output screenshot.png`,
    },
  });
}
