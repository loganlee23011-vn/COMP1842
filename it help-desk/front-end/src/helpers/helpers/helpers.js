import axios from 'axios'
import { flash } from '../flash'
import { clearSessionUser, sessionState } from '../session'

//send api to express
const baseURL = 'http://localhost:3000'
const http = axios.create({
  baseURL,
})


//asign token
http.interceptors.request.use((config) => {
  if (sessionState.token) {
    config.headers.Authorization = `Bearer ${sessionState.token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearSessionUser()
    }
    return Promise.reject(error)
  },
)

const handleError = (fn) => async (...params) => {
  try {
    return await fn(...params)
  } catch (error) {
    const message = error?.response?.data?.message
      || (error?.response
        ? `${error.response.status}: ${error.response.statusText}`
        : 'Request failed')
    flash(message, 'error')
    throw error
  }
}

//object api

export const api = {
  //call endpoint backend
  getWord: handleError(async (id) => {
    const res = await http.get(`/words/${id}`)
    return res.data
  }),
  getWords: handleError(async () => {
    const res = await http.get('/words')
    return res.data
  }),
  deleteWord: handleError(async (id) => {
    const res = await http.delete(`/words/${id}`)
    return res.data
  }),
  createWord: handleError(async (payload) => {
    const res = await http.post('/words', payload)
    return res.data
  }),
  updateWord: handleError(async (payload) => {
    const res = await http.put(`/words/${payload._id}`, payload)
    return res.data
  }),
  getTickets: handleError(async () => {
    const res = await http.get('/tickets')
    return res.data
  }),
  getTicket: handleError(async (id) => {
    const res = await http.get(`/tickets/${id}`)
    return res.data
  }),
  createTicket: handleError(async (payload) => {
    const res = await http.post('/tickets', payload)
    return res.data
  }),
  updateTicket: handleError(async (payload) => {
    const res = await http.put(`/tickets/${payload._id}`, payload)
    return res.data
  }),
  deleteTicket: handleError(async (id) => {
    const res = await http.delete(`/tickets/${id}`)
    return res.data
  }),
  register: handleError(async (payload) => {
    const res = await http.post('/auth/register', payload)
    return res.data
  }),
  login: handleError(async (payload) => {
    const res = await http.post('/auth/login', payload)
    return res.data
  }),
  forgotPassword: handleError(async (payload) => {
    const res = await http.post('/auth/forgot-password', payload)
    return res.data
  }),
  resetPassword: handleError(async (payload) => {
    const res = await http.post('/auth/reset-password', payload)
    return res.data
  }),
  getInvitation: handleError(async (token) => {
    const res = await http.get(`/auth/invitation?token=${encodeURIComponent(token)}`)
    return res.data
  }),
  acceptInvitation: handleError(async (payload) => {
    const res = await http.post('/auth/accept-invite', payload)
    return res.data
  }),
  contactSupport: handleError(async (payload) => {
    const res = await http.post('/contact', payload)
    return res.data
  }),
  getProfile: handleError(async () => {
    const res = await http.get('/auth/profile')
    return res.data
  }),
  updateProfile: handleError(async (payload) => {
    const res = await http.put('/auth/profile', payload)
    return res.data
  }),
  getUsers: handleError(async (role) => {
    const query = role ? `?role=${encodeURIComponent(role)}` : ''
    const res = await http.get(`/users${query}`)
    return res.data
  }),
  getTeams: handleError(async () => {
    const res = await http.get('/teams')
    return res.data
  }),
  createTeam: handleError(async (payload) => {
    const res = await http.post('/teams', payload)
    return res.data
  }),
  getInvitations: handleError(async () => {
    const res = await http.get('/invitations')
    return res.data
  }),
  inviteAgent: handleError(async (teamId, payload) => {
    const res = await http.post(`/teams/${teamId}/invite`, payload)
    return res.data
  }),
  remindInvitation: handleError(async (invitationId) => {
    const res = await http.post(`/invitations/${invitationId}/remind`)
    return res.data
  }),
}
