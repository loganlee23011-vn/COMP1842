import { reactive } from 'vue'

const storedUser = window.localStorage.getItem('helpdesk-user')
const storedToken = window.localStorage.getItem('helpdesk-token')

//reload page
export const sessionState = reactive({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || '',
})

export function setSession(user, token) {
  sessionState.user = user
  sessionState.token = token
  window.localStorage.setItem('helpdesk-user', JSON.stringify(user))
  window.localStorage.setItem('helpdesk-token', token)
}

export function updateSessionUser(user) {
  sessionState.user = user
  window.localStorage.setItem('helpdesk-user', JSON.stringify(user))
}

export function clearSessionUser() {
  sessionState.user = null
  sessionState.token = ''
  window.localStorage.removeItem('helpdesk-user')
  window.localStorage.removeItem('helpdesk-token')
}
