// Content script for Suno.com token capture

class SunoTokenCapture {
  constructor() {
    this.initializeCapture()
  }

  initializeCapture() {
    // Silent initialization - no console logs in production
    if (process.env.NODE_ENV === 'development') {
      console.log('Son1kVerse AI Engine initialized')
    }

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'TOKEN_CAPTURED') {
        this.showTokenCapturedNotification(message.token)
      } else if (message.type === 'INSPECT_API_RESPONSE') {
        this.inspectAPIResponse(message.url, message.statusCode)
      }
    })

    // Monitor network requests for tokens
    this.monitorNetworkRequests()
    
    // Monitor localStorage for tokens
    this.monitorLocalStorage()
    
    // Monitor sessionStorage for tokens
    this.monitorSessionStorage()
  }

  monitorNetworkRequests() {
    // Override fetch to capture tokens
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const response = await originalFetch(...args)
      
      // Check if this is a Suno API request
      if (args[0] && typeof args[0] === 'string' && args[0].includes('api.suno.ai')) {
        this.extractTokenFromRequest(args[1])
      }
      
      return response
    }

    // Override XMLHttpRequest to capture tokens
    const originalXHROpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this._url = url
      return originalXHROpen.call(this, method, url, ...args)
    }

    const originalXHRSend = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send = function(data) {
      if (this._url && this._url.includes('api.suno.ai')) {
        this.extractTokenFromRequest({ body: data })
      }
      return originalXHRSend.call(this, data)
    }
  }

  extractTokenFromRequest(requestConfig) {
    try {
      // Check headers
      if (requestConfig && requestConfig.headers) {
        const authHeader = requestConfig.headers.Authorization || requestConfig.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7)
          this.captureToken(token, 'request_header')
        }
      }

      // Check body for tokens
      if (requestConfig && requestConfig.body) {
        try {
          const body = typeof requestConfig.body === 'string' ? 
            JSON.parse(requestConfig.body) : requestConfig.body
          
          if (body && body.token) {
            this.captureToken(body.token, 'request_body')
          }
        } catch (error) {
          // Ignore JSON parse errors
        }
      }
    } catch (error) {
      console.error('Error extracting token from request:', error)
    }
  }

  monitorLocalStorage() {
    const originalSetItem = localStorage.setItem
    localStorage.setItem = function(key, value) {
      const result = originalSetItem.call(this, key, value)
      
      // Check if this looks like a token
      if (key.toLowerCase().includes('token') || key.toLowerCase().includes('auth')) {
        try {
          const tokenData = JSON.parse(value)
          if (tokenData && tokenData.token) {
            window.sunoTokenCapture?.captureToken(tokenData.token, 'localStorage')
          }
        } catch (error) {
          // If not JSON, check if it's a plain token
          if (typeof value === 'string' && value.length > 20) {
            window.sunoTokenCapture?.captureToken(value, 'localStorage')
          }
        }
      }
      
      return result
    }
  }

  monitorSessionStorage() {
    const originalSetItem = sessionStorage.setItem
    sessionStorage.setItem = function(key, value) {
      const result = originalSetItem.call(this, key, value)
      
      // Check if this looks like a token
      if (key.toLowerCase().includes('token') || key.toLowerCase().includes('auth')) {
        try {
          const tokenData = JSON.parse(value)
          if (tokenData && tokenData.token) {
            window.sunoTokenCapture?.captureToken(tokenData.token, 'sessionStorage')
          }
        } catch (error) {
          // If not JSON, check if it's a plain token
          if (typeof value === 'string' && value.length > 20) {
            window.sunoTokenCapture?.captureToken(value, 'sessionStorage')
          }
        }
      }
      
      return result
    }
  }

  async captureToken(token, source) {
    try {
      // Send token to background script
      await chrome.runtime.sendMessage({
        type: 'CAPTURE_TOKEN',
        token: token,
        metadata: {
          source: source,
          url: window.location.href,
          timestamp: new Date().toISOString()
        }
      })

      console.log('Token captured from:', source)
    } catch (error) {
      console.error('Error capturing token:', error)
    }
  }

  showTokenCapturedNotification(token) {
    // Create notification element
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #00FFE7;
      color: #000;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease-out;
    `

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 8px; height: 8px; background: #000; border-radius: 50%;"></div>
        <span>Token captured!</span>
      </div>
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

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  // Inspect API responses for JWT tokens
  inspectAPIResponse(url, statusCode) {
    try {
      // Only inspect successful responses (2xx)
      if (statusCode < 200 || statusCode >= 300) {
        return
      }

      // Use Performance API to get response data
      if (window.performance && window.performance.getEntries) {
        const entries = window.performance.getEntriesByType('resource')
        const apiEntry = entries.find(entry =>
          entry.name === url && entry.transferSize > 0
        )

        if (!apiEntry) {
          // Fallback: intercept current API calls
          this.interceptAPIResponses(url)
        }
      }

      console.log('Inspecting API response:', url, statusCode)
    } catch (error) {
      console.error('Error inspecting API response:', error)
    }
  }

  // Intercept and inspect API responses for JWT tokens
  interceptAPIResponses(targetUrl) {
    // Enhanced fetch interception for response inspection
    const originalFetch = window.fetch

    window.fetch = async (...args) => {
      const response = await originalFetch(...args)

      // Check if this is the target URL or contains 'token'/'api'
      if (args[0] && typeof args[0] === 'string' &&
          (args[0] === targetUrl || args[0].includes('token') || args[0].includes('api'))) {

        try {
          // Clone the response to read the body without consuming it
          const clonedResponse = response.clone()

          // Try to parse JSON response for JWT tokens
          const contentType = clonedResponse.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const responseData = await clonedResponse.json()
            this.extractTokenFromResponse(responseData, args[0])
          } else {
            // For non-JSON responses, try to get as text
            const responseText = await clonedResponse.text()
            this.extractTokenFromText(responseText, args[0])
          }
        } catch (error) {
          console.error('Error inspecting response body:', error)
        }
      }

      return response
    }
  }

  // Extract tokens from API response data
  extractTokenFromResponse(data, url) {
    try {
      if (!data) return

      // Look for JWT tokens in response fields
      this.findJWTsInObject(data, url, 'response_body')

    } catch (error) {
      console.error('Error extracting token from response:', error)
    }
  }

  // Extract tokens from text response
  extractTokenFromText(text, url) {
    try {
      if (!text || typeof text !== 'string') return

      // Look for JWT patterns in text
      const jwtPattern = /[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/g
      const matches = text.match(jwtPattern)

      if (matches) {
        matches.forEach(token => {
          // JWT tokens contain dots and are usually long
          if (token.length > 20) {
            this.captureToken(token, 'api_response_text')
          }
        })
      }
    } catch (error) {
      console.error('Error extracting token from text:', error)
    }
  }

  // Recursively search for JWT tokens in object
  findJWTsInObject(obj, url, source) {
    try {
      if (!obj || typeof obj !== 'object') return

      for (const [key, value] of Object.entries(obj)) {
        // Look in keys that might contain tokens
        if (key.toLowerCase().includes('token') ||
            key.toLowerCase().includes('jwt') ||
            key.toLowerCase().includes('auth')) {

          if (typeof value === 'string' && value.includes('.')) {
            // Likely a JWT token
            this.captureToken(value, `api_response_${source}_key_${key}`)
          } else if (typeof value === 'object' && value !== null) {
            // Nested object might contain tokens
            this.findJWTsInObject(value, url, `${source}_nested_${key}`)
          }
        }

        // Also check all string values for JWT patterns
        if (typeof value === 'string' && value.length > 50 && value.includes('.')) {
          const jwtPattern = /[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/
          if (jwtPattern.test(value)) {
            this.captureToken(value, `api_response_${source}_scan_${key}`)
          }
        } else if (typeof value === 'object' && value !== null) {
          this.findJWTsInObject(value, url, `${source}_recursive`)
        }
      }
    } catch (error) {
      console.error('Error searching for JWTs in object:', error)
    }
  }

  // Scan existing storage for tokens
  scanExistingTokens() {
    try {
      // Check localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.toLowerCase().includes('token') || key.toLowerCase().includes('auth'))) {
          const value = localStorage.getItem(key)
          if (value) {
            try {
              const tokenData = JSON.parse(value)
              if (tokenData && tokenData.token) {
                this.captureToken(tokenData.token, 'localStorage_existing')
              }
            } catch (error) {
              if (typeof value === 'string' && value.length > 20) {
                this.captureToken(value, 'localStorage_existing')
              }
            }
          }
        }
      }

      // Check sessionStorage
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && (key.toLowerCase().includes('token') || key.toLowerCase().includes('auth'))) {
          const value = sessionStorage.getItem(key)
          if (value) {
            try {
              const tokenData = JSON.parse(value)
              if (tokenData && tokenData.token) {
                this.captureToken(tokenData.token, 'sessionStorage_existing')
              }
            } catch (error) {
              if (typeof value === 'string' && value.length > 20) {
                this.captureToken(value, 'sessionStorage_existing')
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error scanning existing tokens:', error)
    }
  }
}

// Initialize token capture
window.sunoTokenCapture = new SunoTokenCapture()

// Scan existing tokens after a short delay
setTimeout(() => {
  window.sunoTokenCapture.scanExistingTokens()
}, 1000)
