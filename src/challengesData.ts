import { Challenge } from "./types";

export const challenges: Challenge[] = [
  {
    id: "css-basics-1",
    title: "1. The Humble Tag Selector",
    difficulty: "Beginner",
    description: "Learn to select elements using their basic HTML tags.",
    instructions: "Write a CSS Selector to extract all book titles wrapped in <h3> tags.",
    htmlSnippet: `<div class="bookstore">
  <h2>Featured Collection</h2>
  <div class="book-card">
    <h3>The Great Gatsby</h3>
    <p class="author">F. Scott Fitzgerald</p>
    <span class="price">₹14.99</span>
  </div>
  <div class="book-card">
    <h3>To Kill a Mockingbird</h3>
    <p class="author">Harper Lee</p>
    <span class="price">₹12.50</span>
  </div>
</div>`,
    correctSelector: ["h3"],
    expectedOutput: ["The Great Gatsby", "To Kill a Mockingbird"],
    selectorType: "css",
    hint: "Use the tag name itself. Just type the letters of the heading tag that contains the titles."
  },
  {
    id: "css-classes-2",
    title: "2. Target Specific Classes",
    difficulty: "Beginner",
    description: "Classes group similar elements. Select only the active prices.",
    instructions: "Extract the current/active prices. Avoid the original prices marked with the '.old-price' class.",
    htmlSnippet: `<div class="products-grid">
  <div class="product">
    <span class="name">Wireless Mouse</span>
    <span class="price old-price">₹29.99</span>
    <span class="price current-price">₹19.99</span>
  </div>
  <div class="product">
    <span class="name">Mechanical Keyboard</span>
    <span class="price current-price">₹89.99</span>
  </div>
  <div class="product">
    <span class="name">USB-C Hub</span>
    <span class="price old-price">₹39.99</span>
    <span class="price current-price">₹24.99</span>
  </div>
</div>`,
    correctSelector: [".current-price", "span.current-price"],
    expectedOutput: ["₹19.99", "₹89.99", "₹24.99"],
    selectorType: "css",
    hint: "Prefix classes with a dot (.). The target class here is 'current-price'."
  },
  {
    id: "css-nesting-3",
    title: "3. Descendant & Child Selectors",
    difficulty: "Intermediate",
    description: "Target elements nested within specific structures to avoid matching others.",
    instructions: "Extract ONLY the navigation link texts inside the header menu. Do NOT match the footer links.",
    htmlSnippet: `<header class="app-header">
  <div class="brand">TechScrape</div>
  <nav class="nav-menu">
    <a href="/home" class="link">Home</a>
    <a href="/docs" class="link">Tutorials</a>
    <a href="/sandbox" class="link">Sandbox</a>
  </nav>
</header>
<footer class="app-footer">
  <div class="copyright">&copy; 2026 TechScrape</div>
  <div class="footer-links">
    <a href="/privacy" class="link">Privacy Policy</a>
    <a href="/terms" class="link">Terms of Service</a>
  </div>
</footer>`,
    correctSelector: [".nav-menu .link", "nav a", "nav .link", ".nav-menu > a", "nav > a"],
    expectedOutput: ["Home", "Tutorials", "Sandbox"],
    selectorType: "css",
    hint: "Combine parent and child. For example, '.nav-menu .link' matches any element with class 'link' that is inside '.nav-menu'."
  },
  {
    id: "css-attributes-4",
    title: "4. Extracting Attribute Values",
    difficulty: "Intermediate",
    description: "Sometimes we scrape properties like image sources or URLs in links.",
    instructions: "Write a CSS Selector to target links pointing to secure HTTPS domains (starts with 'https').",
    htmlSnippet: `<div class="resources">
  <h2>Scraping Resources</h2>
  <ul>
    <li><a href="https://beautiful-soup-4.readthedocs.io" class="resource-link">BS4 Official Docs</a></li>
    <li><a href="http://unsecured-blog.com/tips" class="resource-link">Legacy Blog Tips</a></li>
    <li><a href="https://scrapy.org" class="resource-link">Scrapy Framework</a></li>
    <li><a href="/local-help.html" class="resource-link">Local Help Page</a></li>
  </ul>
</div>`,
    correctSelector: ["a[href^='https']", "a[href^=\"https\"]"],
    expectedOutput: ["BS4 Official Docs", "Scrapy Framework"],
    selectorType: "css",
    hint: "Use attribute selectors: a[attribute^='value'] matches anchor tags whose attribute starts with 'value'."
  },
  {
    id: "xpath-basics-5",
    title: "5. Discovering XPath",
    difficulty: "Advanced",
    description: "XPath is an incredibly powerful XML path language supported by Scrapy and Selenium.",
    instructions: "Write an XPath expression to select the text content of all titles inside divs with the class 'news-item'.",
    htmlSnippet: `<div class="news-feed">
  <div class="news-item">
    <h2 class="title">AI Scraping is the Future</h2>
    <p class="summary">LLMs can parse any visual DOM structures easily...</p>
  </div>
  <div class="ad-banner">
    <h2 class="title">Buy Our Proxies Today!</h2>
  </div>
  <div class="news-item">
    <h2 class="title">BeautifulSoup v5 Announced</h2>
    <p class="summary">Major improvements in speed and memory usage...</p>
  </div>
</div>`,
    correctSelector: ["//div[@class='news-item']/h2/text()", "//div[@class=\"news-item\"]/h2/text()", "//div[contains(@class, 'news-item')]/h2/text()"],
    expectedOutput: ["AI Scraping is the Future", "BeautifulSoup v5 Announced"],
    selectorType: "xpath",
    hint: "Use double slashes to search anywhere: //div[@class='news-item']/h2/text(). You can append /text() to fetch direct node text."
  }
];
