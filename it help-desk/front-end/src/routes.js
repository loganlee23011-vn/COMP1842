import { createRouter, createWebHistory } from 'vue-router'
import Words from './views/Words.vue'
import New from './views/New.vue'
import Show from './views/Show.vue'
import Edit from './views/Edit.vue'
import Tickets from './views/Tickets.vue'
import NewTicket from './views/NewTicket.vue'
import ShowTicket from './views/ShowTicket.vue'
import EditTicket from './views/EditTicket.vue'
import Test from './views/Test.vue'
import Overview from './views/Overview.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import AcceptInvite from './views/AcceptInvite.vue'
import ForgotPassword from './views/ForgotPassword.vue'
import ResetPassword from './views/ResetPassword.vue'
import Reports from './views/Reports.vue'
import Agents from './views/Agents.vue'
import Profile from './views/Profile.vue'
import Contact from './views/Contact.vue'
import Landing from './views/Landing.vue'
import Docs from './views/Docs.vue'
import { sessionState } from './helpers/session'

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing,
      //not use layout navbar in vue
      meta: { hideAppShell: true },
    },
    {
      path: '/docs',
      name: 'docs',
      component: Docs,
      meta: { hideAppShell: true },
    },
    {
      path: '/overview',
      name: 'overview',
      component: Overview,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { hideAppShell: true },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { hideAppShell: true },
    },
    {
      path: '/accept-invite',
      name: 'accept-invite',
      component: AcceptInvite,
      meta: { hideAppShell: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword,
      meta: { hideAppShell: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPassword,
      meta: { hideAppShell: true },
    },
    {
      path: '/words',
      name: 'words',
      component: Words,
      meta: { requiresAuth: true },
    },
    {
      path: '/words/new',
      name: 'new-word',
      component: New,
      meta: { requiresAuth: true },
    },
    {
      path: '/words/:id',
      name: 'show',
      component: Show,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/words/:id/edit',
      name: 'edit',
      component: Edit,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: Tickets,
      meta: { requiresAuth: true },
    },
    {
      path: '/tickets/new',
      name: 'new-ticket',
      component: NewTicket,
      meta: { requiresAuth: true },
    },
    {
      path: '/tickets/:id',
      name: 'show-ticket',
      component: ShowTicket,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/tickets/:id/edit',
      name: 'edit-ticket',
      component: EditTicket,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
      meta: { requiresAuth: true },
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports,
      meta: { requiresAuth: true },
    },
    {
      path: '/agents',
      name: 'agents',
      component: Agents,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true },
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
      meta: { hideAppShell: false },
    },
  ],
})

//call back
router.beforeEach((to, from, next) => {
  const isLoggedIn = Boolean(sessionState.user)

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login' })
    return
  }

  if (
    (to.name === 'login' || to.name === 'register' || to.name === 'forgot-password' || to.name === 'reset-password')
    && isLoggedIn
  ) {
    next({ name: 'tickets' })
    return
  }

  next()
})

export default router
