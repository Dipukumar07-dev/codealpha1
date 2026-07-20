import React, { useState } from "react";
import { BookOpen, Code, Terminal, Compass, ShieldAlert, Check, Copy } from "lucide-react";

export default function ReferenceHub() {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const bs4Code = `import requests
from bs4 import BeautifulSoup

# 1. Target URL
url = "https://quotes.toscrape.com"

# 2. Add realistic headers to bypass basic bot blockers
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# 3. Download the webpage source
response = requests.get(url, headers=headers)

if response.status_code == 200:
    # 4. Parse raw HTML content
    soup = BeautifulSoup(response.text, "html.parser")
    
    # 5. Extract items using CSS Selectors
    quotes = soup.select("div.quote")
    
    for quote in quotes:
        text = quote.select_one("span.text").get_text(strip=True)
        author = quote.select_one("small.author").get_text(strip=True)
        tags = [tag.get_text() for tag in quote.select("a.tag")]
        
        print(f'"{text}"\\n- By {author} (Tags: {", ".join(tags)})\\n')
else:
    print(f"Failed status: {response.status_code}")`;

  const scrapyCode = `import scrapy

class QuotesSpider(scrapy.Spider):
    name = "quotes"
    start_urls = ["https://quotes.toscrape.com"]

    def parse(self, response):
        # Locate quote cards using CSS selectors
        for quote in response.css("div.quote"):
            yield {
                "text": quote.css("span.text::text").get(),
                "author": quote.css("small.author::text").get(),
                "tags": quote.css("a.tag::text").getall()
            }

        # Handle web pagination automatically
        next_page = response.css("li.next a::attr(href)").get()
        if next_page is not None:
            yield response.follow(next_page, self.parse)`;

  return (
    <div className="space-y-6" id="reference-hub-container">
      {/* Intro Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-sm">HTML & DOM Structure</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Web Scraping works by traversing the Document Object Model (DOM). Tags like <code>&lt;div&gt;</code>, 
            classes (<code>.product</code>), and IDs (<code>#header</code>) create tree layouts that scrapers query.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <Compass className="w-6 h-6 text-emerald-600" />
          <h3 className="font-bold text-slate-800 text-sm">Web Navigation</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Crawling refers to navigating page links automatically. Using headers like <code>User-Agent</code> 
            helps identify requests as coming from real browsers rather than empty headless scripts.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <ShieldAlert className="w-6 h-6 text-rose-600" />
          <h3 className="font-bold text-slate-800 text-sm">Bypassing Obstacles</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Websites use rate-limits or CAPTCHAs to stop flood requests. Ethical scrapers respect <code>robots.txt</code>, 
            add randomized delays, and rotate proxies to prevent IP bans.
          </p>
        </div>
      </div>

      {/* Code Examples Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BS4 Column */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">BeautifulSoup (Python)</h3>
            </div>
            <button
              onClick={() => copyToClipboard(bs4Code, "bs4")}
              className="text-[11px] text-slate-500 hover:text-slate-800 border rounded-lg px-2.5 py-1 flex items-center gap-1 transition"
            >
              {copiedSnippet === "bs4" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet === "bs4" ? "Copied" : "Copy Template"}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            BeautifulSoup is an elegant, easy-to-learn Python library for parsing HTML. It is perfect for static pages 
            where data is rendered on the server side.
          </p>
          <pre className="bg-slate-900 text-emerald-400 font-mono text-[10.5px] p-4 rounded-xl max-h-[300px] overflow-y-auto border border-slate-800 whitespace-pre">
            {bs4Code}
          </pre>
        </div>

        {/* Scrapy Column */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-sm">Scrapy Framework (Python)</h3>
            </div>
            <button
              onClick={() => copyToClipboard(scrapyCode, "scrapy")}
              className="text-[11px] text-slate-500 hover:text-slate-800 border rounded-lg px-2.5 py-1 flex items-center gap-1 transition"
            >
              {copiedSnippet === "scrapy" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet === "scrapy" ? "Copied" : "Copy Template"}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Scrapy is an enterprise-grade framework for multi-threaded, asynchronous scraping. It handles request concurrency, 
            caching, and auto-throttling out of the box.
          </p>
          <pre className="bg-slate-900 text-emerald-400 font-mono text-[10.5px] p-4 rounded-xl max-h-[300px] overflow-y-auto border border-slate-800 whitespace-pre">
            {scrapyCode}
          </pre>
        </div>
      </div>

      {/* No-Code Automated Scrapers tutorial */}
      <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-3">
        <h3 className="font-bold text-slate-800 text-base">No-Code Extraction Tools (Octoparse & ParseHub)</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          If you don't code in Python, you can utilize automated web scraping services such as <strong>Octoparse</strong>, 
          <strong>ParseHub</strong>, or the Chrome <strong>Web Scraper</strong> extension. Here is how they operate:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-3">
          <li className="bg-white p-4 rounded-xl border border-slate-100/70 space-y-1">
            <span className="font-bold text-indigo-600">1. Click-to-Select</span>
            <p className="text-slate-500">
              Open the target website in their built-in browser, click elements to define matching loops automatically.
            </p>
          </li>
          <li className="bg-white p-4 rounded-xl border border-slate-100/70 space-y-1">
            <span className="font-bold text-indigo-600">2. Auto-Pagination</span>
            <p className="text-slate-500">
              Select the "Next Page" button on the webpage, and configure standard click loops to fetch multi-page tables.
            </p>
          </li>
          <li className="bg-white p-4 rounded-xl border border-slate-100/70 space-y-1">
            <span className="font-bold text-indigo-600">3. Scheduled Tasks</span>
            <p className="text-slate-500">
              Run scrapers in the cloud, periodically refreshing database rows and exporting to Excel or Google Sheets.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
