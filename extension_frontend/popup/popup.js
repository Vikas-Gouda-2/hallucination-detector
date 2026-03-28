/**
 * TruthLens Extension Popup
 * Shows recent scans and quick actions
 */

const API_BASE = "http://localhost:8000";

// Initialize on popup open
document.addEventListener("DOMContentLoaded", () => {
  loadRecentScans();
  checkBackendStatus();
  setupEventListeners();
});

/**
 * Load and display recent scans
 */
async function loadRecentScans() {
  const { recentScans } = await chrome.storage.local.get("recentScans");

  const scansList = document.getElementById("scansList");

  if (!recentScans || recentScans.length === 0) {
    scansList.innerHTML = '<div class="no-scans">No scans yet</div>';
    return;
  }

  scansList.innerHTML = recentScans
    .map(
      (scan) => `
    <div class="scan-item ${scan.status.toLowerCase()}" onclick="openScanDetail('${scan.id}')">
      <div class="scan-header">
        <div class="scan-status ${scan.status.toLowerCase()}">
          ${scan.status}
        </div>
        <div class="scan-time">${scan.timestamp}</div>
      </div>
      <div class="scan-text">${scan.text}</div>
    </div>
  `
    )
    .join("");
}

/**
 * Check backend status
 */
async function checkBackendStatus() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (response.ok) {
      const data = await response.json();
      const statusEl = document.getElementById("backendStatus");
      statusEl.textContent = "✅ Connected";
      statusEl.style.color = "#00E676";
    } else {
      throw new Error("Backend error");
    }
  } catch (error) {
    const statusEl = document.getElementById("backendStatus");
    statusEl.textContent = "⚠️ Offline";
    statusEl.style.color = "#FF2D55";
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  document.getElementById("openDashboard").addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:5179" });
  });

  document.getElementById("clearHistory").addEventListener("click", () => {
    if (confirm("Clear all recent scans?")) {
      chrome.runtime.sendMessage({ action: "clearScans" }, () => {
        loadRecentScans();
      });
    }
  });
}

/**
 * Open scan detail (placeholder - will integrate with dashboard)
 */
function openScanDetail(scanId) {
  // Future: Open detailed view or dashboard with scan details
  console.log("Opening scan detail:", scanId);
  chrome.tabs.create({ url: `http://localhost:5179/scan/${scanId}` });
}

// Refresh scans every 2 seconds
setInterval(loadRecentScans, 2000);
