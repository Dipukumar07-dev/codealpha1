import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parsing
app.use(express.json({ limit: "10mb" }));

// Helper to pre-process and optimize HTML size for Gemini parsing
function cleanHtmlForAI(rawHtml: string): string {
  if (!rawHtml) return "";
  
  let cleaned = rawHtml;
  
  // 1. Remove head section
  cleaned = cleaned.replace(/<head[^]*?>[^]*?<\/head>/gi, "");
  
  // 2. Remove scripts and styles
  cleaned = cleaned.replace(/<script[^]*?>[^]*?<\/script>/gi, "");
  cleaned = cleaned.replace(/<style[^]*?>[^]*?<\/style>/gi, "");
  
  // 3. Remove SVGs (which can be huge path data)
  cleaned = cleaned.replace(/<svg[^]*?>[^]*?<\/svg>/gi, " [SVG] ");
  
  // 4. Remove comments
  cleaned = cleaned.replace(/<!--[^]*?-->/g, "");
  
  // 5. Strip inline base64 images to avoid bloat
  cleaned = cleaned.replace(/src="data:image\/[^;]+;base64,[^"]+"/gi, 'src="[BASE64_IMAGE]"');
  
  // 6. Remove inline style attributes
  cleaned = cleaned.replace(/\sstyle="[^"]*"/gi, "");
  cleaned = cleaned.replace(/\sstyle='[^']*'/gi, "");
  
  // 7. Remove non-essential attributes (like role, aria-*, data-v-*, tabindex)
  cleaned = cleaned.replace(/\s(aria-[a-z]+|role|tabindex|data-v-[a-zA-Z0-9_-]+|draggable)="[^"]*"/gi, "");
  
  // 8. Condense multiple spaces and newlines
  cleaned = cleaned.replace(/\s+/g, " ");
  
  return cleaned.trim();
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Structured Scraping Endpoint
app.post("/api/extract", async (req, res) => {
  try {
    const { html, fields, instruction } = req.body;

    if (!html) {
      res.status(400).json({ success: false, error: "HTML content is required." });
      return;
    }

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      res.status(400).json({ success: false, error: "At least one target field description is required." });
      return;
    }

    const originalSize = html.length;
    const cleanedHtml = cleanHtmlForAI(html);
    const cleanedSize = cleanedHtml.length;

    // Initialize Gemini client (server-side only)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      res.status(500).json({
        success: false,
        error: "Gemini API key is not configured. Please set GEMINI_API_KEY in the Secrets / Settings panel.",
        originalSize,
        cleanedSize
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // Build schema properties for dynamic object extraction
    const properties: Record<string, any> = {};
    const required: string[] = [];

    fields.forEach((field) => {
      const fieldKey = field.name.toLowerCase().replace(/[^a-z0-9_]/g, "_");
      properties[fieldKey] = {
        type: Type.STRING,
        description: field.description || `Extract the ${field.name}`,
      };
      required.push(fieldKey);
    });

    const systemInstruction = `You are an expert web scraper and data extraction engine. 
Your task is to analyze the provided HTML code and extract structured data based on the requested fields.
Look for repeatable patterns, listings, cards, rows, or articles.
For each item found, extract the requested details. 
If a value is not found or empty, set it to an empty string. 
Clean and trim whitespace, resolve relative URLs if context permits, and format numbers cleanly.
Respond ONLY with a valid JSON array of extracted objects.`;

    const prompt = `HTML Content:
"""
${cleanedHtml}
"""

Fields to extract:
${fields.map((f) => `- ${f.name}: ${f.description}`).join("\n")}
${instruction ? `Additional Instructions: ${instruction}` : ""}

Please extract an array of objects representing all matching records/items in the HTML.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties,
            required,
          },
        },
      },
    });

    const responseText = response.text || "[]";
    const data = JSON.parse(responseText.trim());

    res.json({
      success: true,
      data,
      originalSize,
      cleanedSize,
    });
  } catch (error: any) {
    console.error("AI Scraper extraction failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An unexpected error occurred during data extraction.",
    });
  }
});

// Vite middleware integration
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Setting up Express in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

setupServer();
