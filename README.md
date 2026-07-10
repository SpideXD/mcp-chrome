# SpidexLab's Multi-Tenant Browser MCP 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://developer.chrome.com/docs/extensions/)

> 🌟 **SpidexLab's Custom Fork for Autonomous Agents** - This is a modified version of the Chrome MCP Server, specifically re-architected to support **Multi-Tenant Tab Multiplexing** and **Concurrent Agents**. 
> 
> *This is a specialized fork. For the original upstream project, please visit [hangwin/mcp-chrome](https://github.com/hangwin/mcp-chrome).*

**📖 Documentation**: [English](README.md)

---

## 🎯 What makes this fork different?

The original Chrome MCP Server is an incredibly powerful tool that exposes Chrome browser functionality to AI assistants. However, it was built with a 1-to-1 connection limit in mind (one agent controlling one browser session). 

**The SpidexLab Modification (V3: The Multiplier):**
We have modified the native server bridging logic and extension messaging architecture to support a multi-tenant execution queue. This allows **multiple autonomous AI agents to connect to the same browser instance concurrently**. Each agent operates in its own isolated browser tab context, allowing 2, 5, or 10 agents to parallelize web research and automation tasks without connection resets or state collisions.

## ✨ Core Features

- 👯 **Multi-Tenant Tab Multiplexing**: Concurrent agents can operate simultaneously in isolated tab contexts.
- 😁 **Chatbot/Model Agnostic**: Let any LLM or chatbot client or agent you prefer automate your browser
- ⭐️ **Use Your Original Browser**: Seamlessly integrate with your existing browser environment (your configurations, login states, etc.)
- 💻 **Fully Local**: Pure local MCP server ensuring user privacy
- 🚄 **Streamable HTTP**: Streamable HTTP connection method
- 🏎 **Cross-Tab**: Cross-tab context
- 🧠 **Semantic Search**: Built-in vector database for intelligent browser tab content discovery
- 🔍 **Smart Content Analysis**: AI-powered text extraction and similarity matching
- 🌐 **20+ Tools**: Support for screenshots, network monitoring, interactive operations, bookmark management, browsing history, and 20+ other tools

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0 and pnpm/npm
- Chrome/Chromium browser

### Installation Steps

1. **Download the latest Chrome extension from GitHub**
   Download the `chrome-mcp-server-latest.zip` from the `releases/` folder in this repository.

2. **Install mcp-chrome-bridge globally**

```bash
npm install -g mcp-chrome-bridge
```

3. **Load Chrome Extension**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the unzipped extension folder
   - Click the extension icon to open the plugin, then click connect to see the MCP configuration.

### Usage with MCP Protocol Clients

#### Using Streamable HTTP Connection (👍🏻 Recommended)

Add the following configuration to your MCP client configuration:

```json
{
  "mcpServers": {
    "chrome-mcp-server": {
      "type": "streamableHttp",
      "url": "http://127.0.0.1:12306/mcp"
    }
  }
}
```

## 🛠️ Available Tools

Complete tool list: [Complete Tool List](docs/TOOLS.md)

<details>
<summary><strong>📊 Browser Management (6 tools)</strong></summary>

- `get_windows_and_tabs` - List all browser windows and tabs
- `chrome_navigate` - Navigate to URLs and control viewport
- `chrome_switch_tab` - Switch the current active tab
- `chrome_close_tabs` - Close specific tabs or windows
- `chrome_go_back_or_forward` - Browser navigation control
- `chrome_inject_script` - Inject content scripts into web pages
- `chrome_send_command_to_inject_script` - Send commands to injected content scripts
</details>

<details>
<summary><strong>📸 Screenshots & Visual (1 tool)</strong></summary>

- `chrome_screenshot` - Advanced screenshot capture with element targeting, full-page support, and custom dimensions
</details>

<details>
<summary><strong>🌐 Network Monitoring (4 tools)</strong></summary>

- `chrome_network_capture_start/stop` - webRequest API network capture
- `chrome_network_debugger_start/stop` - Debugger API with response bodies
- `chrome_network_request` - Send custom HTTP requests
</details>

<details>
<summary><strong>🔍 Content Analysis (4 tools)</strong></summary>

- `search_tabs_content` - AI-powered semantic search across browser tabs
- `chrome_get_web_content` - Extract HTML/text content from pages
- `chrome_get_interactive_elements` - Find clickable elements
- `chrome_console` - Capture and retrieve console output from browser tabs
</details>

<details>
<summary><strong>🎯 Interaction (3 tools)</strong></summary>

- `chrome_click_element` - Click elements using CSS selectors
- `chrome_fill_or_select` - Fill forms and select options
- `chrome_keyboard` - Simulate keyboard input and shortcuts
</details>

<details>
<summary><strong>📚 Data Management (5 tools)</strong></summary>

- `chrome_history` - Search browser history with time filters
- `chrome_bookmark_search` - Find bookmarks by keywords
- `chrome_bookmark_add` - Add new bookmarks with folder support
- `chrome_bookmark_delete` - Delete bookmarks
</details>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. Based on the original [hangwin/mcp-chrome](https://github.com/hangwin/mcp-chrome) repository.

## 📚 More Documentation

- [Architecture Design](docs/ARCHITECTURE.md) - Detailed technical architecture documentation
- [TOOLS API](docs/TOOLS.md) - Complete tool API documentation
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issue solutions
