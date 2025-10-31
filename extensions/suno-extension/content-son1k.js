// Content script for Super-Son1k websites

class Son1kIntegration {
  constructor() {
    this.initializeIntegration()
  }

  initializeIntegration() {
    console.log('Super-Son1k Integration initialized')
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'TOKEN_CAPTURED') {
        this.showTokenSyncNotification(message.token)
      }
    })

    // Add extension status indicator
    this.addStatusIndicator()
    
    // Monitor for token sync requests
    this.monitorTokenSync()
  }

  addStatusIndicator() {
    // Create status indicator
    const indicator = document.createElement('div')
    indicator.id = 'son1k-extension-status'
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #1a1a1a;
      border: 1px solid #00FFE7;
      color: #00FFE7;
      padding: 8px 12px;
      border-radius: 6px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    `

    indicator.innerHTML = `
      <div style="width: 6px; height: 6px; background: #00FFE7; border-radius: 50%; animation: pulse 2s infinite;"></div>
      <span>Super-Son1k Extension Active</span>
    `

    // Add pulse animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `
    document.head.appendChild(style)

    // Add click handler
    indicator.addEventListener('click', () => {
      this.openExtensionPopup()
    })

    // Add to page
    document.body.appendChild(indicator)

    // Auto-hide after 5 seconds
    setTimeout(() => {
      indicator.style.opacity = '0.7'
    }, 5000)
  }

  showTokenSyncNotification(token) {
    // Create sync notification
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1a1a1a;
      border: 1px solid #00FFE7;
      color: #00FFE7;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
    `

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <div style="width: 8px; height: 8px; background: #00FFE7; border-radius: 50%;"></div>
        <span>Token Synced!</span>
      </div>
      <div style="font-size: 12px; color: #999; margin-bottom: 8px;">
        Token ID: ${token.id.substring(0, 12)}...
      </div>
      <button id="sync-tokens-btn" style="
        background: #00FFE7;
        color: #000;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        font-weight: 500;
      ">Sync All Tokens</button>
    `

    // Add animation styles
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `
    document.head.appendChild(style)

    // Add to page
    document.body.appendChild(notification)

    // Add sync button handler
    const syncBtn = notification.querySelector('#sync-tokens-btn')
    syncBtn.addEventListener('click', () => {
      this.syncAllTokens()
    })

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 5000)
  }

  async syncAllTokens() {
    try {
      // Send sync request to background script
      const response = await chrome.runtime.sendMessage({
        type: 'SYNC_TOKENS'
      })

      if (response.success) {
        this.showSyncSuccessNotification()
      } else {
        this.showSyncErrorNotification(response.error)
      }
    } catch (error) {
      console.error('Error syncing tokens:', error)
      this.showSyncErrorNotification(error.message)
    }
  }

  showSyncSuccessNotification() {
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1a1a1a;
      border: 1px solid #00FFE7;
      color: #00FFE7;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 8px; height: 8px; background: #00FFE7; border-radius: 50%;"></div>
        <span>All tokens synced successfully!</span>
      </div>
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 3000)
  }

  showSyncErrorNotification(error) {
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1a1a1a;
      border: 1px solid #ff4444;
      color: #ff4444;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 8px; height: 8px; background: #ff4444; border-radius: 50%;"></div>
        <span>Sync failed: ${error}</span>
      </div>
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 5000)
  }

  monitorTokenSync() {
    // Listen for custom events from the page
    window.addEventListener('son1k-token-sync', (event) => {
      this.syncAllTokens()
    })

    // Add sync button to page if it doesn't exist
    this.addSyncButton()
  }

  addSyncButton() {
    // Check if sync button already exists
    if (document.getElementById('son1k-sync-button')) {
      return
    }

    const syncButton = document.createElement('button')
    syncButton.id = 'son1k-sync-button'
    syncButton.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      background: #00FFE7;
      color: #000;
      border: none;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    `

    syncButton.innerHTML = '🔄 Sync Tokens'
    syncButton.addEventListener('click', () => {
      this.syncAllTokens()
    })

    syncButton.addEventListener('mouseenter', () => {
      syncButton.style.background = '#00FFE7CC'
    })

    syncButton.addEventListener('mouseleave', () => {
      syncButton.style.background = '#00FFE7'
    })

    document.body.appendChild(syncButton)
  }

  openExtensionPopup() {
    // Open extension popup
    chrome.runtime.sendMessage({
      type: 'OPEN_POPUP'
    })
  }
}

// Initialize integration
window.son1kIntegration = new Son1kIntegration()
