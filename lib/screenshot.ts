import puppeteer, { Browser } from "puppeteer-core";
import chromium from "@sparticuz/chromium";

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browser) {
    return browser;
  }

  // Check if running locally or on Vercel
  const isLocal = process.env.NODE_ENV === "development" || !process.env.AWS_LAMBDA_FUNCTION_VERSION;

  if (isLocal) {
    // Local development - use local Chrome/Chromium
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: process.env.CHROME_EXECUTABLE_PATH ||
        "/usr/bin/google-chrome-stable" ||
        "/usr/bin/chromium-browser" ||
        undefined,
    });
  } else {
    // Vercel serverless - use chrome-aws-lambda
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: null,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  return browser;
}

export async function generateScreenshot(html: string): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Set viewport to match mobile screen
    await page.setViewport({
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
    });

    // Set content and wait for fonts to load
    await page.setContent(html, {
      waitUntil: ["networkidle0", "domcontentloaded"],
    });

    // Wait a bit for any animations or fonts to fully load
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find the chat container and take screenshot
    const element = await page.$("body > div");

    if (!element) {
      throw new Error("Chat container not found");
    }

    const screenshot = await element.screenshot({
      type: "png",
      omitBackground: false,
    });

    return screenshot as Buffer;
  } finally {
    await page.close();
  }
}

// Cleanup function for graceful shutdown
export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
