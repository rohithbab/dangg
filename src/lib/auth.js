const AUTH_KEY = 'dangg_admin_auth'
const ADMIN_USERNAME = 'admin@danggapp'
const ADMIN_PASSWORD = 'Admin@Danggapp2026'

export function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === 'true'
}

export function login(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, 'true')
    return true
  }
  return false
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}
