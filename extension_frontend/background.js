/**
 * TruthLens Background Service Worker
 */

const API_BASE = "http://localhost:8000";
let recentScans = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeText") {
    // Relying on chrome.storage.session for caching active strings
    chrome.storage.session.set({ activeText: request.text }).then(() => {
      analyzeText(request.text, request.sourceUrl, sender.tab.url)
        .then((result) => sendResponse({ success: true, data: result, originalText: request.text, rect: request.rect }))
        .catch((error) => sendResponse({ success: false, error: error.message }));
    });
    return true; 
  }

  if (request.action === "getRecentScans") {
    chrome.storage.local.get("recentScans").then((res) => {
      sendResponse({ scans: res.recentScans || [] });
    });
    return true;
  }

  if (request.action === "clearScans") {
    chrome.storage.local.set({ recentScans: [] }).then(() => {
      recentScans = [];
      sendResponse({ success: true });
    });
    return true;
  }
});

async function analyzeText(text, sourceUrl, tabUrl) {
  try {
    const { userId } = await chrome.storage.local.get("userId");
    const userIdToUse = userId || `ext-user-${Date.now()}`;

    // Read cached active text
    const session = await chrome.storage.session.get("activeText");
    const textToAnalyze = session.activeText || text;

    const response = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: textToAnalyze,
        source_url: sourceUrl || tabUrl,
        user_id: userIdToUse,
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.statusText}`);

    const result = await response.json();

    const { recentScans: storageScans } = await chrome.storage.local.get("recentScans");
    let currentScans = storageScans || [];

    const scan = {
      id: result.scan_id,
      text: textToAnalyze.substring(0, 100) + "...",
      status: result.status,
      confidence: result.confidence,
      timestamp: new Date().toLocaleString(),
      sourceUrl: sourceUrl || tabUrl,
    };

    currentScans.unshift(scan);
    if (currentScans.length > 5) currentScans.pop();

    await chrome.storage.local.set({ recentScans: currentScans });
    recentScans = currentScans;

    return result;
  } catch (error) {
    console.error("Error analyzing text:", error);
    throw error;
  }
}

// Native Context Menu
chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    id: "truthlens-analyze",
    title: "Analyze with TruthLens",
    contexts: ["selection"]
  });

  if (details.reason === "install") {
    chrome.tabs.create({ url: "popup/popup.html" });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "truthlens-analyze" && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, { action: "triggerScan", text: info.selectionText });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "trigger-scan") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "triggerScan" });
    });
  }
});
