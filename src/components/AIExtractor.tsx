import React, { useState } from "react";
import { Sparkles, Play, Download, Trash2, Plus, Terminal, RefreshCw, FileCode, CheckCircle, AlertTriangle } from "lucide-react";
import { AIScraperResponse } from "../types";

interface AIScrapeField {
  name: string;
  description: string;
}

export default function AIExtractor() {
  const [htmlContent, setHtmlContent] = useState("");
  const [fields, setFields] = useState<AIScrapeField[]>([
    { name: "Headline", description: "Extract the primary title or header of the article/item." },
    { name: "Summary", description: "Extract a short 1-2 sentence description or summary snippet." },
    { name: "Relative Date", description: "Extract the post date, publish time, or age (e.g., '3 hours ago', 'Yesterday')." }
  ]);
  const [additionalInstruction, setAdditionalInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AIScraperResponse | null>(null);

  const handleAddField = () => {
    setFields([...fields, { name: "", description: "" }]);
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, idx) => idx !== index));
  };

  const handleUpdateField = (index: number, key: "name" | "description", value: string) => {
    setFields(
      fields.map((field, idx) => (idx === index ? { ...field, [key]: value } : field))
    );
  };

  const handleExecuteAIExtraction = async () => {
    setError(null);
    setResponse(null);

    // Validations
    if (!htmlContent.trim()) {
      setError("Please paste some HTML content to extract data from.");
      return;
    }

    const validFields = fields.filter((f) => f.name.trim() && f.description.trim());
    if (validFields.length === 0) {
      setError("Please add at least one field name and target description.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          html: htmlContent,
          fields: validFields,
          instruction: additionalInstruction
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to parse HTML using server-side Gemini.");
      }

      setResponse(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during AI parsing.");
    } finally {
      setIsLoading(false);
    }
  };

  // CSV Exporter
  const handleExportCSV = () => {
    if (!response || !response.data || response.data.length === 0) return;
    const records = response.data;
    const headers = Object.keys(records[0]);
    const csvRows = [
      headers.join(","), // header row
      ...records.map((row) =>
        headers.map((fieldName) => JSON.stringify(row[fieldName] || "")).join(",")
      )
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ai_scraped_dataset.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Exporter
  const handleExportJSON = () => {
    if (!response || !response.data) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data, null, 2));
    const link = document.createElement("a");
    link.href = dataStr;
    link.setAttribute("download", "ai_scraped_dataset.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="ai-extractor-panel-container">
      {/* Left panel: Input sources */}
      <div className="lg:col-span-6 space-y-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800 text-base">1. Input HTML Document</h2>
              <p className="text-xs text-slate-400">Paste raw page source from any saved webpage</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setHtmlContent(`<article class="shop-item">
  <div class="product-info">
    <h1 class="item-title">Razer DeathAdder V3 Pro</h1>
    <span class="price-value">₹149.99</span>
    <p class="summary-desc">Ultra-lightweight wireless ergonomic gaming mouse featuring 30K DPI Optical Sensor.</p>
  </div>
  <div class="reviews-section">
    <div class="score">4.9 Stars</div>
    <span class="count">2,485 verified reviews</span>
  </div>
</article>`);
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Insert Demo HTML
            </button>
          </div>

          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            placeholder="Paste your HTML code here (e.g. <html>...</html>)"
            className="w-full h-48 p-4 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
            id="ai-scraper-raw-html"
          />
        </div>

        {/* Dynamic target schema options */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800 text-base">2. Semantic Extraction Schema</h2>
              <p className="text-xs text-slate-400">Describe what details you want the AI to extract</p>
            </div>
            <button
              type="button"
              onClick={handleAddField}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Field</span>
            </button>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {fields.map((field, idx) => (
              <div key={idx} className="flex gap-2 items-start bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/70">
                <div className="space-y-1.5 flex-1">
                  <input
                    type="text"
                    value={field.name}
                    placeholder="Field Name (e.g., Price)"
                    onChange={(e) => handleUpdateField(idx, "name", e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={field.description}
                    placeholder="Extraction Description (e.g., Locate dollar currency value)"
                    onChange={(e) => handleUpdateField(idx, "description", e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveField(idx)}
                  className="text-slate-400 hover:text-rose-500 transition p-1 mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Optional instructions */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600">Special Extractor Instructions (Optional):</label>
            <input
              type="text"
              value={additionalInstruction}
              placeholder="e.g. Only extract rows where price is under $100"
              onChange={(e) => setAdditionalInstruction(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-xs bg-slate-50/30 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleExecuteAIExtraction}
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            id="btn-run-ai-scrape"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Parsing HTML...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Execute AI Extraction</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right panel: Extracted output JSON / Grid */}
      <div className="lg:col-span-6 space-y-5">
        {error && (
          <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl text-rose-800 space-y-3">
            <div className="flex gap-2.5 items-start">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Extraction Failed</h4>
                <p className="text-xs leading-relaxed mt-1 text-rose-700">{error}</p>
              </div>
            </div>
            {error.includes("Gemini API key") && (
              <div className="bg-white border border-rose-100 p-3.5 rounded-xl text-xs space-y-1.5 text-slate-600">
                <span className="font-bold text-slate-700">How to fix this:</span>
                <p className="leading-relaxed">
                  Go to the <strong>Settings &gt; Secrets</strong> panel in the upper corner of the AI Studio UI, 
                  and add your <strong>GEMINI_API_KEY</strong> secret to enable full-stack AI scraping capabilities.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Results view */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col min-h-[460px]">
          {response && response.data ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              {/* Size Optimization Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Original HTML</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {(response.originalSize / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/30 text-center">
                  <span className="block text-[10px] text-indigo-400 font-mono uppercase">Optimized HTML</span>
                  <span className="font-bold text-indigo-800 text-sm">
                    {(response.cleanedSize / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center">
                  <span className="block text-[10px] text-emerald-500 font-mono uppercase">Compression</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    {((1 - response.cleanedSize / response.originalSize) * 100).toFixed(0)}% Less
                  </span>
                </div>
              </div>

              {/* Data header & export */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">AI Structured Extracted Records</h3>
                  <p className="text-xs text-slate-400">Showing {response.data.length} parsed items</p>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="border hover:bg-slate-50 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="border hover:bg-slate-50 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>JSON</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-slate-100 rounded-xl overflow-hidden overflow-x-auto flex-1 max-h-[280px]">
                {response.data.length > 0 ? (
                  <table className="min-w-full text-left text-xs divide-y">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        {Object.keys(response.data[0]).map((key) => (
                          <th key={key} className="px-4 py-2.5 font-semibold text-[10px]">
                            {key.toUpperCase()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700 bg-white">
                      {response.data.map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          {Object.keys(row).map((key) => (
                            <td key={key} className="px-4 py-2.5 font-medium truncate max-w-[150px]">
                              {row[key] || <span className="text-slate-300 italic">None</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-slate-400 italic">
                    AI matched no records. Try altering descriptions or inserting dynamic elements.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <Terminal className="w-12 h-12 text-slate-300 mb-3" />
              <h4 className="font-bold text-slate-700 text-sm">Extractor Output Terminal</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                Paste HTML page content, select fields on the left, and run AI Structured Extractor 
                to parse content intelligently.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
