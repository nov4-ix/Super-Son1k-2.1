// Popup script for Super-Son1k Token Capture Extension

class PopupManager {
  constructor() {
    this.tokens = []
    this.initializePopup()
  }

  async initializePopup() {
    console.log('Popup initialized')
    
    // Load tokens
    await this.loadTokens()
    
    // Setup event listeners
    this.setupEventListeners()
    
    // Update UI
    this.updateUI()
  }

  setupEventListeners() {
    // Sync button
    document.getElementById('sync-btn').addEventListener('click', () => {
      this.syncTokens()
    })

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', () => {
      this.loadTokens()
    })

    // Clear button
    document.getElementById('clear-btn').addEventListener('click', () => {
      this.clearTokens()
    })

    // Extract and send to pool button
    const extractBtn = document.getElementById('extract-to-pool-btn')
    if (extractBtn) {
      extractBtn.addEventListener('click', () => {
        this.extractAndSendToPool()
      })
    }

    // Send selected token to pool
    const sendSelectedBtn = document.getElementById('send-selected-btn')
    if (sendSelectedBtn) {
      sendSelectedBtn.addEventListener('click', () => {
        this.sendSelectedTokenToPool()
      })
    }
  }

  async loadTokens() {
    try {
      // Show loading state
      this.showLoading()

      // Get tokens from background script
      const response = await chrome.runtime.sendMessage({
        type: 'GET_CAPTURED_TOKENS'
      })

      if (response.success) {
        this.tokens = response.tokens
        this.updateUI()
      } else {
        this.showError('Failed to load tokens')
      }
    } catch (error) {
      console.error('Error loading tokens:', error)
      this.showError('Error loading tokens')
    }
  }

  async syncTokens() {
    try {
      // Disable sync button
      const syncBtn = document.getElementById('sync-btn')
      syncBtn.disabled = true
      syncBtn.textContent = '🔄 Syncing...'

      // Send sync request
      const response = await chrome.runtime.sendMessage({
        type: 'SYNC_TOKENS'
      })

      if (response.success) {
        this.showSuccess('Tokens synced successfully!')
        await this.loadTokens() // Refresh the list
      } else {
        this.showError(`Sync failed: ${response.error}`)
      }
    } catch (error) {
      console.error('Error syncing tokens:', error)
      this.showError('Error syncing tokens')
    } finally {
      // Re-enable sync button
      const syncBtn = document.getElementById('sync-btn')
      syncBtn.disabled = false
      syncBtn.textContent = '🔄 Sync Tokens'
    }
  }

  async clearTokens() {
    if (!confirm('Are you sure you want to clear all tokens?')) {
      return
    }

    try {
      // Disable clear button
      const clearBtn = document.getElementById('clear-btn')
      clearBtn.disabled = true
      clearBtn.textContent = '🗑️ Clearing...'

      // Send clear request
      const response = await chrome.runtime.sendMessage({
        type: 'CLEAR_TOKENS'
      })

      if (response.success) {
        this.showSuccess('All tokens cleared!')
        await this.loadTokens() // Refresh the list
      } else {
        this.showError(`Clear failed: ${response.error}`)
      }
    } catch (error) {
      console.error('Error clearing tokens:', error)
      this.showError('Error clearing tokens')
    } finally {
      // Re-enable clear button
      const clearBtn = document.getElementById('clear-btn')
      clearBtn.disabled = false
      clearBtn.textContent = '🗑️ Clear All'
    }
  }

  updateUI() {
    this.updateStats()
    this.updateTokenList()
  }

  updateStats() {
    const totalTokens = this.tokens.length
    const validTokens = this.tokens.filter(token => token.isValid).length

    document.getElementById('total-tokens').textContent = totalTokens
    document.getElementById('valid-tokens').textContent = validTokens
  }

  updateTokenList() {
    const tokenList = document.getElementById('token-list')
    
    if (this.tokens.length === 0) {
      tokenList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎵</div>
          <div>No tokens captured yet</div>
          <div style="font-size: 11px; margin-top: 4px;">
            Visit Suno.com to start capturing tokens
          </div>
        </div>
      `
      return
    }

    tokenList.innerHTML = this.tokens.map(token => `
      <div class="token-item">
        <div class="token-info">
          <div class="token-id">${token.id.substring(0, 12)}...</div>
          <div class="token-source">${token.metadata?.source || 'unknown'} • ${this.formatDate(token.capturedAt)}</div>
        </div>
        <div class="token-status ${token.isValid ? 'valid' : ''}">
          ${token.isValid ? 'Valid' : 'Invalid'}
        </div>
      </div>
    `).join('')
  }

  showLoading() {
    const tokenList = document.getElementById('token-list')
    tokenList.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
      </div>
    `
  }

  showSuccess(message) {
    this.showNotification(message, 'success')
  }

  showError(message) {
    this.showNotification(message, 'error')
  }

  showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      right: 10px;
      background: ${type === 'success' ? '#00FFE7' : '#ff4444'};
      color: ${type === 'success' ? '#000' : '#fff'};
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      z-index: 1000;
      text-align: center;
    `

    notification.textContent = message
    document.body.appendChild(notification)

    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 3000)
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString()
  }

  async extractAndSendToPool() {
    try {
      const extractBtn = document.getElementById('extract-to-pool-btn')
      extractBtn.disabled = true
      extractBtn.textContent = '⏳ Extrayendo...'

      // Extract token from cookies and send to pool
      const response = await chrome.runtime.sendMessage({
        type: 'EXTRACT_AND_SEND_TO_POOL',
        label: `extension-${Date.now()}`
      })

      if (response.success) {
        this.showSuccess(`✅ Token extraído y enviado al pool!`)
        await this.loadTokens() // Refresh token list
      } else {
        this.showError(`❌ Error: ${response.error}`)
      }
    } catch (error) {
      console.error('Error extracting and sending to pool:', error)
      this.showError('Error al extraer/enviar token')
    } finally {
      const extractBtn = document.getElementById('extract-to-pool-btn')
      extractBtn.disabled = false
      extractBtn.textContent = '🔑 Extraer y Enviar al Pool'
    }
  }

  async sendSelectedTokenToPool() {
    // For now, send the most recent token
    if (this.tokens.length === 0) {
      this.showError('No hay tokens capturados')
      return
    }

    const latestToken = this.tokens[this.tokens.length - 1]

    try {
      const sendBtn = document.getElementById('send-selected-btn')
      sendBtn.disabled = true
      sendBtn.textContent = '⏳ Enviando...'

      const response = await chrome.runtime.sendMessage({
        type: 'SEND_TOKEN_TO_POOL',
        token: latestToken.token,
        label: `extension-${latestToken.id}`
      })

      if (response.success) {
        this.showSuccess(`✅ Token enviado al pool!`)
      } else {
        this.showError(`❌ Error: ${response.error}`)
      }
    } catch (error) {
      console.error('Error sending token to pool:', error)
      this.showError('Error al enviar token')
    } finally {
      const sendBtn = document.getElementById('send-selected-btn')
      sendBtn.disabled = false
      sendBtn.textContent = '📤 Enviar al Pool'
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager()
})
