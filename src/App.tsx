import React, { useState } from "react";
import { Award, Database, Sparkles, BookOpen, Terminal, Code } from "lucide-react";
import SelectorLab from "./components/SelectorLab";
import ScraperSimulator from "./components/ScraperSimulator";
import AIExtractor from "./components/AIExtractor";
import ReferenceHub from "./components/ReferenceHub";

export default function App() {
  const [currentTab, setCurrentTab] = useState<"lab" | "simulator" | "ai" | "ref">("lab");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="app-root">
      {/* Top Main Navigation Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm" id="main-app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 text-white p-2.5 rounded-xl flex items-center justify-center shadow-md">
              <Terminal className="w-6 h-6 text-indigo-400 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                Scrape<span className="text-indigo-600">Craft</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                The Interactive Scraping Lab, Selector Sandbox & AI Dataset Builder
              </p>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <nav className="flex space-x-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 self-start md:self-auto" id="app-main-tabs">
            <button
              onClick={() => setCurrentTab("lab")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition ${
                currentTab === "lab"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
              id="tab-selector-lab"
            >
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Selector Lab</span>
            </button>
            <button
              onClick={() => setCurrentTab("simulator")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition ${
                currentTab === "simulator"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
              id="tab-scraper-simulator"
            >
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Scraper Simulator</span>
            </button>
            <button
              onClick={() => setCurrentTab("ai")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition ${
                currentTab === "ai"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
              id="tab-ai-extractor"
            >
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>AI Extractor</span>
            </button>
            <button
              onClick={() => setCurrentTab("ref")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition ${
                currentTab === "ref"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
              id="tab-reference-hub"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Tutorial Guide</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Body Stage Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" id="main-stage">
        {currentTab === "lab" && <SelectorLab />}
        {currentTab === "simulator" && <ScraperSimulator />}
        {currentTab === "ai" && <AIExtractor />}
        {currentTab === "ref" && <ReferenceHub />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400 flex-shrink-0" id="main-footer">
        <p className="font-medium">
          ScrapeCraft Sandbox &copy; {new Date().getFullYear()} &bull; Built as a secure, high-contrast, fully functional educational workspace
        </p>
      </footer>
    </div>
  );
}
