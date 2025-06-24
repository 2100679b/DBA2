// frontend/src/servicios/SessionStore.js

class SessionStore {
  constructor() {
    this.storageKey = 'app_session'
    this.tokenKey = 'auth_token'
    this.userKey = 'user_data'
  }

  // Métodos para manejo de token
  setToken(token) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.tokenKey, token)
    }
  }

  getToken() {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.tokenKey)
    }
    return null
  }

  removeToken() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.tokenKey)
    }
  }

  // Métodos para datos de usuario
  setUser(userData) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.userKey, JSON.stringify(userData))
    }
  }

  getUser() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = localStorage.getItem(this.userKey)
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  removeUser() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.userKey)
    }
  }

  // Métodos para sesión completa
  setSession(sessionData) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.storageKey, JSON.stringify(sessionData))
    }
  }

  getSession() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const sessionData = localStorage.getItem(this.storageKey)
      return sessionData ? JSON.parse(sessionData) : null
    }
    return null
  }

  clearSession() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.storageKey)
      localStorage.removeItem(this.tokenKey)
      localStorage.removeItem(this.userKey)
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!this.getToken()
  }

  // Obtener headers para peticiones HTTP
  getAuthHeaders() {
    const token = this.getToken()
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    }
  }
}

// Exportar una instancia singleton
const sessionStorage = new SessionStore()
export default sessionStorage