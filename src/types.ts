export interface Challenge {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  instructions: string;
  htmlSnippet: string;
  correctSelector: string[];
  expectedOutput: string[];
  selectorType: "css" | "xpath";
  hint: string;
}

export interface MockSite {
  id: string;
  name: string;
  category: string;
  description: string;
  html: string;
  defaultSelector: string;
  suggestedFields: { name: string; selector: string; description: string }[];
}

export interface ExtractedData {
  headers: string[];
  rows: Record<string, string>[];
}

export interface AIScraperRequest {
  html: string;
  fields: { name: string; description: string }[];
  instruction?: string;
}

export interface AIScraperResponse {
  success: boolean;
  data?: any[];
  error?: string;
  originalSize: number;
  cleanedSize: number;
}
