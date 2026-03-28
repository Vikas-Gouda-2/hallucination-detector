/**
 * TruthLens Content Script - Main World Injection
 */

let currentOverlay = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "triggerScan") {
    let selectedText = request.text || window.getSelection().toString();
    if (selectedText.length > 50) {
      scanText(selectedText);
    } else {
      showNotification("Please select at least 50 characters", "error");
    }
  }
});

async function scanText(text) {
  try {
    const selection = window.getSelection();
    let rect = null;
    if (selection.rangeCount > 0) {
      rect = selection.getRangeAt(0).getBoundingClientRect();
    } else {
      rect = { top: 20, left: 20, width: 0, height: 0, bottom: 20, right: 20 };
    }
    
    showLoadingSpinner(rect);
    
    chrome.runtime.sendMessage(
      {
        action: "analyzeText",
        text: text,
        sourceUrl: window.location.href,
      },
      (response) => {
        removeLoadingSpinner();
        
        if (response && response.success) {
          showResultOverlay(response.data, text, rect);
        } else {
          showNotification("Error: " + (response && response.error ? response.error : "Unknown"), "error");
        }
      }
    );
  } catch (error) {
    removeLoadingSpinner();
    showNotification("Failed", "error");
  }
}

function removeLoadingSpinner() {
  const spinner = document.getElementById("tl-spinner");
  if (spinner) spinner.remove();
}

function showLoadingSpinner(rect) {
  removeLoadingSpinner();
  if (currentOverlay) {
    currentOverlay.remove();
    currentOverlay = null;
  }

  const wrapper = document.createElement("div");
  wrapper.id = "tl-spinner";
  
  const top = rect.bottom + window.scrollY + 10;
  const left = rect.left + window.scrollX;
  
  wrapper.style.cssText = `position: absolute; top: ${top}px; left: ${left}px; background: #080C10; color: #E2E8F0; padding: 16px 20px; border-radius: 8px; border: 1px solid rgba(0,229,255,0.2); box-shadow: 0 4px 12px rgba(0,0,0,0.5), 0 0 15px rgba(0,229,255,0.1); z-index: 2147483647; display: flex; align-items: center; gap: 12px; font-family: system-ui, sans-serif;`;

  wrapper.innerHTML = `<div style="width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid #00E5FF; border-radius: 50%; animation: tl-spin 1s linear infinite;"></div><div><div style="font-weight: 600; font-size: 14px; color: #00E5FF;">Analyzing Text...</div></div>`;

  if (!document.getElementById("tl-style")) {
    const style = document.createElement("style");
    style.id = "tl-style";
    style.textContent = `@keyframes tl-spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
  }

  document.body.appendChild(wrapper);
}

function showResultOverlay(result, originalText, rect) {
  if (currentOverlay) currentOverlay.remove();

  const wrapper = document.createElement("div");
  currentOverlay = wrapper;
  
  let bc = "#FFB800"; let bgGlow = "rgba(255,184,0,0.1)";
  if (result.status === "Red") { bc = "#FF2D55"; bgGlow = "rgba(255,45,85,0.1)"; }
  else if (result.status === "Green") { bc = "#00E676"; bgGlow = "rgba(0,230,118,0.1)"; }

  const top = rect.bottom + window.scrollY + 10;
  const left = rect.left + window.scrollX;

  wrapper.style.cssText = `position: absolute; top: ${top}px; left: ${Math.max(10, left)}px; width: 380px; background: #080C10; color: #E2E8F0; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); border-top: 3px solid ${bc}; box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px ${bgGlow}; z-index: 2147483647; font-family: Inter, system-ui, sans-serif; overflow: hidden;`;

  const safeText = originalText.substring(0, 100) + (originalText.length > 100 ? "..." : "");

  wrapper.innerHTML = `
    <div style="padding: 16px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 12px; align-items: center;">
        <div style="font-weight: 700; color: ${bc}; font-size: 16px;">${result.status} Result</div>
        <button id="tl-close" style="background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 18px;">✕</button>
      </div>
      <div style="font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 16px; border-left: 2px solid rgba(255,255,255,0.2); padding-left: 10px; font-style: italic;">"${safeText}"</div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 12px;">
        <div>
          <div style="color: rgba(255,255,255,0.5);">CONFIDENCE</div>
          <div style="font-weight: 600;">${result.confidence}%</div>
        </div>
        <div>
          <div style="color: rgba(255,255,255,0.5);">CONSISTENCY</div>
          <div style="font-weight: 600;">${result.consistency_score || result.confidence}%</div>
        </div>
      </div>
      <div style="margin-bottom: 16px;">
        <div style="color: rgba(255,255,255,0.5); font-size: 11px; margin-bottom: 8px;">REASONING</div>
        <div style="font-size: 13px; color: rgba(255,255,255,0.9); line-height: 1.5;">${result.reasoning || "Done."}</div>
      </div>
      <button id="tl-dashboard" style="width: 100%; background: rgba(0,229,255,0.1); color: #00E5FF; border: 1px solid rgba(0,229,255,0.3); padding: 10px; border-radius: 6px; cursor: pointer; font-weight: 600;">View Dashboard</button>
    </div>
  `;

  document.body.appendChild(wrapper);

  document.getElementById("tl-close").addEventListener("click", () => { wrapper.remove(); currentOverlay = null; });
  document.getElementById("tl-dashboard").addEventListener("click", () => {
    wrapper.remove(); currentOverlay = null;
    window.open(`http://localhost:5179/scan/${result.scan_id}`, "_blank");
  });
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  const bd = type === "error" ? "#FF2D55" : "#00E5FF";
  notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: #080C10; color: ${bd}; border: 1px solid ${bd}; padding: 12px 16px; border-radius: 6px; z-index: 2147483647;`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 4000);
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === "V" || e.key === "v")) {
    const sel = window.getSelection().toString();
    if (sel.length > 50) scanText(sel);
    else if (sel.length > 0) showNotification("Please select at least 50 characters", "error");
  }
});