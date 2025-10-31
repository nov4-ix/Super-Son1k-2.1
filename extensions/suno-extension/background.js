// Background script for Super-Son1k Token Capture Extension

class TokenCaptureService {
  constructor() {
    this.initializeService()
  }

  async initializeService() {
    console.log('Super-Son1k Token Capture Service initialized')
    
    // Listen for messages from content scripts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse)
      return true // Keep message channel open for async response
    })

    // Listen for web requests to capture tokens
    chrome.webRequest.onBeforeSendHeaders.addListener(
      (details) => {
        this.captureTokenFromRequest(details)
      },
      { urls: ["https://api.suno.ai/*"] },
      ["requestHeaders"]
    )

    // Listen for responses to extract tokens from API responses
    chrome.webRequest.onHeadersReceived.addListener(
      (details) => {
        this.captureTokenFromResponse(details)
      },
      { urls: ["https://api.suno.ai/*", "https://suno.com/*"] },
      ["responseHeaders"]
    )
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.type) {
        case 'CAPTURE_TOKEN':
          await this.captureToken(message.token, message.metadata)
          sendResponse({ success: true })
          break

        case 'GET_CAPTURED_TOKENS':
          const tokens = await this.getCapturedTokens()
          sendResponse({ success: true, tokens })
          break

        case 'SYNC_TOKENS':
          await this.syncTokensToServer()
          sendResponse({ success: true })
          break

        case 'CLEAR_TOKENS':
          await this.clearTokens()
          sendResponse({ success: true })
          break

        case 'EXTRACT_TOKEN_FROM_COOKIES':
          try {
            const extracted = await this.extractTokenFromCookies()
            // Also capture it locally
            await this.captureToken(extracted.token, {
              url: extracted.url,
              source: 'cookie-extraction',
              deviceId: extracted.deviceId
            })
            sendResponse({ success: true, data: extracted })
          } catch (error) {
            sendResponse({ success: false, error: error.message })
          }
          break

        case 'SEND_TOKEN_TO_POOL':
          try {
            const { token, label } = message
            const result = await this.sendTokenToPool(token, label)
            sendResponse({ success: true, data: result })
          } catch (error) {
            sendResponse({ success: false, error: error.message })
          }
          break

        case 'EXTRACT_AND_SEND_TO_POOL':
          try {
            // Extract token from cookies
            const extracted = await this.extractTokenFromCookies()
            // Capture locally
            await this.captureToken(extracted.token, {
              url: extracted.url,
              source: 'cookie-extraction-auto',
              deviceId: extracted.deviceId
            })
            // Send to pool
            const label = message.label || `extension-${Date.now()}`
            const poolResult = await this.sendTokenToPool(extracted.token, label)
            sendResponse({ 
              success: true, 
              data: {
                extracted,
                pool: poolResult
              }
            })
          } catch (error) {
            sendResponse({ success: false, error: error.message })
          }
          break

        default:
          sendResponse({ success: false, error: 'Unknown message type' })
      }
    } catch (error) {
      console.error('Error handling message:', error)
      sendResponse({ success: false, error: error.message })
    }
  }

  async captureToken(token, metadata = {}) {
    try {
      // Validate token format
      if (!this.isValidToken(token)) {
        throw new Error('Invalid token format')
      }

      // Get existing tokens
      const result = await chrome.storage.local.get(['capturedTokens'])
      const tokens = result.capturedTokens || []

      // Check if token already exists
      const existingToken = tokens.find(t => t.token === token)
      if (existingToken) {
        console.log('Token already captured')
        return
      }

      // Add new token
      const newToken = {
        id: this.generateTokenId(),
        token: token,
        capturedAt: new Date().toISOString(),
        source: 'extension',
        metadata: {
          url: metadata.url || 'unknown',
          userAgent: navigator.userAgent,
          ...metadata
        },
        isValid: true,
        lastUsed: null,
        usageCount: 0
      }

      tokens.push(newToken)

      // Store tokens
      await chrome.storage.local.set({ capturedTokens: tokens })

      // Notify content script
      this.notifyTokenCaptured(newToken)

      console.log('Token captured successfully:', newToken.id)
    } catch (error) {
      console.error('Error capturing token:', error)
      throw error
    }
  }

  async getCapturedTokens() {
    try {
      const result = await chrome.storage.local.get(['capturedTokens'])
      return result.capturedTokens || []
    } catch (error) {
      console.error('Error getting captured tokens:', error)
      return []
    }
  }

  async syncTokensToServer() {
    try {
      const tokens = await this.getCapturedTokens()
      const validTokens = tokens.filter(token => token.isValid)

      if (validTokens.length === 0) {
        console.log('No tokens to sync')
        return
      }

      // Get backend URL from configuration or use localhost for development
      const backendUrl = this.getBackendUrl()

      // Send tokens to Super-Son1k backend
      const response = await fetch(`${backendUrl}/api/tokens/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Extension-Version': '2.0.0'
        },
        body: JSON.stringify({
          tokens: validTokens,
          extensionId: chrome.runtime.id
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Tokens synced successfully:', result)
        
        // Update local tokens with server response
        await this.updateLocalTokens(result.tokens)
      } else {
        throw new Error(`Sync failed: ${response.status}`)
      }
    } catch (error) {
      console.error('Error syncing tokens:', error)
      throw error
    }
  }

  async sendTokenToPool(token, label = 'extension-auto') {
    try {
      // Get Generator URL from storage or use default
      const result = await chrome.storage.local.get(['generatorUrl'])
      const generatorUrl = result.generatorUrl || 'https://the-generator.son1kvers3.com'

      console.log(`Sending token to pool: ${generatorUrl}`)

      const response = await fetch(`${generatorUrl}/api/token-pool/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          label: label
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Token sent to pool successfully:', data)
        return { success: true, data }
      } else {
        const errorText = await response.text()
        console.error('Pool API error:', response.status, errorText)
        throw new Error(`Pool API error: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Error sending token to pool:', error)
      throw error
    }
  }

  async extractTokenFromCookies() {
    try {
      // Get active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tabs[0] || !tabs[0].url.includes('suno.com')) {
        throw new Error('Not on Suno.com')
      }

      // Inject script to read cookies
      const results = await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          function getCookie(name) {
            const value = `; ${document.cookie}`
            const parts = value.split(`; ${name}=`)
            if (parts.length === 2) return parts.pop().split(';').shift()
            return null
          }

          return {
            jwtToken: getCookie('__client'),
            deviceId: getCookie('singular_device_id') || getCookie('ajs_anonymous_id'),
            url: window.location.href
          }
        }
      })

      if (results && results[0] && results[0].result) {
        const { jwtToken, deviceId, url } = results[0].result
        
        if (!jwtToken) {
          throw new Error('No JWT token found in cookies. Make sure you are logged in to Suno.com')
        }

        return {
          token: jwtToken,
          deviceId: deviceId,
          url: url,
          extractedAt: new Date().toISOString()
        }
      }

      throw new Error('Failed to extract token from cookies')
    } catch (error) {
      console.error('Error extracting token from cookies:', error)
      throw error
    }
  }

  async updateLocalTokens(serverTokens) {
    try {
      const result = await chrome.storage.local.get(['capturedTokens'])
      const localTokens = result.capturedTokens || []

      // Update local tokens with server data
      const updatedTokens = localTokens.map(localToken => {
        const serverToken = serverTokens.find(st => st.id === localToken.id)
        if (serverToken) {
          return {
            ...localToken,
            ...serverToken,
            lastSynced: new Date().toISOString()
          }
        }
        return localToken
      })

      await chrome.storage.local.set({ capturedTokens: updatedTokens })
    } catch (error) {
      console.error('Error updating local tokens:', error)
    }
  }

  async clearTokens() {
    try {
      await chrome.storage.local.remove(['capturedTokens'])
      console.log('Tokens cleared successfully')
    } catch (error) {
      console.error('Error clearing tokens:', error)
      throw error
    }
  }

  captureTokenFromRequest(details) {
    try {
      const headers = details.requestHeaders
      const authHeader = headers.find(h => h.name.toLowerCase() === 'authorization')

      if (authHeader && authHeader.value.startsWith('Bearer ')) {
        const token = authHeader.value.substring(7)

        // Capture token asynchronously
        this.captureToken(token, {
          url: details.url,
          method: details.method,
          timestamp: new Date().toISOString()
        }).catch(error => {
          console.error('Error capturing token from request:', error)
        })
      }
    } catch (error) {
      console.error('Error processing request:', error)
    }
  }

  captureTokenFromResponse(details) {
    try {
      // Only process if URL contains 'token' or 'api'
      if (!details.url.includes('token') && !details.url.includes('api')) {
        return
      }

      // For API responses, we need to intercept the actual response body
      // This is more complex and requires additional setup
      // For now, we'll look for tokens in the URL or headers

      // Check if it's a success response (2xx)
      if (details.statusCode >= 200 && details.statusCode < 300) {
        // Attempt to fetch the response content (limited by Chrome API restrictions)
        // This would ideally be handled by content script
        console.log('API response detected:', details.url, details.statusCode)

        // For token-api endpoints, trigger content script to inspect response
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'INSPECT_API_RESPONSE',
              url: details.url,
              statusCode: details.statusCode
            }).catch(() => {
              // Tab might not have content script
            })
          }
        })
      }
    } catch (error) {
      console.error('Error processing response:', error)
    }
  }

  notifyTokenCaptured(token) {
    // Send notification to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'TOKEN_CAPTURED',
          token: token
        }).catch(() => {
          // Ignore errors for tabs that don't have content script
        })
      })
    })
  }

  isValidToken(token) {
    // Basic token validation
    return typeof token === 'string' && token.length > 20 && token.includes('-')
  }

  generateTokenId() {
    return 'ext_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  getBackendUrl() {
    // For development, use localhost. For production, use configured URL
    // This could be enhanced to get from chrome.storage or configuration
    try {
      // Check if we're in development mode (extension installed from file://)
      if (chrome.runtime.getURL('').startsWith('chrome-extension://') &&
          !chrome.runtime.getURL('').includes('chrome.google.com')) {
        // Development mode - use localhost
        return 'http://localhost:3001'
      } else {
        // Production mode - use configured URL or fallback
        return 'https://api.super-son1k.com'
      }
    } catch (error) {
      // Fallback to localhost for development
      return 'http://localhost:3001'
    }
  }
}

// Initialize the service
new TokenCaptureService()
