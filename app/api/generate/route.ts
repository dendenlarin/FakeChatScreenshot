import { NextRequest, NextResponse } from "next/server";
import { ChatConfig } from "@/types";

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

    // Return configuration for client-side rendering
    // In production, you could use Puppeteer or similar to generate images server-side
    // For now, we'll return the config to be processed on the client
    return NextResponse.json({
      success: true,
      message: "Configuration received. Use client-side rendering to generate images.",
      config,
      note: "To generate images server-side, implement Puppeteer integration with @vercel/og or puppeteer-core"
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Fake Chat Screenshot Generator API",
    version: "1.0.0",
    endpoints: {
      POST: {
        path: "/api/generate",
        description: "Generate chat screenshots",
        body: {
          messenger: "telegram | whatsapp | viber | vk",
          contactName: "string",
          contactAvatar: "string (optional)",
          messages: [
            {
              id: "string",
              text: "string",
              sender: "user | contact",
              timestamp: "string (optional)"
            }
          ]
        }
      }
    }
  });
}
