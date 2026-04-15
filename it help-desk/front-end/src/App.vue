<template>
  <div id="app">
    <RouterView v-if="$route.meta.hideAppShell" />
    <template v-else>
    <div class="ui inverted segment navbar">
      <div class="ui container">
        <div class="nav-shell">
          <div class="ui large secondary inverted pointing menu compact">
            <RouterLink to="/tickets" class="item">Tickets</RouterLink>
            <RouterLink to="/words" class="item">Library</RouterLink>
            <RouterLink to="/test" class="item">Training Quiz</RouterLink>
            <RouterLink to="/reports" class="item">Reports</RouterLink>
            <RouterLink to="/agents" class="item">Agents</RouterLink>
            <RouterLink to="/contact" class="item">Contact</RouterLink>
          </div>
          <div class="ui secondary inverted menu compact auth-links">
            <template v-if="sessionState.user">
              <div ref="profileShell" class="profile-shell">
                <button class="profile-trigger" @click="profileOpen = !profileOpen">
                  {{ profileInitial }}
                </button>
                <div v-if="profileOpen" class="profile-menu">
                  <strong>{{ sessionState.user.name }}</strong>
                  <span>{{ sessionState.user.email }}</span>
                  <span>{{ sessionState.user.department }}</span>
                  <span class="profile-role">{{ sessionState.user.role }}</span>
                  <RouterLink class="profile-link" :to="{ name: 'profile' }" @click="profileOpen = false">
                    Edit Profile
                  </RouterLink>
                  <button class="profile-logout" @click="logout">Logout</button>
                </div>
              </div>
            </template>
            <template v-else>
              <RouterLink to="/login" class="item">Login</RouterLink>
              <RouterLink to="/register" class="item">Register</RouterLink>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="ui container app-body">
      <div
        v-if="flashState.visible"
        :class="['ui message myFlash', flashClass]"
      >
        {{ flashState.message }}
      </div>
      <div class="ui one column grid">
        <div class="column">
          <RouterView />
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script>
import { flashState } from './helpers/flash'
import { clearSessionUser, sessionState } from './helpers/session'

export default {
  name: 'App',
  data() {
    return {
      flashState,
      sessionState,
      profileOpen: false,
    }
  },
  mounted() {
    document.addEventListener('click', this.handleDocumentClick)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleDocumentClick)
  },
  computed: {
    flashClass() {
      return this.flashState.type === 'error' ? 'negative' : 'positive'
    },
    profileInitial() {
      return this.sessionState.user?.name?.charAt(0)?.toUpperCase() || 'U'
    },
  },
  methods: {
    handleDocumentClick(event) {
      if (!this.profileOpen) return

      const profileShell = this.$refs.profileShell
      if (profileShell && !profileShell.contains(event.target)) {
        this.profileOpen = false
      }
    },
    logout() {
      this.profileOpen = false
      clearSessionUser()
      this.flash('You have been logged out.', 'success')
      this.$router.push('/login')
    },
  },
}
</script>

<style>
body {
  margin: 0;
  background: #f8fafc;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app > div.navbar {
  margin-bottom: 1.5em;
  border-radius: 0;
}

.nav-shell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.auth-links {
  margin: 0;
}

.profile-shell {
  position: relative;
}

.profile-trigger {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: #374151;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0;
}

.profile-menu {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  min-width: 220px;
  padding: 14px;
  border-radius: 14px;
  background: #fff;
  color: #1f2937;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  display: grid;
  gap: 6px;
  z-index: 20;
}

.profile-menu span {
  font-size: 13px;
  color: #64748b;
}

.profile-role {
  text-transform: capitalize;
}

.profile-link {
  margin-top: 6px;
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;
}

.profile-link:hover {
  text-decoration: underline;
}

.profile-logout {
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #dbe4f0;
  background: #f8fafc;
  cursor: pointer;
}

.profile-logout:hover {
  background: #eef2f7;
}

.app-body {
  padding-bottom: 30px;
  max-width: 1280px !important;
}

.myFlash {
  width: 280px;
  margin: 10px;
  position: absolute;
  top: 55px;
  right: 10px;
}

button.ui.button {
  margin-top: 15px;
}

.ui.table {
  width: 100%;
}

.ui.message.myFlash {
  z-index: 10;
}
</style>
