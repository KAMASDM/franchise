const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Brand related API calls
  async getBrands(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/brands?${queryParams}`)
  }

  async getBrandById(id) {
    return this.request(`/brands/${id}`)
  }

  async getBrandLocations(id) {
    return this.request(`/brands/${id}/locations`)
  }

  // Lead capture and form submissions
  async submitLeadCapture(data) {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async submitFranchiseInquiry(data) {
    return this.request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async submitContactForm(data) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Blog related API calls (would integrate with Gemini API)
  async getBlogs(category = null, limit = null) {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (limit) params.append('limit', limit)
    
    return this.request(`/blogs?${params.toString()}`)
  }

  async generateBlogContent(topic, brand = null) {
    return this.request('/blogs/generate', {
      method: 'POST',
      body: JSON.stringify({ topic, brand })
    })
  }

  // Chat/support related
  async sendChatMessage(message, conversationId = null) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId })
    })
  }

  // Analytics and tracking
  async trackEvent(eventName, properties = {}) {
    return this.request('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ event: eventName, properties })
    })
  }

  async trackPageView(page) {
    return this.request('/analytics/pageview', {
      method: 'POST',
      body: JSON.stringify({ page })
    })
  }
}

export const apiService = new ApiService()
export default apiService
