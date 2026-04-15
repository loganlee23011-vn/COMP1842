<template>
  <div class="auth-screen">
    <div class="auth-panel">
      <div class="auth-copy">
        <h1>Reset Password</h1>
        <p>Enter a new password for your helpdesk account.</p>
      </div>

      <form class="ui form auth-form" @submit.prevent="onSubmit">
        <div class="field">
          <label>New Password</label>
          <input v-model="form.password" type="password" placeholder="Enter new password" />
        </div>

        <div class="field">
          <label>Confirm Password</label>
          <input v-model="form.confirmPassword" type="password" placeholder="Repeat new password" />
        </div>

        <div v-if="message" class="ui positive message">
          {{ message }}
        </div>

        <div v-if="error" class="ui negative message">
          {{ error }}
        </div>

        <button class="ui primary fluid button" type="submit">Reset Password</button>
        <RouterLink class="ui button fluid" :to="{ name: 'login' }">Back to Login</RouterLink>
      </form>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers/helpers'

export default {
  name: 'ResetPasswordView',
  data() {
    return {
      form: {
        password: '',
        confirmPassword: '',
      },
      error: '',
      message: '',
    }
  },
  computed: {
    token() {
      return this.$route.query.token || ''
    },
  },
  methods: {
    async onSubmit() {
      if (!this.token) {
        this.error = 'Reset token is missing from the link.'
        this.message = ''
        return
      }

      if (this.form.password.trim() === '' || this.form.confirmPassword.trim() === '') {
        this.error = 'Please enter and confirm your new password.'
        this.message = ''
        return
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'Passwords do not match.'
        this.message = ''
        return
      }

      try {
        const res = await api.resetPassword({
          token: this.token,
          password: this.form.password,
        })
        this.error = ''
        this.message = res.message
      } catch (error) {
        this.message = ''
        this.error = error?.response?.data?.message || 'Could not reset password.'
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

.auth-form input {
  border-radius: 8px;
}
</style>
