import React, { useState, useEffect, useRef } from "react";
import { Play, Download, Code, Plus, Trash2, Globe, HelpCircle, Eye, Sparkles, Check, Copy } from "lucide-react";
import { mockSites } from "../mockSitesData";
import { MockSite } from "../types";
import { motion } from "motion/react";

interface ScrapeField {
  id: string;
  name: string;
  selector: string;
}

export default function ScraperSimulator() {
  const [selectedSiteId, setSelectedSiteId] = useState(mockSites[0].id);
  const [fields, setFields] = useState<ScrapeField[]>([
    { id: "1", name: "Title", selector: "h3.book-title" },
    { id: "2", name: "Price", selector: ".book-price" },
    { id: "3", name: "Author", selector: ".book-author" }
  ]);
  const [activeFieldId, setActiveFieldId] = useState<string | null>("1");
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [hoveredSelector, setHoveredSelector] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"preview" | "dataset" | "code">("preview");
  const [codeType, setCodeType] = useState<"bs4" | "scrapy">("bs4");
  const [copiedCode, setCopiedCode] = useState(false);

  const site = mockSites.find((s) => s.id === selectedSiteId) || mockSites[0];
  const simulatedBrowserRef = useRef<HTMLDivElement>(null);

  // Auto-update suggested fields when switching sites
  useEffect(() => {
    const defaultFields = site.suggestedFields.map((f, i) => ({
      id: String(i + 1),
      name: f.name,
      selector: f.selector
    }));
    setFields(defaultFields);
    setActiveFieldId("1");
    setActiveTab("preview");
  }, [selectedSiteId]);

  // Execute CSS Selectors against the simulated site HTML locally
  useEffect(() => {
    try {
      const sandbox = document.createElement("div");
      sandbox.innerHTML = site.html;

      // Find the main list elements (cards/rows)
      // If the site is a table, we match rows, else we match articles/cards
      const itemSelector = site.defaultSelector;
      const containerItems = sandbox.querySelectorAll(itemSelector);

      const records: any[] = [];

      containerItems.forEach((containerItem) => {
        const record: Record<string, string> = {};
        fields.forEach((field) => {
          if (!field.selector.trim()) {
            record[field.name] = "";
            return;
          }
          // Query within the specific item container
          const elem = containerItem.querySelector(field.selector);
          if (elem) {
            // Trim whitespace
            record[field.name] = elem.textContent?.replace(/\s+/g, " ").trim() || "";
          } else {
            record[field.name] = "N/A";
          }
        });
        records.push(record);
      });

      setExtractedData(records);
    } catch (err) {
      console.error("Local matching failed", err);
    }
  }, [fields, selectedSiteId, site]);

  // Computes a target element's class/id based selector
  const computeSelector = (el: HTMLElement): string => {
    if (el.classList.contains("book-title")) return "h3.book-title";
    if (el.classList.contains("book-price")) return ".book-price";
    if (el.classList.contains("book-author")) return ".book-author";
    if (el.classList.contains("category-tag")) return ".category-tag";
    if (el.classList.contains("publish-time")) return ".publish-time";
    if (el.classList.contains("post-title")) return "h2.post-title a";
    if (el.classList.contains("post-excerpt")) return ".post-excerpt";
    if (el.classList.contains("asset-name")) return ".asset-name";
    if (el.classList.contains("asset-symbol")) return ".asset-symbol";
    if (el.classList.contains("asset-price")) return ".asset-price";
    if (el.classList.contains("asset-change")) return ".asset-change";
    if (el.tagName === "A" && el.closest(".post-title")) return "h2.post-title a";

    // Fallbacks
    if (el.id) return `#${el.id}`;
    if (el.className) {
      const firstClass = el.className.split(" ")[0];
      if (firstClass && firstClass.length > 2 && !firstClass.includes(":")) {
        return `.${firstClass}`;
      }
    }
    return el.tagName.toLowerCase();
  };

  const handleMouseMoveInBrowser = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't inspect outer browser containers
    if (target === simulatedBrowserRef.current || target.id === "browser-chrome") {
      return;
    }
    const sel = computeSelector(target);
    setHoveredSelector(sel);
  };

  const handleMouseLeaveBrowser = () => {
    setHoveredSelector("");
  };

  const handleClickInBrowser = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    const computedSel = computeSelector(target);

    if (activeFieldId && computedSel) {
      setFields((prev) =>
        prev.map((f) => (f.id === activeFieldId ? { ...f, selector: computedSel } : f))
      );
    }
  };

  const handleAddField = () => {
    const newId = String(Date.now());
    const newField: ScrapeField = {
      id: newId,
      name: `Field_${fields.length + 1}`,
      selector: ""
    };
    setFields([...fields, newField]);
    setActiveFieldId(newId);
  };

  const handleRemoveField = (id: string) => {
    const updated = fields.filter((f) => f.id !== id);
    setFields(updated);
    if (activeFieldId === id) {
      setActiveFieldId(updated[0]?.id || null);
    }
  };

  const handleUpdateField = (id: string, key: "name" | "selector", val: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: val } : f)));
  };

  // CSV Exporter
  const handleExportCSV = () => {
    if (extractedData.length === 0) return;
    const headers = Object.keys(extractedData[0]);
    const csvRows = [
      headers.join(","), // header row
      ...extractedData.map((row) =>
        headers.map((fieldName) => JSON.stringify(row[fieldName] || "")).join(",")
      )
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${site.id}_dataset.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Exporter
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(extractedData, null, 2));
    const link = document.createElement("a");
    link.href = dataStr;
    link.setAttribute("download", `${site.id}_dataset.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Python Script Generator (BeautifulSoup & Scrapy)
  const generatePythonCode = (): string => {
    if (codeType === "bs4") {
      return `import requests
from bs4 import BeautifulSoup
import json

# Target URL (Using simulated BookLand as template)
url = "https://example-bookstore-scrape.com/catalog"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

print(f"Fetching content from: {url}...")
response = requests.get(url, headers=headers)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, "html.parser")
    dataset = []
    
    # Locate all container blocks representing single items
    items = soup.select("${site.defaultSelector}")
    print(f"Found {len(items)} record containers.")
    
    for item in items:
        record = {}
        
        # Extract fields using your custom CSS selectors
${fields
  .map(
    (f) =>
      `        # Extract ${f.name}\n        elem_${f.id} = item.select_one("${f.selector || "tag"}")\n        record["${
        f.name
      }"] = elem_${f.id}.get_text(strip=True) if elem_${f.id} else "N/A"`
  )
  .join("\n\n")}
        
        dataset.append(record)
        
    # Output scraped dataset as dynamic JSON
    with open("${site.id}_dataset.json", "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=4, ensure_ascii=False)
    
    print("Scraping completed! Data saved to '${site.id}_dataset.json'")
else:
    print(f"Failed to fetch page. Status code: {response.status_code}")
`;
    } else {
      return `import scrapy
import json

class CustomSiteSpider(scrapy.Spider):
    name = "${site.id}_spider"
    allowed_domains = ["example-bookstore-scrape.com"]
    start_urls = ["https://example-bookstore-scrape.com/catalog"]
    
    def parse(self, response):
        # Loop through active record containers
        for item in response.css("${site.defaultSelector}"):
            yield {
${fields
  .map((f) => `                "${f.name}": item.css("${f.selector || "tag"}::text").get(default="").strip()`)
  .join(",\n")}
            }
`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatePythonCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8" id="scraper-simulator-root">
      {/* Left Column: Visual Browser view of simulated site */}
      <div className="xl:col-span-7 space-y-4">
        {/* Site switcher chrome bar */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-sm">Simulated Web Browser</h3>
              <p className="text-[10px] text-slate-400 font-mono">Status: Local Host (Sandbox)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-300 font-medium">Select Target:</label>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              id="sandbox-site-select"
            >
              {mockSites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} ({site.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Browser viewport with mouse visual interaction */}
        <div className="relative border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-50 flex flex-col h-[520px]">
          {/* Header address bar */}
          <div className="bg-slate-100 border-b px-4 py-2 flex items-center space-x-2 text-slate-400 text-xs flex-shrink-0" id="browser-chrome">
            <div className="flex space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            </div>
            <div className="bg-white border rounded px-3 py-1 text-[11px] text-slate-600 flex-1 flex items-center justify-between font-mono">
              <span>https://ais-sandbox.internal/scrapes/{site.id}.html</span>
              <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Visual Tree Inspect Mode</span>
            </div>
          </div>

          {/* Interactive view container */}
          <div
            ref={simulatedBrowserRef}
            onMouseMove={handleMouseMoveInBrowser}
            onMouseLeave={handleMouseLeaveBrowser}
            onClick={handleClickInBrowser}
            className="flex-1 overflow-y-auto cursor-crosshair relative bg-white"
            style={{ contentVisibility: "auto" }}
          >
            <div dangerouslySetInnerHTML={{ __html: site.html }} />

            {/* Selector tooltip */}
            {hoveredSelector && (
              <div
                className="absolute bg-slate-950 text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none font-mono z-50 border border-slate-700 flex items-center gap-1.5"
                style={{
                  top: "10px",
                  left: "10px"
                }}
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>Hovered selector: <strong className="text-amber-400">{hoveredSelector}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* User Interaction Guide */}
        <div className="bg-slate-100/60 rounded-2xl p-4.5 border border-slate-200/50 flex gap-3 text-xs leading-relaxed text-slate-600">
          <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">Visual Selector Builder:</strong> Hover over any item (product, article, asset) in the browser above. Click it to immediately copy its relative CSS selector path into your active target field in the right-hand controller!
          </div>
        </div>
      </div>

      {/* Right Column: Scraper Controls, Live Dataset grid & Python Generator */}
      <div className="xl:col-span-5 space-y-4">
        {/* Tab Selection */}
        <div className="flex border-b border-slate-200">
          {[
            { id: "preview", name: "Configure Fields" },
            { id: "dataset", name: "Extracted Dataset" },
            { id: "code", name: "Export Python Script" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 text-center py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab 1: Configuration list */}
        {activeTab === "preview" && (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4" id="config-fields-panel">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Target Fields</h3>
                <p className="text-xs text-slate-400">Manage custom scraping variables</p>
              </div>
              <button
                type="button"
                onClick={handleAddField}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Field</span>
              </button>
            </div>

            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {fields.map((field) => {
                const isActive = activeFieldId === field.id;
                return (
                  <div
                    key={field.id}
                    onClick={() => setActiveFieldId(field.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col gap-2.5 ${
                      isActive
                        ? "bg-slate-50 border-slate-900 shadow-sm"
                        : "bg-white hover:bg-slate-50/50 border-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={field.name}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleUpdateField(field.id, "name", e.target.value)}
                        className="font-bold text-xs text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none py-0.5 w-32"
                      />
                      <div className="flex items-center gap-1.5">
                        {isActive && (
                          <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Active Selector
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveField(field.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={field.selector}
                        placeholder="Click elements in preview to auto-generate selector..."
                        onChange={(e) => handleUpdateField(field.id, "selector", e.target.value)}
                        className="w-full pl-3 pr-8 py-2 border rounded-lg text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Extracted Dataset Grid */}
        {activeTab === "dataset" && (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Live Scraped Dataset</h3>
                <p className="text-xs text-slate-400">Showing rows compiled using CSS query matchers</p>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="border hover:bg-slate-50 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="border hover:bg-slate-50 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>JSON</span>
                </button>
              </div>
            </div>

            {/* Table layout */}
            <div className="border border-slate-100 rounded-xl overflow-hidden overflow-x-auto max-h-[340px]">
              {extractedData.length > 0 ? (
                <table className="min-w-full text-left text-xs divide-y">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      {fields.map((field) => (
                        <th key={field.id} className="px-4 py-2.5 font-semibold text-[10px]">
                          {field.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700 bg-white">
                    {extractedData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        {fields.map((field) => (
                          <td key={field.id} className="px-4 py-2.5 font-medium truncate max-w-[120px]">
                            {row[field.name]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-slate-400 italic">
                  Define fields to compile extracted records.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Python scripts */}
        {activeTab === "code" && (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Python Code Generator</h3>
                <p className="text-xs text-slate-400">Ready-to-run BeautifulSoup or Scrapy script</p>
              </div>

              <div className="flex bg-slate-100 rounded-lg p-0.5 border">
                <button
                  type="button"
                  onClick={() => setCodeType("bs4")}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                    codeType === "bs4" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  BS4
                </button>
                <button
                  type="button"
                  onClick={() => setCodeType("scrapy")}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                    codeType === "scrapy" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Scrapy
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div className="relative">
              <pre className="bg-slate-900 text-emerald-400 font-mono text-[10.5px] p-4 rounded-xl max-h-[300px] overflow-y-auto leading-relaxed border border-slate-800 shadow-inner whitespace-pre">
                {generatePythonCode()}
              </pre>

              <button
                type="button"
                onClick={handleCopyCode}
                className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-lg transition border border-slate-700 flex items-center gap-1.5 text-xs font-semibold"
                id="btn-copy-python-code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
