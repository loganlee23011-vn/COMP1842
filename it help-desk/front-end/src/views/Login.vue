<template>
  <div class="auth-screen">
    <div class="auth-panel">
      <RouterLink class="auth-brand" :to="{ name: 'landing' }">IT <span>Helply</span></RouterLink>

      <div class="auth-copy">
        <h1>Login</h1>
      </div>

      <form class="ui form auth-form" @submit.prevent="onSubmit">
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="agent@company.com" />
        </div>

        <div class="field">
          <label>Password</label>
          <input v-model="form.password" type="password" placeholder="Enter password" />
        </div>

        <RouterLink class="utility-link" :to="{ name: 'forgot-password' }">
          Forgot password?
        </RouterLink>

        <div v-if="error" class="ui negative message">
          {{ error }}
        </div>

        <button class="ui primary fluid button" type="submit">Login</button>
        <RouterLink class="ui button fluid" :to="{ name: 'register' }">Create First Agent Account</RouterLink>
      </form>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers/helpers'
import { setSession } from '../helpers/session'

export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      error: '',
    }
  },
  methods: {
    async onSubmit() {
      if (this.form.email.trim() === '' || this.form.password.trim() === '') {
        this.error = 'Please enter both your email and password.'
        return
      }

      try {
        //validate client to server
        const res = await api.login(this.form)
        this.error = ''
        setSession(res.user, res.token)
        this.flash(`Signed in as ${res.user.name}`, 'success')
        this.$router.push('/tickets')
      } catch (error) {
        this.error = error?.response?.data?.message || 'Login failed.'
      }
    },
  },
}
</script>

<style scoped>
.auth-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 18px;
  background: #f4f6f8;
}

.auth-panel {
  width: min(100%, 460px);
  background: #fff;
  border: 1px solid #dfe6ec;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.auth-brand {
  display: inline-block;
  margin-bottom: 14px;
  font-family: Georgia, serif;
  font-size: 1.5rem;
  color: #111827;
  text-decoration: none;
}

.auth-brand span {
  color: #2554ff;
}

.auth-copy h1 {
  margin: 10px 0 10px;
  font-size: 2rem;
  color: #1f2937;
}

.auth-copy p {
  color: #5f6b7a;
  line-height: 1.6;
}

.auth-form {
  margin-top: 22px;
}

.auth-form :deep(.ui.primary.button) {
  background: #1f2937;
}

.auth-form :deep(.ui.primary.button:hover) {
  background: #111827;
}

.auth-form :deep(.ui.button) {
  border-radius: 8px;
}

.auth-form :deep(.ui.button:not(.primary)) {
  background: #f8fafc;
  color: #334155;
}

.auth-form :deep(.ui.button:not(.primary):hover) {
  background: #eef2f7;
  color: #1f2937;
}

.utility-link {
  display: inline-block;
  margin-bottom: 12px;
  color: #1f2937;
}

.utility-link:hover {
  color: #1f2937;
}

.auth-form input {
  border-radius: 8px;
}
</style>
