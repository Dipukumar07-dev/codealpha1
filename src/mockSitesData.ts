import { MockSite } from "./types";

export const mockSites: MockSite[] = [
  {
    id: "bookstore",
    name: "BookLand E-Commerce",
    category: "E-Commerce",
    description: "A replica of an e-commerce catalog featuring books, star ratings, prices, and stock status.",
    html: `<div class="container mx-auto px-4 py-8">
  <header class="border-b pb-4 mb-8">
    <h1 class="text-3xl font-bold text-gray-800">BookLand</h1>
    <p class="text-gray-500">Your portal to adventure, science, and history</p>
  </header>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Book Item 1 -->
    <article class="book-item border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white" data-id="1">
      <div class="bg-blue-100 h-48 flex items-center justify-center relative">
        <span class="text-blue-500 font-semibold text-lg">Python Programming</span>
        <span class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">In Stock</span>
      </div>
      <div class="p-4">
        <div class="flex items-center space-x-1 text-yellow-500 mb-1" title="4.8 out of 5 stars">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
          <span class="text-xs text-gray-400 ml-1">(4.8)</span>
        </div>
        <h3 class="book-title text-lg font-bold text-gray-900 mb-1">Mastering Python & OOP</h3>
        <p class="book-author text-sm text-gray-500 mb-3">By Dr. Alistair Ross</p>
        <div class="flex items-center justify-between">
          <span class="book-price text-xl font-extrabold text-blue-600">₹45.99</span>
          <button class="add-to-cart bg-gray-900 hover:bg-gray-800 text-white text-xs px-3 py-1.5 rounded">Add</button>
        </div>
      </div>
    </article>

    <!-- Book Item 2 -->
    <article class="book-item border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white" data-id="2">
      <div class="bg-amber-100 h-48 flex items-center justify-center relative">
        <span class="text-amber-500 font-semibold text-lg">Web Automation</span>
        <span class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">In Stock</span>
      </div>
      <div class="p-4">
        <div class="flex items-center space-x-1 text-yellow-500 mb-1" title="4.2 out of 5 stars">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
          <span class="text-xs text-gray-400 ml-1">(4.2)</span>
        </div>
        <h3 class="book-title text-lg font-bold text-gray-900 mb-1">Web Scraping in Python 101</h3>
        <p class="book-author text-sm text-gray-500 mb-3">By Sarah Jenkins</p>
        <div class="flex items-center justify-between">
          <span class="book-price text-xl font-extrabold text-blue-600">₹29.95</span>
          <button class="add-to-cart bg-gray-900 hover:bg-gray-800 text-white text-xs px-3 py-1.5 rounded">Add</button>
        </div>
      </div>
    </article>

    <!-- Book Item 3 -->
    <article class="book-item border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white" data-id="3">
      <div class="bg-purple-100 h-48 flex items-center justify-center relative">
        <span class="text-purple-500 font-semibold text-lg">Data Science</span>
        <span class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Out of Stock</span>
      </div>
      <div class="p-4">
        <div class="flex items-center space-x-1 text-yellow-500 mb-1" title="5.0 out of 5 stars">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          <span class="text-xs text-gray-400 ml-1">(5.0)</span>
        </div>
        <h3 class="book-title text-lg font-bold text-gray-900 mb-1">Machine Learning Cookbook</h3>
        <p class="book-author text-sm text-gray-500 mb-3">By Prof. Marc Davis</p>
        <div class="flex items-center justify-between">
          <span class="book-price text-xl font-extrabold text-blue-600">₹59.99</span>
          <button class="add-to-cart bg-gray-300 text-gray-600 text-xs px-3 py-1.5 rounded cursor-not-allowed" disabled>Sold Out</button>
        </div>
      </div>
    </article>

    <!-- Book Item 4 -->
    <article class="book-item border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white" data-id="4">
      <div class="bg-rose-100 h-48 flex items-center justify-center relative">
        <span class="text-rose-500 font-semibold text-lg">Network Security</span>
        <span class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">In Stock</span>
      </div>
      <div class="p-4">
        <div class="flex items-center space-x-1 text-yellow-500 mb-1" title="3.9 out of 5 stars">
          <span>★</span><span>★</span><span>★</span><span>☆</span><span>☆</span>
          <span class="text-xs text-gray-400 ml-1">(3.9)</span>
        </div>
        <h3 class="book-title text-lg font-bold text-gray-900 mb-1">Ethical Hacking & Defence</h3>
        <p class="book-author text-sm text-gray-500 mb-3">By Alex Vance</p>
        <div class="flex items-center justify-between">
          <span class="book-price text-xl font-extrabold text-blue-600">₹34.50</span>
          <button class="add-to-cart bg-gray-900 hover:bg-gray-800 text-white text-xs px-3 py-1.5 rounded">Add</button>
        </div>
      </div>
    </article>
  </div>
</div>`,
    defaultSelector: "article.book-item",
    suggestedFields: [
      { name: "Title", selector: "h3.book-title", description: "Selects book headlines" },
      { name: "Author", selector: ".book-author", description: "Selects writer names" },
      { name: "Price", selector: ".book-price", description: "Selects cost of book" },
      { name: "Stock Status", selector: "span.absolute", description: "Selects in-stock indicator text" }
    ]
  },
  {
    id: "newsportal",
    name: "TechPulse Blog & News",
    category: "News",
    description: "A digital tech blog showing tags, article headers, publish date, and summaries.",
    html: `<div class="container mx-auto px-4 py-8">
  <header class="mb-10 text-center border-b pb-6">
    <h1 class="text-4xl font-extrabold text-slate-900">TechPulse Feed</h1>
    <p class="text-slate-500 text-sm mt-1">Real-time pulses from the tech & dev ecosystem</p>
  </header>

  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Article 1 -->
    <div class="news-card flex flex-col md:flex-row gap-6 p-6 border rounded-xl hover:bg-slate-50 transition bg-white">
      <div class="md:w-1/3">
        <div class="bg-slate-200 h-40 rounded-lg flex items-center justify-center font-mono text-xs text-slate-500">
          IMAGE: AI_AGENT
        </div>
      </div>
      <div class="md:w-2/3 flex flex-col justify-between">
        <div>
          <div class="flex items-center space-x-2 mb-2">
            <span class="category-tag text-xs font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-600">AI & Tech</span>
            <span class="publish-time text-xs text-slate-400">10 mins ago</span>
          </div>
          <h2 class="post-title text-xl font-bold text-slate-900 mb-2 hover:text-indigo-600">
            <a href="/news/ai-agents-scaling">AI Coding Agents Pass Enterprise Benchmarks</a>
          </h2>
          <p class="post-excerpt text-sm text-slate-600">
            A new suite of full-stack testing reveals AI developers can write code, fix compilation errors, and setup server-side proxy layers in under 4 minutes.
          </p>
        </div>
        <div class="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>By Elena Rostova</span>
          <span>5 min read</span>
        </div>
      </div>
    </div>

    <!-- Article 2 -->
    <div class="news-card flex flex-col md:flex-row gap-6 p-6 border rounded-xl hover:bg-slate-50 transition bg-white">
      <div class="md:w-1/3">
        <div class="bg-slate-200 h-40 rounded-lg flex items-center justify-center font-mono text-xs text-slate-500">
          IMAGE: REACT_19
        </div>
      </div>
      <div class="md:w-2/3 flex flex-col justify-between">
        <div>
          <div class="flex items-center space-x-2 mb-2">
            <span class="category-tag text-xs font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-600">Web Dev</span>
            <span class="publish-time text-xs text-slate-400">2 hours ago</span>
          </div>
          <h2 class="post-title text-xl font-bold text-slate-900 mb-2 hover:text-emerald-600">
            <a href="/news/react-19-server-actions">Mastering React Server Actions and Forms</a>
          </h2>
          <p class="post-excerpt text-sm text-slate-600">
            React 19 forms have simplified state tracking. Explore how useActionState handles error states, pending properties, and automatic database updates seamlessly.
          </p>
        </div>
        <div class="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>By Daniel Craig</span>
          <span>8 min read</span>
        </div>
      </div>
    </div>

    <!-- Article 3 -->
    <div class="news-card flex flex-col md:flex-row gap-6 p-6 border rounded-xl hover:bg-slate-50 transition bg-white">
      <div class="md:w-1/3">
        <div class="bg-slate-200 h-40 rounded-lg flex items-center justify-center font-mono text-xs text-slate-500">
          IMAGE: CSS_GRID
        </div>
      </div>
      <div class="md:w-2/3 flex flex-col justify-between">
        <div>
          <div class="flex items-center space-x-2 mb-2">
            <span class="category-tag text-xs font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-600">Design Systems</span>
            <span class="publish-time text-xs text-slate-400">Yesterday</span>
          </div>
          <h2 class="post-title text-xl font-bold text-slate-900 mb-2 hover:text-purple-600">
            <a href="/news/css-bento-grids">Bento Grid Layout Patterns in Tailwind v4</a>
          </h2>
          <p class="post-excerpt text-sm text-slate-600">
            Learn why the bento layout is dominant in developer dashboards, Apple launches, and how modern grid-span features make mobile responsiveness effortless.
          </p>
        </div>
        <div class="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>By Sarah Cho</span>
          <span>4 min read</span>
        </div>
      </div>
    </div>
  </div>
</div>`,
    defaultSelector: "div.news-card",
    suggestedFields: [
      { name: "Category", selector: ".category-tag", description: "Selects category tags" },
      { name: "Title", selector: "h2.post-title a", description: "Selects article headlines" },
      { name: "Excerpt", selector: ".post-excerpt", description: "Selects description snippets" },
      { name: "Time", selector: ".publish-time", description: "Selects relative publication age" }
    ]
  },
  {
    id: "financial",
    name: "CoinMetric Live Prices",
    category: "Tables & Finance",
    description: "A standard financial tabular list reporting pricing, abbreviations, volume, and percentage changes.",
    html: `<div class="container mx-auto px-4 py-8">
  <header class="mb-6">
    <h1 class="text-2xl font-bold text-slate-800">CoinMetric Markets</h1>
    <p class="text-sm text-slate-400">Standardized HTML Table for database scraping practice</p>
  </header>
  
  <div class="overflow-x-auto border rounded-lg shadow-sm bg-white">
    <table class="min-w-full divide-y divide-slate-200" id="crypto-table">
      <thead class="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">
        <tr>
          <th class="px-6 py-3">Asset</th>
          <th class="px-6 py-3">Symbol</th>
          <th class="px-6 py-3">Price</th>
          <th class="px-6 py-3">24h Change</th>
          <th class="px-6 py-3">Market Cap</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
        <tr class="crypto-row hover:bg-slate-50">
          <td class="px-6 py-4 font-bold text-slate-900 asset-name">Bitcoin</td>
          <td class="px-6 py-4 font-mono text-slate-500 asset-symbol">BTC</td>
          <td class="px-6 py-4 font-medium asset-price">₹62,840.00</td>
          <td class="px-6 py-4 text-green-600 font-semibold asset-change">+2.45%</td>
          <td class="px-6 py-4 text-slate-500 asset-cap">₹1.24 Trillion</td>
        </tr>
        <tr class="crypto-row hover:bg-slate-50">
          <td class="px-6 py-4 font-bold text-slate-900 asset-name">Ethereum</td>
          <td class="px-6 py-4 font-mono text-slate-500 asset-symbol">ETH</td>
          <td class="px-6 py-4 font-medium asset-price">₹3,425.50</td>
          <td class="px-6 py-4 text-red-500 font-semibold asset-change">-1.12%</td>
          <td class="px-6 py-4 text-slate-500 asset-cap">₹411.2 Billion</td>
        </tr>
        <tr class="crypto-row hover:bg-slate-50">
          <td class="px-6 py-4 font-bold text-slate-900 asset-name">Solana</td>
          <td class="px-6 py-4 font-mono text-slate-500 asset-symbol">SOL</td>
          <td class="px-6 py-4 font-medium asset-price">₹142.10</td>
          <td class="px-6 py-4 text-green-600 font-semibold asset-change">+6.89%</td>
          <td class="px-6 py-4 text-slate-500 asset-cap">₹65.8 Billion</td>
        </tr>
        <tr class="crypto-row hover:bg-slate-50">
          <td class="px-6 py-4 font-bold text-slate-900 asset-name">Cardano</td>
          <td class="px-6 py-4 font-mono text-slate-500 asset-symbol">ADA</td>
          <td class="px-6 py-4 font-medium asset-price">₹0.485</td>
          <td class="px-6 py-4 text-slate-500 font-semibold asset-change">0.00%</td>
          <td class="px-6 py-4 text-slate-500 asset-cap">₹17.1 Billion</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`,
    defaultSelector: "tr.crypto-row",
    suggestedFields: [
      { name: "Name", selector: ".asset-name", description: "Asset full name" },
      { name: "Symbol", selector: ".asset-symbol", description: "Asset uppercase trading symbol" },
      { name: "Price", selector: ".asset-price", description: "Current USD asset price" },
      { name: "24h Change", selector: ".asset-change", description: "Asset price percentage swing" }
    ]
  }
];
